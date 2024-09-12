import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const WorkoutDetailsScreen = ({ navigation, route }: any) => {

    const { workoutDetails } = route.params;


    return (
        <SafeAreaView className={`relative`}>
            <View className="w-screen h-full justify-start items-center">
                <View className="p-4">
                    <Text>name: {workoutDetails.name}</Text>
                </View>
                {/* <TouchableOpacity onPress={() => navigation.back()} className={`bg-blue-600 rounded`}>
                    <Text className="text-white py-4 px-8">Back to all</Text>
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    )
}

export default WorkoutDetailsScreen;