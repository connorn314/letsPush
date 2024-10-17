import SignIn from "@/components/signUp";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUpModal = () => {
    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#f0f0f0', '#ffffff', '#f0f0f0']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
        >
            <SafeAreaView className={`w-screen relative`}>
                <SignIn />
            </SafeAreaView>
        </LinearGradient>
    )
}

export default SignUpModal;