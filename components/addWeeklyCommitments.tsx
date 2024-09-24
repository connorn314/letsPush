
// import { LinearGradient } from "expo-linear-gradient";
// import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useEffect, useRef, useState } from "react";
import DismissKeyboard from "@/components/dismissKeyboard";
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, serverTimestamp, setDoc, updateDoc, doc, DocumentReference } from 'firebase/firestore';
import { FIRESTORE_DB } from "../firebaseConfig";
import { useAtom } from "jotai";
import { lockPageOnCarousel, userState } from "@/storage/atomStorage";
import SpinLoader from "./spinLoader";
import { daysOfWeek } from '@/util/helpers';
import WeekCarousel from './weekCarousel';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';


const AddWeeklyCommitmentsModal = ({ onClose }: { onClose: () => void }) => {

    const [lockPage, setLockPage] = useAtom(lockPageOnCarousel);

    const titleOpacity = useSharedValue(0);
    const titlePosition = useSharedValue(40);

    const animatedTitleOpacity = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        top: titlePosition.value
    }))

    useEffect(() => {
        if (lockPage && titleOpacity.value > 0) {
            titleOpacity.value = withTiming(0, { duration: 300, easing: Easing.linear });
            titlePosition.value = withTiming(-40, { duration: 300, easing: Easing.elastic(1) });
        } else if (!lockPage && titleOpacity.value < 1) {
            titleOpacity.value = withTiming(1, { duration: 300, easing: Easing.linear });
            titlePosition.value = withTiming(40, { duration: 300, easing: Easing.elastic(1) });
        }
    }, [lockPage])

    return (
        // <SafeAreaView className={` transition-all duration-200 relative`}>
        <View className={`h-full w-screen  flex justify-start items-center `}>
                <SafeAreaView className=''>
                    <Animated.View style={[{position: 'absolute'}, animatedTitleOpacity]} className=" w-full flex-row justify-center items-center z-20" >
                        <Text className="font-medium text-xl mt-2">Choose Week</Text>
                        <TouchableOpacity onPress={() => onClose()} className="absolute bottom-0 right-4">
                            <Text className="text-lg">Cancel</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <View className=" w-full flex justify-center items-start ">
                        <WeekCarousel />


                    </View>
                </SafeAreaView>
        </View>
        // </SafeAreaView>
    )
}
export default AddWeeklyCommitmentsModal;