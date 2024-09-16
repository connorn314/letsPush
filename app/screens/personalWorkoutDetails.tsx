import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from "react-native-safe-area-context";


const PersonalWorkoutDetailsScreen = ({ navigation, route }: any) => {

    const { workoutDetails } = route.params;


    return (
            <View className="w-screen h-full bg-white">
                <SafeAreaView className="w-full h-full ">
                    <View className="w-full h-full relative  justify-center items-center">
                        <TouchableOpacity className="p-4 absolute left-4 top-2" onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <View className="p-4 ">
                            <Text>name: {workoutDetails.name}</Text>
                        </View>
                    </View>
                </SafeAreaView>
                {/* <TouchableOpacity onPress={() => navigation.back()} className={`bg-blue-600 rounded`}>
                    <Text className="text-white py-4 px-8">Back to all</Text>
                </TouchableOpacity> */}
            </View>
    )
}

export default PersonalWorkoutDetailsScreen;