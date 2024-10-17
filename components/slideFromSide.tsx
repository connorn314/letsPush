import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface SlideWrapperProps {
    direction: 'left' | 'right' | 'up' | 'down';
    children: React.ReactNode;
    duration: number;
}

const SlideWrapper = ({ direction, children, duration }: SlideWrapperProps) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    // const opacity = useSharedValue(0);

    useEffect(() => {
        switch (direction) {
            case 'left':
                translateX.value = -500; // Start off-screen left
                translateX.value = withTiming(0, { duration });
                break;
            case 'right':
                translateX.value = 500; // Start off-screen right
                translateX.value = withTiming(0, { duration });
                break;
            case 'up':
                translateY.value = -1000; // Start off-screen up
                translateY.value = withTiming(0, { duration });
                break;
            case 'down':
                translateY.value = 1000; // Start off-screen down
                translateY.value = withTiming(0, { duration });
                break;
        }
        // opacity.value = withTiming(1, { duration })
    }, [direction, translateX, translateY]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
        // opacity: opacity.value
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default SlideWrapper;
