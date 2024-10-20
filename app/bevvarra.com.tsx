import { userState } from "@/storage/atomStorage";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from '@expo/vector-icons/Entypo';
import { useEffect } from "react";
import SpinLoader from "@/components/spinLoader";

const ReturnFromStrava = () => {
    const [user,] = useAtom(userState)
    const router = useRouter();

    useEffect(() => {
        if (user?.strava_athlete_id) {
            setTimeout(() => router.dismiss(), 500)
        }
    }, [router, user?.strava_athlete_id])

    return (
        <View className="w-screen h-screen bg-[#FC4C02] ">
            <SafeAreaView className='w-screen'>
                <View className="w-full h-full items-center justify-center">
                    {!(user?.strava?.expires_at && (user?.strava?.expires_at > (Date.now() / 1000))) ? (
                        <View className="w-[86px] h-[86px] justify-center items-center rounded-full border-8 border-white">
                            <SpinLoader size={56} color="white" />
                        </View>
                    ) : (
                        <View className="w-[86px] h-[86px] justify-center items-center rounded-full border-8 border-white">
                            <Entypo name="check" size={56} color="white" />
                        </View>
                    )}

                    <Text className="text-2xl text-white font-medium mt-4">{user?.strava_athlete_id ? "Success" : "Loading"}</Text>
                    {/* <Text className="">{user.strava_athlete_id ? "Strava is integrated" : "Something went wrong"}</Text> */}
                </View>
            </SafeAreaView>
        </View>
    )
};

export default ReturnFromStrava;