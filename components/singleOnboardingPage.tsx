import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SingleOnboardingPage = ({ index, goNext }: { index: number, goNext: () => void }) => {

    return (
        <View className={"w-screen h-full justify-center items-center "}>
            <SafeAreaView className="w-full h-full relative  justify-start items-center p-4">
                {index === 0 && (
                    <View className="w-full justify-center items-center">
                        <View>
                            <Text className="text-3xl" style={{ fontFamily: "BenchNine_400Regular"}}>Welcome to Ruñet</Text>
                        </View>
                        <View className="p-4">
                            <Text className="text-center text-xl" style={{ fontFamily: "BenchNine_400Regular"}}>Our mission is to help more people stick to their running goals by leveraging the power of social accountability and seamless integration with Strava.</Text>
                        </View>
                    </View>
                )}
                {index === 1 && (
                    <View className="w-full justify-center items-center">
                        <View className="w-full">
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
                        </View>
                    </View>
                )}
                {index > 1 && (
                    <View className="w-full justify-center items-start space-y-8">
                        <Text className="text-xl font-medium text-start">Put simply...</Text>
                        <Text className="text-xl font-medium text-start">You create weekly running plans.</Text>
                        <Text className="text-xl font-medium text-start">Your friends are notified every time you complete or fail to attempt a run.</Text>
                        <Text className="text-xl font-medium text-start">You are notified when your friends show up to their runs, and when they don't.</Text>
                        <Text className="text-xl font-medium text-start">Outwork your network.</Text>
                        <Text className="text-xl font-medium text-start">Also, have fun.</Text>
                    </View>
                )}
                <TouchableOpacity className="bg-main absolute bottom-4 mb-6 w-full rounded-xl h-14 mt-1 justify-center items-center"
                    onPress={() => goNext()}>
                    <Text className="text-white ">{index > 1 ? "Get started" : "Next"}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    )
}

export default SingleOnboardingPage;