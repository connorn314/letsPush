import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from "expo-router";


const WorkoutDetailsScreen = () => {

    const { commitmentId } = useLocalSearchParams();
    const router = useRouter();
    
    return (
        <View className="w-screen h-full bg-white">
            <SafeAreaView className="w-full h-full ">
                <View className="w-full h-full relative  justify-center items-center">
                    <TouchableOpacity className="p-4 absolute left-4 top-2" onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View className="p-4 ">
                        <Text>id: {commitmentId}</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default WorkoutDetailsScreen;