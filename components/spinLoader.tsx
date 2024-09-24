import { View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { Animated } from "react-native";
import { useEffect, useRef } from "react";
import { Easing } from "react-native";


const SpinLoader = ({ size = 24, color = "white" }: { size?: number; color?: string; }) => {

    const rotation = useRef(new Animated.Value(0)).current
    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    })

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start()
    }, [])
    return (
        <View>
            <Animated.View style={{ transform: [{ rotate }] }}>
                <AntDesign name="loading1" size={size} color={color} />
            </Animated.View>
        </View>
    )
}

export default SpinLoader;