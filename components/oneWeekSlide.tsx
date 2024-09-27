import { useCallback, useEffect } from "react"
import { TouchableOpacity, View, Text, Dimensions, Pressable } from "react-native"
import { useState } from "react"
import Entypo from '@expo/vector-icons/Entypo';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import CreateWeekOfCommitments from "./createWeekOfCommitments";
import { MyDate, WeekOfCommitments, Workout } from "@/types/workouts";
import { lockPageOnCarousel, myWeekPlansState, myWorkoutsState } from "@/storage/atomStorage";
import { useAtom } from "jotai";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { dayToSimpleString } from "@/util/helpers";

const OneWeekSlide = ({ days }: { days: MyDate[] }) => {

    const monthsText = useCallback(() => {
        return days[0].month === days[6].month ? `${days[0].monthString}` : `${days[0].monthString} - ${days[6].monthString}`
    }, [])

    const [weekPlans,] = useAtom(myWeekPlansState);
    const [workouts,] = useAtom(myWorkoutsState);
    const [commitments, setCommitments] = useState<undefined | Workout[]>()

    const [, setLockPage] = useAtom(lockPageOnCarousel);

    const [startEditing, setStartEditing] = useState(false);

    const cardLRBEdges = useSharedValue(60);
    const cardTop = useSharedValue(120);

    const andimatedEdges = useAnimatedStyle(() => ({
        left: cardLRBEdges.value,
        right: cardLRBEdges.value,
        bottom: cardLRBEdges.value,
        top: cardTop.value,
    }))

    const [matchingPlan, setMatchingPlan] = useState<undefined | WeekOfCommitments>();

    useEffect(() => {
        if (!weekPlans) return;
        setMatchingPlan(weekPlans.find(plan => plan.start === days[0].simpleString))
        if (startEditing) {
            setStartEditing(false)
            setLockPage(false)
        }
    }, [weekPlans])

    useEffect(() => {
        if (!matchingPlan) return;
        const actualCommitments = matchingPlan.commitments.map(commitId => workouts.find(work => work.id === commitId)).filter(com => com)
        setCommitments(actualCommitments as Workout[])
    }, [matchingPlan])

    useEffect(() => {
        if (startEditing && cardLRBEdges.value !== 0) {
            setTimeout(() => {
                cardTop.value = withTiming(0, { duration: 500, easing: Easing.elastic(1) }); // Animate to goalHeight over 1 second
                cardLRBEdges.value = withTiming(0, { duration: 500, easing: Easing.elastic(1) }); // Animate to goalHeight over 1 second
            }, 0)
        } else if (!startEditing && cardLRBEdges.value < 50) {
            setTimeout(() => {
                cardTop.value = withTiming(120, { duration: 500, easing: Easing.elastic(1) }); // Animate to goalHeight over 1 second
                cardLRBEdges.value = withTiming(60, { duration: 500, easing: Easing.elastic(1) }); // Animate to goalHeight over 1 second
            }, 0)
        }
    }, [startEditing])

    return (
        <View className={"w-screen justify-center items-center relative bg-white "}>
            <View className="absolute top-10 h-16  justify-center items-center bg-white">
                <Text className="text-md ">{monthsText()}</Text>
                <View className="w-full px-10 my-3 flex-row justify-evenly items-start relative">
                    {days.map(day => (
                        <TouchableOpacity key={`${day.simpleString}_regular`} className="items-center justify-center">
                            <Text className="text-lg font-medium">{day.day}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <Animated.View style={[{ position: "absolute", justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff" }, andimatedEdges]}>
                <Pressable onPress={() => {
                    if (matchingPlan) return;
                    if (!startEditing) {
                        setStartEditing(true)
                        setLockPage(true)
                    }
                }} className="h-full w-full justify-center items-center bg-white">
                    <View className="h-full  w-full rounded-xl bg-white bg-opacity-10 justify-center items-center shadow ">
                        {!startEditing && !matchingPlan && (
                            <Pressable onPress={() => {
                                setStartEditing(!startEditing)
                                setLockPage(!startEditing)
                            }} className=" justify-center p-4 rounded items-center">
                                <Entypo name="plus" size={24} color="black" />
                                <Text className="text-xl font-medium">Plan</Text>
                            </Pressable>
                        )}
                        {!startEditing && matchingPlan && (
                            <View className="justify-center p-4 rounded items-center">
                                <FontAwesome name="lock" size={32} color="black" />
                                <Text className="text-xl font-medium mb-6">Plan Locked</Text>
                                {commitments && days.map((day) => {
                                    const temp = commitments?.find(commit => dayToSimpleString(commit.startDate.toDate()) === day.simpleString)?.distance
                                    return (
                                        <View key={`_matching_${day.simpleString}`} className="w-full flex-row my-1 justify-between items-center">
                                            <Text>{day.simpleString}</Text>
                                            <View className={`rounded-lg ${temp ? "bg-blue-200" : ""}  h-10 w-20 flex-row justify-center items-center`}>
                                                <Text className=" ">{
                                                    temp ? `${temp} mi run` : `rest`
                                                }</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        )}
                        {startEditing && (
                            <CreateWeekOfCommitments days={days} onCancel={() => {
                                setStartEditing(false)
                                setLockPage(false)
                            }} />
                        )}
                    </View>

                </Pressable>
                {/* )} */}
            </Animated.View>
        </View>
    )
}

export default OneWeekSlide;