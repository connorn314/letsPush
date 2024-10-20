import { LinearGradient } from "expo-linear-gradient";
import { Href, useRouter } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


// Hero statement: “Welcome to Runnēt: Your accountability community that helps you accomplish your goals.”

// “Join” CTA

// Takes user to create an account page

// “Login” CTA

// Takes user to login page
const WelcomePage = () => {

    const router = useRouter();
    
    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#f0f0f0', '#ffffff', '#f0f0f0']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
        >
            <SafeAreaView className={`w-screen relative`}>
                <View className="w-full h-full justify-center items-center px-4">
                    <View>
                        <Text className="text-3xl" style={{ fontFamily: "BenchNine_400Regular" }}>Welcome to Ruñet</Text>
                    </View>
                    <View className="p-4">
                        <Text className="text-center text-xl" style={{ fontFamily: "BenchNine_400Regular" }}>Your accountability community that helps you accomplish your goals.</Text>
                    </View>
                <TouchableOpacity className={`bg-main absolute bottom-4 mb-6 w-full rounded-xl h-14 mt-1 justify-center items-center`}
                    onPress={() => {router.push("/login")}}>
                    <Text className={`font-medium text-white `}>Go to Sign Up</Text>
                </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default WelcomePage;