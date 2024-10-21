import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { stravaAuthLoadingState, userState } from '@/storage/atomStorage';
import useAuth from '@/storage/useAuth';
import { useAtom } from "jotai";
import SpinLoader from '@/components/spinLoader';
import { SvgComponent } from "@/app/(tabs)/home";
import { useEffect, useState } from "react";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { usePushNotifications } from "@/storage/usePushNotifications";
import { useRouter } from "expo-router";

const SingleOnboardingPage = ({ index, goNext }: { index: number, goNext: () => void }) => {


    const { performOAuth,  } = useAuth();
    const router = useRouter();

    const [stravaAuthLoading,] = useAtom(stravaAuthLoadingState);
    const [user,] = useAtom(userState);

    const [sending, setSending] = useState<null | string>(null);

    const { makeEnablePushRequest, expoPushToken } = usePushNotifications();

    const isReadyForNext = () => {
        if (index === 0 && !expoPushToken) return false;
        if (index === 1 && !(user?.strava?.expires_at && (user?.strava?.expires_at > (Date.now() / 1000)))) return false;
        return true
    }

    const handleCtaClick = () => {
        if (isReadyForNext()) {
            goNext()
            return
        }
    }

    return (
        <View className={"w-screen h-full justify-center items-center "}>
            <SafeAreaView className="w-full h-full relative  justify-start items-center px-4">
                {index === 0 && (
                    <View className="w-full justify-center items-center h-full relative">
                        <View className="absolute top-0">
                            <Text className="text-4xl" style={{ fontFamily: "BenchNine_400Regular" }}>Ruñet</Text>
                        </View>
                        <View className="p-4">

                            <View className="  w-fit flex justify-center items-center mb-12">
                                <View className="relative">
                                    <FontAwesome5 name="bell" size={48} color="black" />
                                    <View className="h-5 w-5 bg-red-500 rounded-full border-white border-2 absolute top-0 right-0" />
                                </View>
                            </View>
                            <Text className="text-center text-xl font-medium mb-2" >Enable notifications</Text>
                            <Text className="text-center text-lg leading-6" >Enable notifications to know when your friends complete or miss a workout. Stay connected and keep each other on track.</Text>
                        </View>
                        {expoPushToken ? (
                            <View className={`  h-[56px] rounded mb-2 w-full flex-row items-center justify-center `} >
                                <Entypo name="check" size={18} color="black" />
                                <Text className={` text-md font-semibold py-4 rounded-lg ml-2`}>Notifications Enabled</Text>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => makeEnablePushRequest()} className={`bg-main  h-[56px] rounded mb-2 w-full flex-row items-center justify-center `} >
                                {/* <Entypo name="check" size={18} color="white" /> */}
                                <Text className={`text-white text-md font-semibold py-4 rounded-lg ml-2`}>Allow Notifications</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                {index === 1 && (
                    <View className="w-full justify-center items-center h-full relative">
                        <View className="absolute top-0">
                            <Text className="text-4xl" style={{ fontFamily: "BenchNine_400Regular" }}>Ruñet</Text>
                        </View>
                        <View className="p-4">

                            {/* <View className="  w-fit flex justify-center items-center mb-12">
                                <View className="relative">
                                    <FontAwesome5 name="bell" size={48} color="black" />
                                    <View className="h-5 w-5 bg-red-500 rounded-full border-white border-2 absolute top-0 right-0" />
                                </View>
                            </View> */}
                            <Text className="text-center text-xl font-medium mb-2" >Connect Strava</Text>
                            <Text className="text-center text-lg leading-6" >Connect your Strava account to automatically import all your workouts into Ruñet. No manual entries—just seamless tracking.</Text>
                        </View>
                        <View className='justify-center w-full items-center space-y-2 p-4'>
                            {(user?.strava?.expires_at && (user?.strava?.expires_at > (Date.now() / 1000))) ? (
                                <View className={` bg-[#FC4C02] h-[56px] rounded mb-2 w-full flex-row items-center justify-center `} >
                                    <Entypo name="check" size={18} color="white" />
                                    <Text className={`text-white text-md font-semibold py-4 rounded-lg ml-2`}>Successful Sync</Text>
                                </View>
                            ) : (
                                <TouchableOpacity className={` bg-[#FC4C02] h-[56px] rounded py-1  w-full items-center justify-center`} onPress={performOAuth}>
                                    {stravaAuthLoading ? (
                                        <View className='p-2'>
                                            <SpinLoader color='white' size={20} />
                                        </View>
                                    ) : (
                                        <SvgComponent />
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                        {/* <TouchableOpacity onPress={() => router.push("/bevvarra.com")} >
                            <Text>Test</Text>
                        </TouchableOpacity> */}
                    </View>
                )}
                {index > 1 && (
                    <View className="w-full justify-center items-center h-full relative">
                        <View className="absolute top-0">
                            <Text className="text-4xl" style={{ fontFamily: "BenchNine_400Regular" }}>Ruñet</Text>
                        </View>
                        <View className="p-4">
                            <Text className="text-center text-xl font-medium mb-2" >Setup Complete</Text>
                            <Text className="text-center text-lg leading-6" >Great! You have full functionality of the app. Add friends. Create goals. Share wins and losses.</Text>
                        </View>
                        <View className="flex-row justify-between items-center border-t border-t-gray-200 border-b border-b-gray-200 w-full p-4">
                            <View className="flex-row justify-center items-center ">
                                <View className="w-12 h-12 rounded-full justify-center items-center bg-main">
                                    <Text className="text-white font-medium">K</Text>
                                </View>
                                <View>
                                    <Text className="text-lg font-medium ml-3">Kirk Butler</Text>
                                    <Text className="text-md ml-3">krbutler10@gmail.com</Text>
                                </View>
                            </View>
                            <View>
                                {(user?.friend_requests_extended ?? []).includes('temp') ? (
                                    <View className="bg-gray-200 h-8 w-16 justify-center items-center rounded-lg">
                                        <Text className="">Pending</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={() => console.log("hi")} className="bg-main h-8 w-16 justify-center items-center rounded-lg">
                                        {sending === "temp" ? (
                                            <SpinLoader color="white" size={16} />
                                        ) : (
                                            <Text className="text-white">Add</Text>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <View className="flex-row justify-between items-center border-b border-b-gray-200 w-full p-4">
                            <View className="flex-row justify-center items-center ">
                                <View className="w-12 h-12 rounded-full justify-center items-center bg-main">
                                    <Text className="text-white font-medium">C</Text>
                                </View>
                                <View>
                                    <Text className="text-lg font-medium ml-3">Connor Norton</Text>
                                    <Text className="text-md ml-3">connorn314@gmail.com</Text>
                                </View>
                            </View>
                            <View>
                                {(user?.friend_requests_extended ?? []).includes('temp') ? (
                                    <View className="bg-gray-200 h-8 w-16 justify-center items-center rounded-lg">
                                        <Text className="">Pending</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={() => console.log("hi")} className="bg-main h-8 w-16 justify-center items-center rounded-lg">
                                        {sending === "temp" ? (
                                            <SpinLoader color="white" size={16} />
                                        ) : (
                                            <Text className="text-white">Add</Text>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        <View className="p-4">
                            <Text className="text-center text-lg leading-6" >Add us if you like!</Text>
                        </View>
                    </View>
                )}
                <TouchableOpacity className={`${isReadyForNext() ? "bg-main" : "bg-gray-200"}  absolute bottom-4 mb-6 w-full rounded-xl h-14 mt-1 justify-center items-center`}
                    onPress={handleCtaClick}>
                    <Text className={`font-medium ${isReadyForNext() ? "text-white" : ""} `}>{index > 1 ? "Get started" : "Next"}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}

export default SingleOnboardingPage;

{/* <View className="w-full">
    <View className="w-full justify-center items-center">
        <Text className="text-2xl font-medium mb-2">3 things to know</Text>
    </View>
    <View className="flex-row justify-start items-center my-4">
        <View className="w-12 h-12 mr-4 my-4 rounded-full items-center justify-center bg-main">
            <Text className="text-white text-lg font-medium">1</Text>
        </View>
        <View className="w-3/4">
            <Text className="text-lg font-medium">Allow Strava authorization</Text>
            <Text>The only way to complete commitments in our app is to record a corresponding activity in your Strava app, no exceptions!</Text>
        </View>
    </View>
    <View className="flex-row justify-start items-center my-4">
        <View className="w-12 h-12 mr-4 my-4 rounded-full items-center justify-center bg-main">
            <Text className="text-white text-lg font-medium">2</Text>
        </View>
        <View className="w-3/4">
            <Text className="text-lg font-medium">Allow push notifications</Text>
            <Text>Although it's not necessary to join in on commitment sharing, we've noticed that users have a better experience when they receive live updates on successes and failures.</Text>
        </View>
    </View>
    <View className="flex-row justify-start items-center my-4">
        <View className="w-12 h-12 mr-4 my-4 rounded-full items-center justify-center bg-main">
            <Text className="text-white text-lg font-medium">3</Text>
        </View>
        <View className="w-3/4">
            <Text className="text-lg font-medium">No editing/deleting workouts</Text>
            <Text>It may seem harsh, but we want our users to set commitments and stick to them! Once a workout commitment is saved, it will either be complete or failed.</Text>
        </View>
    </View>
</View> */}