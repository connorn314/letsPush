import React, { useRef, useEffect } from 'react';
import { Animated, View, Text } from 'react-native';

const FadeInViewWrapper = (props: any) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500, // Adjust duration as needed
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={{ ...props.style, opacity: fadeAnim }}>
            {props.children}
        </Animated.View>
    );
};

export default FadeInViewWrapper;