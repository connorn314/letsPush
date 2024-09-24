import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming ,Easing } from 'react-native-reanimated';

interface AnimatedBarProps {
    goalHeight: number;
    actualHeight: number;
    status: string;
    delay?: number
}

const AnimatedBar: React.FC<AnimatedBarProps> = ({ goalHeight, actualHeight, status, delay = 0 }) => {
    const goalBarHeight = useSharedValue(0);
    const actualBarHeight = useSharedValue(0);
    const failBarHeight = useSharedValue(0);

    useEffect(() => {
        setTimeout(() => {
            goalBarHeight.value = withTiming(goalHeight, { duration: 500, easing: Easing.elastic(1) }); // Animate to goalHeight over 1 second
            // actualBarHeight.value = withTiming(goalHeight, { duration: 500, easing: Easing.elastic(1) }); // Animate to goalHeight over 1 second
            setTimeout(() => {
                failBarHeight.value = withTiming(goalHeight, { duration: 500, easing: Easing.elastic(1) })
                actualBarHeight.value = withTiming(actualHeight, { duration: 500, easing: Easing.elastic(1) })
            }, 500)
        }, delay)
    }, [goalHeight, goalBarHeight]);

    const animatedStyleGoal = useAnimatedStyle(() => ({
        height: goalBarHeight.value, // Dynamically change height
    }));

    const animatedStyleActual = useAnimatedStyle(() => ({
        height: actualBarHeight.value, // Dynamically change height
    }));

    const animatedStyleFail = useAnimatedStyle(() => ({
        height: failBarHeight.value, // Dynamically change height
    }));

    return (
        <View className='relative justify-center items-center'>
            {status === "complete" && (
                <View style={{width: 25, justifyContent: 'flex-end', height: "100%", position: "absolute", bottom: 0}} >
                    <Animated.View style={[{ ...styles.barActual, backgroundColor: '#75ffa1' }, animatedStyleActual]} />
                </View>
            )}
            {(status === "failure" || status === "NA") && (
                <View style={{width: 25, justifyContent: 'flex-end', height: "100%", position: "absolute", bottom: 0}} >
                    <Animated.View style={[{...styles.barFail, backgroundColor: status === "NA" ? "#D3D3D3" : "#fd474c"}, animatedStyleFail]} />
                </View>
            )}
            <View style={{width: 25, justifyContent: 'flex-end', height: "100%", position: "absolute", bottom: 0}} >
                <Animated.View style={[styles.barGoal, animatedStyleGoal]} />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    barGoal: {
        width: '100%', // Full width of the container
        // backgroundColor: 'black', // Bar color
        // opacity: 0.5,
        borderTopColor: "black",
        borderTopWidth: 3,
        // borderRadius: 1
    },
    barActual:{
        width: '100%', // Full width of the container
        borderRadius: 5
    },
    barFail:{
        width: '100%', // Full width of the container // Bar color
        borderRadius: 5
    }
});

export default AnimatedBar;
