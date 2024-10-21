import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const CommitmentsTourGuideView = () => {
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
                router.push("/(tabs)/friends")
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
                            <Text className="font-medium ">Add running plans for this week and future weeks with this button</Text>
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
                        <Animated.View className=" rounded-full" style={[{ borderWidth: 800, borderColor: "rgba(0, 0, 0, 0.6)", position: "absolute", top: -724, left: -800 }, animatedStyle]}>
                            <View className="h-16 w-[85vw]  justify-center items-center overflow-visible" />
                        </Animated.View>
                        <Animated.View className="absolute top-40 w-[90vw] bg-yellow-200 px-4 py-4 rounded-3xl "
                            style={[animatedStyle]}>
                            <Text className="font-medium mb-2">Click any of these to filter your goal history</Text>
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

                        <Animated.View className="absolute bottom-4 w-[90vw] bg-yellow-200 px-4 py-4 rounded-3xl "
                            style={[animatedStyle]}>
                            <Text className="font-medium mb-2">Now let's add some friends in the "Friends" tab!</Text>
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

export default CommitmentsTourGuideView;