import { tourGuideState } from "@/storage/atomStorage";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAtom} from "jotai";

const FriendsTourGuideView = () => {
    const [, setTourGuide] = useAtom(tourGuideState);
    
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
            setTourGuide(false)
        }
    }


    return (
        <View className="z-10" style={[StyleSheet.absoluteFillObject]}>
            <SafeAreaView className='w-screen relative'>
                {step === 0 && (
                    <View className="justify-center items-center h-full w-full ">
                        <Animated.View className=" rounded-full" style={[{ borderWidth: 800, borderColor: "rgba(0, 0, 0, 0.6)", position: "absolute", top: -792, left: -800 }, animatedStyle]}>
                            <View className="h-16 w-screen  justify-center items-center overflow-visible" />
                        </Animated.View>
                        <Animated.View className="absolute top-24 w-[90vw] bg-yellow-200 px-4 py-4 rounded-3xl "
                            style={[animatedStyle]}>
                            <Text className="font-medium mb-2">Search for other users by first or last name on the app and click the "Add" button when you find them. They'll recieve your friend request in a couple seconds.</Text>
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
                        <Animated.View className=" rounded-full" style={[{ borderWidth: 800, borderColor: "rgba(0, 0, 0, 0.6)", position: "absolute" }, animatedStyle]}>
                            {/* <View className="h-16 w-16  justify-center items-center overflow-visible" /> */}
                        </Animated.View>

                        <Animated.View className="absolute bottom-16 w-[90vw] bg-yellow-200 px-4 py-4 rounded-3xl "
                            style={[animatedStyle]}>
                            <Text className="font-medium mb-2">This page will show all your friends in a scrollable list and you can click in to any of them to see their profiles.</Text>
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

                        <Animated.View className="absolute bottom-4 w-[80vw] bg-yellow-200 px-4 py-4 rounded-3xl "
                            style={[animatedStyle]}>
                            <Text className="font-medium mb-2">That's it! Enjoy.</Text>
                            <Text className="text-sm font-medium mb-2">PS. Press the question mark on the home page at any time to see this again</Text>
                            <TouchableOpacity className="px-4 w-full items-end" onPress={(() => travelTo(null))}>
                                <View className="">
                                    <Text className="font-semibold text-xl ">Done</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    )
}

export default FriendsTourGuideView;