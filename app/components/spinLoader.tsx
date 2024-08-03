import { View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Animated } from "react-native";
import { useEffect } from "react";
import { Easing } from "react-native";


const SpinLoader = ({ size = 24, color = "white"}: { size?: number; color?: string;}) => {

    const spinValue = new Animated.Value(0);
    const rotate = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    })

    const spin = () => {
        spinValue.setValue(0)
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true
        }).start(() => spin());
    }

    useEffect(() => {
        spin()
    }, [])
    return (
        <View>
            <Animated.View style={{transform: [{rotate}]}}>
                <AntDesign name="loading1" size={size} color={color} />

            </Animated.View>
        </View>
    )
}

export default SpinLoader;