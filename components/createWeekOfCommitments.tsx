import { MyDate } from "@/types/workouts";
import { Pressable, ScrollView, Text, View, TouchableOpacity, KeyboardAvoidingView } from "react-native"
import Entypo from '@expo/vector-icons/Entypo';
import { useCallback, useEffect, useRef, useState } from "react";
import Fontisto from '@expo/vector-icons/Fontisto';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import AddWorkoutModal from "./addWorkout";
import SpinLoader from "./spinLoader"
import { collection, addDoc, serverTimestamp, setDoc, updateDoc, doc, DocumentReference } from 'firebase/firestore';
import { FIRESTORE_DB } from "../firebaseConfig";
import { useAtom } from "jotai";
import { userState } from "@/storage/atomStorage";
import { getSundayOfWeek } from "@/util/helpers";

// const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

const CreateWeekOfCommitments = ({ days, onCancel }: { days: MyDate[], onCancel: () => void }) => {

    const [user, setUser] = useAtom(userState);

    const [formData, setFormData] = useState<Record<string, any>[]>([]);
    const [currSelection, setCurrSelection] = useState<null | number>(null);
    const [loading, setLoading] = useState(false);

    const scrollRef = useRef<ScrollView | null>(null);

    const handleWorkoutSelection = (index: number) => {
        setCurrSelection(index)
        setTimeout(() => {
            scrollRef?.current?.scrollTo({ animated: true, y: index * 75 - 79 })
        }, 150)
    }

    const handleSaveWorkout = (data: Record<string, string>, date: MyDate) => {
        const index = formData.findIndex(item => item.simpleString === date.simpleString);
        const temp = formData.length ? [...formData] : [];
        // console.log(index, "index")
        if (index === -1) {
            // console.log("index === -1")
            temp.push({ ...date, rest: false, content: data })
        } else {
            // console.log("hi there", data)
            temp[index] = { ...temp[index], content: data }
        }
        setFormData(temp);
    }


    const handleSubmit = async () => {
        try {
            setLoading(true)

            const promises: any[] = [];

            formData.forEach(item => {
                const formatUTC = new Date(item.year, item.month - 1, item.day)
                // set for end of day
                formatUTC.setUTCHours(23, 59, 59)
                
                if (item.content) {
                    promises.push(addDoc(collection(FIRESTORE_DB, 'commitments'), {
                        ...item.content,
                        startDate: formatUTC, // update
                        status: "NA",
                        userId: user.id, // Attach the userId from the authenticated user
                        created_at: serverTimestamp() // Optional: Add a timestamp when the commitment was created
                    }))
                }
            })

            const results = await Promise.allSettled(promises)

            const sortedItems = formData.sort((a, b) => new Date(a.year, a.month, a.day).getTime() > new Date(b.year, b.month, b.day).getTime() ? 1 : -1)
            const commitmentRefs = results.filter(({ status }) => status === "fulfilled").map((res) => (res as any).value)

            const weekOfCommitmentsRef = await addDoc(collection(FIRESTORE_DB, 'week_plans'), {
                userId: user.id,
                created_at: serverTimestamp(),
                start: getSundayOfWeek(new Date(sortedItems[0].year, sortedItems[0].month - 1, sortedItems[0].day )),
                end: sortedItems[sortedItems.length - 1].simpleString,
                commitments: commitmentRefs.map(ref => ref?.id)
            })

            if (weekOfCommitmentsRef.id) {
                await updateDoc(doc(FIRESTORE_DB, "users", user.id), {
                    workouts: !!(user?.workouts && user.workouts.length) ? user.workouts.concat(commitmentRefs) : commitmentRefs,
                    weekPlans: !!(user?.weekPlans && user.weekPlans.length) ? user.weekPlans.concat([weekOfCommitmentsRef]) : [weekOfCommitmentsRef]
                })

                setUser({
                    ...user,
                    workouts: !!(user?.workouts && user.workouts.length) ? user.workouts.concat(commitmentRefs) : commitmentRefs,
                    weekPlans: !!(user?.weekPlans && user.weekPlans.length) ? user.weekPlans.concat([weekOfCommitmentsRef]) : [weekOfCommitmentsRef]
                })
            }
            // onClose();
        } catch (err) {
            alert(JSON.stringify(err))
        } finally {
            setLoading(false)
        }
    }
    const isComplete = () => {
        const today = new Date()
        if (days.every(day => today < new Date(day.year, day.month - 1, day.day))){
            return formData.length === 7
        }
        return formData.length === (6 - today.getDay())
    }

    return (
        <View className="h-full w-full justify-start items-center ">
            <View className=" w-full flex-row justify-center items-center z-20 ">
                <Text className="font-medium text-xl">Add Plan</Text>
                <TouchableOpacity onPress={onCancel} className="absolute bottom-0 right-4">
                    <Text className="text-lg">Cancel</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView className="" behavior="padding" enabled keyboardVerticalOffset={70}>

                <ScrollView className="w-full" ref={scrollRef}>
                    {days.map((date, index) => (
                        <WorkoutSelection
                            key={`workout_${date.simpleString}`}
                            date={date}
                            workout={formData.find(item => item.simpleString === date.simpleString) ?? null}
                            dayOfWeek={daysOfWeek[index]}
                            onPressAddWorkout={() => handleWorkoutSelection(index)}
                            onSaveNewWorkout={(data: Record<string, string>) => {
                                handleSaveWorkout(data, date)
                            }}
                            onPressRest={() => {
                                const correctIndex = formData.findIndex(item => item.simpleString === date.simpleString)
                                if (correctIndex === -1) {
                                    setFormData(formData.concat([{ ...date, rest: true }]))
                                } else if (!!formData[correctIndex].content) {
                                    const temp = [...formData]
                                    temp[correctIndex] = { ...date, rest: true }
                                    setFormData(temp)
                                } else {
                                    setFormData(formData.filter(item => item.simpleString !== date.simpleString))
                                }
                            }}
                            forceClose={currSelection !== index}
                            restState={formData.find(item => item.simpleString === date.simpleString)?.rest}
                            last={index === 6}
                        />
                    ))}
                    <View className="h-[400px] w-full"></View>

                </ScrollView>
            </KeyboardAvoidingView>

            <View className="w-full bottom-4 absolute px-4">
                <TouchableOpacity className={` rounded-xl ${!isComplete() ? "bg-gray-400" : "bg-[#a538ff]"} justify-center items-center h-16 `}
                    onPress={() => isComplete() ? handleSubmit() : alert("please complete required fields")}>
                    {loading ? (
                        <SpinLoader />
                    ) : (
                        <Text className="text-white text-lg font-medium ">Save Plan</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CreateWeekOfCommitments;

const WorkoutSelection = ({ date, dayOfWeek, workout, restState, onSaveNewWorkout, onPressRest, onPressAddWorkout, forceClose, last }:
    {
        date: MyDate,
        dayOfWeek: string,
        workout: null | Record<string, any>
        restState: boolean,
        onSaveNewWorkout: (data: Record<string, string>) => void,
        onPressRest: () => void,
        onPressAddWorkout: () => void,
        forceClose: boolean,
        last?: boolean
    }) => {

    const workoutButtonWidth = useSharedValue(120);
    const restButtonWidth = useSharedValue(100);
    const addWorkoutHeight = useSharedValue(0);

    const animatedWorkoutButton = useAnimatedStyle(() => ({
        width: workoutButtonWidth.value,
    }))

    const animatedRestButton = useAnimatedStyle(() => ({
        width: restButtonWidth.value,
    }))

    const animatedAddWorkout = useAnimatedStyle(() => ({
        height: addWorkoutHeight.value,
    }))

    const [createWorkout, setCreateWorkout] = useState(false);

    const closeSection = () => { addWorkoutHeight.value = withTiming(0, { duration: 150, easing: Easing.linear }) };
    const openSection = () => { addWorkoutHeight.value = withTiming(260, { duration: 300, easing: Easing.elastic(1) }) };

    useEffect(() => {
        if (!restState && restButtonWidth.value > 50) {
            setTimeout(() => {
                restButtonWidth.value = withTiming(50, { duration: 300, easing: Easing.elastic(1) });
                workoutButtonWidth.value = withTiming(120, { duration: 300, easing: Easing.elastic(1) })
            }, 50)
        } else if (restState && restButtonWidth.value < 100) {
            setTimeout(() => {
                restButtonWidth.value = withTiming(100, { duration: 300, easing: Easing.elastic(1) });
                workoutButtonWidth.value = withTiming(80, { duration: 300, easing: Easing.elastic(1) })
            }, 50)
        }
    }, [restState])

    useEffect(() => {
        if (createWorkout && addWorkoutHeight.value < 200) {
            openSection();
        } else if (!createWorkout && addWorkoutHeight.value > 0) {
            closeSection();
        }
    }, [createWorkout])

    useEffect(() => {
        if (forceClose && createWorkout) {
            setTimeout(() => {
                setCreateWorkout(false)
            }, 50)
        }
    }, [forceClose])

    useEffect(() => {
        if (workout) {
            setTimeout(() => {
                setCreateWorkout(false)
            }, 50)
        }
    }, [workout])

    return (
        <View  className={`w-full justify-center items-center ${!last && " border-b border-b-gray-200"} `}>
            <View className="w-full py-2 flex-row justify-between items-center">
                <View className="flex-row justify-center items-center">

                    <View className="justify-center items-center mx-2 bg-gray-200 rounded-xl px-5  py-3">
                        <Text className="font-medium">{date.monthString}</Text>
                        <Text className="font-medium">{date.day}</Text>
                    </View>
                    <View className="py-3 m-2 " >
                        <Text className="text-md">{dayOfWeek}</Text>
                    </View>
                </View>
                <View className="justify-center items-center">
                    {new Date(date.year, date.month - 1, date.day) >= new Date() ? (

                        <View className="flex-row justify-center items-center ">
                            <Pressable onPress={() => {
                                onPressRest()
                                if (createWorkout) { setCreateWorkout(false) }
                            }} >
                                <Animated.View style={[{}, animatedRestButton]} className={`${restState ? "bg-blue-200" : ""} rounded-lg h-12 flex-row justify-center items-center`}>
                                    <View className="flex-row justify-center items-center">
                                        {restState && (
                                            <View className=" pr-2">
                                                <Fontisto name="close-a" size={8} color="black" />
                                            </View>
                                        )}
                                        <Text>Rest</Text>
                                    </View>
                                </Animated.View>
                            </Pressable>
                            <Pressable onPress={() => {
                                setCreateWorkout(!createWorkout)
                                onPressAddWorkout()
                                if (restState) { onPressRest() }
                            }}>
                                <Animated.View style={[{}, animatedWorkoutButton]} className={`${(workout && workout.content) ? "bg-blue-200" : (createWorkout ? "bg-gray-200" : "")} rounded-lg h-12 mr-4 flex-row justify-center items-center`}>
                                    {(createWorkout || (workout && workout.content)) ? (
                                        <View className="flex-row justify-center items-center">
                                            <View className=" pr-2">
                                                <Fontisto name="close-a" size={8} color="black" />
                                            </View>
                                            {workout ? (
                                                <Text className="max-w-[100px]">{workout.content.distance} mi Run</Text>
                                            ) : (
                                                <Text>Cancel</Text>
                                            )}
                                        </View>
                                    ) : (
                                        <View className="flex-row justify-center items-center">
                                            {!restState && (
                                                <View className=" pr-1">
                                                    <Entypo name="plus" size={16} color="black" />
                                                </View>
                                            )}
                                            <Text>Workout</Text>
                                        </View>
                                    )}
                                </Animated.View>
                            </Pressable>
                        </View>
                    ) : (
                        <View className="flex-row  justify-end items-center">
                            <View className=" mr-10 p-4 rounded-lg ">
                                <Text className="font-medium">Passed</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
            <Animated.View style={[{}, animatedAddWorkout]}>
                {createWorkout && (
                    <View className="h-fit w-full justify-center items-center ">
                        <AddWorkoutModal workout={workout?.content} onClose={(data: Record<string, string>) => onSaveNewWorkout(data)} />
                    </View>
                )}
            </Animated.View>
        </View>
    )
}