import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import WeeklyCalendarDisplay from '@/components/weeklyDisplay';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AnimatedBar from "./singleBar";
import { useRouter } from "expo-router";

const HomeTourGuideView = () => {
    const router = useRouter();

    const [step, setStep] = useState(0);

    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value, // Dynamically change height
    }));

    useEffect(() => {
        setTimeout(() => { opacity.value = withTiming(1, { duration: 500, easing: Easing.elastic(1) }) }, 300) // Animate to goalHeight over 1 second
    }, [])

    const travelTo = (val: number | null) => {
        opacity.value = withTiming(0, { duration: 300, easing: Easing.elastic(1) }); // Animate to goalHeight over 1 second
        if (typeof val === "number") {
            setTimeout(() => {
                setStep(val);
                setTimeout(() => {
                    opacity.value = withTiming(1, { duration: 300, easing: Easing.elastic(1) }); // Animate to goalHeight over 1 second
                }, 100)
            }, 300)
        } else {
            setTimeout(() => {
                router.push("/(tabs)/commitments")
            }, 300)
        }
    }


    return (
        <View className="z-10" style={[StyleSheet.absoluteFillObject]}>
            <SafeAreaView className='w-screen relative'>
                {step === 0 && (
                    <View className="justify-center items-center h-full w-full ">
                        <Animated.View className=" rounded-full" style={[{ borderWidth: 800, borderColor: "rgba(0, 0, 0, 0.6)", position: "absolute", top: -796, left: -788 }, animatedStyle]}>
                            <View className="h-16 w-16  justify-center items-center overflow-visible" />
                        </Animated.View>
                        <Animated.View className="absolute top-16 w-[60vw] bg-yellow-200 px-4 py-4 rounded-3xl rounded-tl-none"
                            style={[animatedStyle]}>
                            <Text className="font-medium ">Open settings, manage strava, sign out.</Text>
                            <TouchableOpacity className="px-4 w-full items-end" onPress={(() => travelTo(1))}>
                                <View className="">
                                    <Text className="font-semibold text-xl ">Next</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>

                    </View>
                )}
                {step === 1 && (
                    <View className="justify-center items-center h-full w-full ">
                        <Animated.View className=" rounded-full" style={[{ borderWidth: 800, borderColor: "rgba(0, 0, 0, 0.6)", position: "absolute", top: -796, right: -790 }, animatedStyle]}>
                            <View className="h-16 w-16  justify-center items-center overflow-visible" />
                        </Animated.View>
                        <Animated.View className="absolute top-16 w-[60vw] bg-yellow-200 px-4 py-4 rounded-3xl rounded-tr-none"
                            style={[animatedStyle]}>
                            <Text className="font-medium mb-2">Check notifications, pretty self explanatory.</Text>
                            <TouchableOpacity className="px-4 w-full items-end" onPress={(() => travelTo(2))}>
                                <View className="">
                                    <Text className="font-semibold text-xl ">Next</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                )}
                {step === 2 && (
                    <View className="justify-center items-center h-full w-full ">
                        <Animated.View className=" rounded-full" style={[{ borderWidth: 800, borderColor: "rgba(0, 0, 0, 0.6)", position: "absolute" }, animatedStyle]}>
                            {/* <View className="h-16 w-16  justify-center items-center overflow-visible" /> */}
                        </Animated.View>
                        <Animated.View className="absolute top-16 w-screen bg-white rounded-3xl " style={[animatedStyle]}>

                            <WeeklyCalendarDisplay />
                        </Animated.View>

                        <Animated.View className="absolute bottom-4 w-[90vw] bg-yellow-200 px-4 py-4 rounded-3xl "
                            style={[animatedStyle]}>
                            <Text className="font-medium mb-2">This section displays your workouts in a quick calendar week view (days are clickable).</Text>
                            <TouchableOpacity className="px-4 w-full items-end" onPress={(() => travelTo(3))}>
                                <View className="">
                                    <Text className="font-semibold text-xl ">Next</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                )}
                {step === 3 && (
                    <View className="justify-center items-center h-full w-full ">
                        <Animated.View className=" rounded-full" style={[{ borderWidth: 800, borderColor: "rgba(0, 0, 0, 0.6)", position: "absolute" }, animatedStyle]}>
                            {/* <View className="h-16 w-16  justify-center items-center overflow-visible" /> */}
                        </Animated.View>
                        <Animated.View className="absolute top-12 w-screen bg-white rounded-3xl " style={[animatedStyle]}>
                            <View className='w-full'>
                                <Text className="font-medium text-xl px-4 pt-4">My Friends</Text>
                                <DisplayWeeklyCommitmentsCard />
                            </View>
                        </Animated.View>

                        <Animated.View className="absolute -bottom-8 w-[90vw] bg-yellow-200 px-4 py-4 rounded-3xl "
                            style={[animatedStyle]}>
                            <Text className="font-medium mb-2">This section will show your friends current week of running progress. Green = attempted. Gray = unattempted, Red = failed to attempt. The black lines show the goal, the bar is the actual. Click in to see more details.</Text>
                            <TouchableOpacity className="px-4 w-full items-end" onPress={() => travelTo(4)}>
                                <View className="">
                                    <Text className="font-semibold text-xl ">Next</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                )}
                {step === 4 && (
                    <View className="justify-center items-center h-full w-full ">
                        <Animated.View className=" rounded-full" style={[{ borderWidth: 800, borderColor: "rgba(0, 0, 0, 0.6)", position: "absolute" }, animatedStyle]}>
                            {/* <View className="h-16 w-16  justify-center items-center overflow-visible" /> */}
                        </Animated.View>
                        <Animated.View className="absolute top-16 w-screen bg-white rounded-3xl " style={[animatedStyle]}>
                            <View className='p-4 '>
                                <Text className="font-medium text-xl pb-4">Friends Needing Reminders</Text>
                                <DisplayFriendReminderSection reminded={false}/>
                                <DisplayFriendReminderSection reminded={true}/>
                            </View>
                        </Animated.View>

                        <Animated.View className="absolute bottom-4 w-[90vw] bg-yellow-200 px-4 py-4 rounded-3xl "
                            style={[animatedStyle]}>
                            <Text className="font-medium mb-2">This section allows you to send custom reminder notifications to friends who have not posted running goals for the week. Just click remind and a modal will ask you for a custom message.</Text>
                            <TouchableOpacity className="px-4 w-full items-end" onPress={(() => travelTo(5))}>
                                <View className="">
                                    <Text className="font-semibold text-xl ">Next</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                )}
                {step === 5 && (
                    <View className="justify-center items-center h-full w-full ">
                        <Animated.View className=" rounded-full" style={[{ borderWidth: 800, borderColor: "rgba(0, 0, 0, 0.6)", position: "absolute" }, animatedStyle]}>
                            {/* <View className="h-16 w-16  justify-center items-center overflow-visible" /> */}
                        </Animated.View>

                        <Animated.View className="absolute bottom-4 w-[90vw] bg-yellow-200 px-4 py-4 rounded-3xl "
                            style={[animatedStyle]}>
                            <Text className="font-medium mb-2">Now let's explore how to make yourself some running goals in the "Workouts" tab!</Text>
                            <TouchableOpacity className="px-4 w-full items-end" onPress={(() => travelTo(null))}>
                                <View className="">
                                    <Text className="font-semibold text-xl ">Next</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    )
}

export default HomeTourGuideView;

const fakeData = [{
    day: 1,
    goalHeight: 80,
    actualHeight: 75,
    status: "complete"
}, {
    day: 2,
    goalHeight: 120,
    actualHeight: 125,
    status: "complete"
}, {
    day: 3,
    goalHeight: 88,
    actualHeight: 0,
    status: "failure"
}, {
    day: 4,
    goalHeight: 0,
    actualHeight: 0,
    status: "string"
}, {
    day: 5,
    goalHeight: 68,
    actualHeight: 3,
    status: "NA"
}, {
    day: 6,
    goalHeight: 160,
    actualHeight: 0,
    status: "NA"
}, {
    day: 7,
    goalHeight: 0,
    actualHeight: 0,
    status: "string"
}]

const DisplayWeeklyCommitmentsCard = () => {

    return (
        <View className=" justify-center items-center p-4 w-full">
            <View className=" w-full rounded-2xl bg-white shadow-sm justify-center items-center p-4">
                <View className='flex-row w-full justify-start items-center'>
                    {/* <View className={`rounded-full justify-center items-center h-16 w-16 ${commitment.status === "complete" ? "bg-green-300" : (commitment.status === "failure" ? "bg-red-400" : "bg-slate-200")}`}> */}
                    <View className={`rounded-[5px] justify-center items-center h-12 w-12 bg-main`}>
                        <Text className={`text-xl font-semibold text-center text-white `}>N</Text>
                    </View>
                    <View className="ml-2">
                        <Text className="text-lg font-medium">New Friend</Text>
                        <Text className='text-sm h-6 '>Commitments 11/3/2024 - 11/9/2024</Text>
                    </View>
                </View>
                <View className=" flex-row justify-evenly items-center w-full px-4 mt-6">
                    <View className="flex-row items-center">
                        <FontAwesome5 name="running" size={28} color="black" />
                        <Text className="w-fit text-3xl font-medium ml-2">2</Text>
                    </View>
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons name="emoticon-sick-outline" size={28} color="black" />
                        <Text className="w-fit text-3xl font-medium ml-2">1</Text>
                    </View>
                    <View className="flex-row items-center">
                        <FontAwesome name="clock-o" size={28} color="black" />
                        <Text className="w-fit text-3xl font-medium ml-2">2</Text>
                    </View>
                </View>
                <View className="w-full flex-row items-center justify-evenly py-6">
                    <View className="w-fit justify-center items-center">
                        <Text className=" text-md font-medium mb-2">Completion</Text>
                        <View className={`rounded-lg px-3 py-1.5 bg-[#fff175] `}>
                            <Text className=" text-lg font-medium ">90%</Text>
                        </View>
                    </View>
                    <View className="w-fit justify-center items-center">
                        <Text className=" text-md font-medium mb-2">Pace</Text>
                        <View className={`rounded-lg px-3 py-1.5 bg-[#75ffa1]`}>
                            <Text className=" text-lg font-medium">-10 sec</Text>
                        </View>
                    </View>
                </View>
                <View className="flex-row  justify-between items-center px-2 pb-4 rounded-lg ">
                    {fakeData.map((item, index) => {
                        return (
                            <View key={`${item.day}_fakeData`} className={` items-center justify-center`}>
                                <View className="h-[160px] justify-end">
                                    <AnimatedBar status={item.status} actualHeight={item.actualHeight} goalHeight={item.goalHeight} delay={(250 + (index * 100))} />
                                </View>
                                <View className={` text-center rounded-full items-center justify-center`}>
                                    <Text className={` p-4`}>{item.day}</Text>
                                </View>
                                <View className={`${item.day == 5 ? "bg-black" : ""} w-3 h-3 mb-2 rotate-45`} />
                            </View>
                        )
                    })}
                </View>
            </View>
        </View>
    )
}

const DisplayFriendReminderSection = ({reminded}:{ reminded: boolean}) => {

    return (
        <View className={` items-center rounded-lg bg-white shadow-sm my-1 justify-start w-full`}>
            <View className={"flex-row w-full justify-between items-center p-4 "}>
                <View className='flex-row justify-center items-center'>
                    {/* <View className={`rounded-full justify-center items-center h-12 w-12 bg-main`}>
                        <Text className={`text-xl font-medium text-center text-white `}>{`${friend?.name[0]?.toLocaleUpperCase() ?? "N"}`}</Text>
                    </View> */}
                    <View className=''>
                        <Text className="font-medium text-lg">{!reminded ? "Friend One" : "Friend Two"}</Text>
                    </View>
                </View>
                <View className="flex flex-row justify-center items-center">
                    {reminded ? (
                        <View className='bg-gray-200 h-10 w-20 justify-center items-center rounded-lg'>
                            <Text className=''>Reminded</Text>
                        </View>
                    ) : (
                        <View className='bg-main h-10 w-20 justify-center items-center rounded-lg'>
                            <Text className='text-white'>Remind</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    )
}