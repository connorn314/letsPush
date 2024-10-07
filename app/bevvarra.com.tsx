import { userState } from "@/storage/atomStorage";
import { useAtom } from "jotai";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ReturnFromStrava = () => {
    const [user,] = useAtom(userState)
    return (
        <View className="w-screen h-screen ">
            <SafeAreaView className='w-screen'>
                <View className="w-full h-full items-center justify-center">
                    <Text className="text-xl mb-2">{user.strava_athlete_id ? "Nicely done!" : "Uh oh."}</Text>
                    <Text className="">{user.strava_athlete_id ? "Strava is integrated" : "Something went wrong"}</Text>
                </View>
            </SafeAreaView>
        </View>
    )
};

export default ReturnFromStrava;