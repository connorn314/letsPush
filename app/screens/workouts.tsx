
import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, Button, ScrollView, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
// import SpinLoader from "../components/spinLoader";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AddWorkoutModal from "../components/addWorkout";
import { StyleSheet } from "react-native";
// import { Workout } from "../types/workouts";
import { useAtom } from "jotai";
import { myWorkoutsState } from "../storage/atomStorage";
import PersonalCommitmentCard from "../components/personalCommitmentCard";
import NotificationsModal from "./notificationsModal";
// import { Timestamp } from "firebase/firestore";


const WorkoutsScreen = ({ navigation }: any) => {

    // const [user,] = useAtom(userState);
    const [workouts,] = useAtom(myWorkoutsState);
    // const [loading, setLoading] = useState(false);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const notificationModalRef = useRef<BottomSheetModal>(null);
    
    const [second, setSecond] = useState(-1);
    // // callbacks
    const handlePresentModalPress = useCallback(() => {
        setTest(0)
        bottomSheetModalRef.current?.present()
    }, []);

    const [test, setTest] = useState(-1);

    const handleClosePress = () => {
        setTest(-1)
        bottomSheetModalRef?.current?.close()
    }

    const handlePresentNotifications = useCallback(() => {
        setSecond(0)
        notificationModalRef.current?.present()
    }, [])

    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#ffffff', '#ffffff', '#ffffff']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
        >
            <SafeAreaView className={` transition-all duration-200 relative`}>
                <View className='w-screen h-full justify-start items-center'>
                    <View className=' w-full flex-row justify-center items-center'>
                        <TouchableOpacity onPress={() => handlePresentModalPress()} className='p-4  bg-white rounded-full absolute top-2 left-4'>
                            <Entypo name="plus" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-lg text-black font-medium pt-6 pb-4">Workouts</Text>

                        <TouchableOpacity onPress={handlePresentNotifications} className='p-4  bg-white rounded-full absolute top-2 right-4'>
                            <FontAwesome5 name="bell" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View className="w-full px-4">

                        <ScrollView className="h-full" >
                            {workouts.sort((a, b) => a.startDate.toDate().getTime() - b.startDate.toDate().getTime()).map(item => (
                                <PersonalCommitmentCard key={`${item.id}`} item={item} onPress={() => {
                                    navigation.navigate("Personal Workout Details", {
                                        workoutDetails: item
                                    })
                                }} />
                            ))}
                        </ScrollView>

                    </View>
                </View>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={test}
                    snapPoints={["100%"]}
                    // enablePanDownToClose
                    backdropComponent={props => (<BottomSheetBackdrop {...props}
                        opacity={0.5}
                        enableTouchThrough={false}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        style={[{ backgroundColor: 'rgba(0, 0, 0, 1)' }, StyleSheet.absoluteFillObject]} />)}
                    onChange={(index) => {
                        if (index === -1) { Keyboard.dismiss() }
                    }}
                >
                    <AddWorkoutModal onClose={() => handleClosePress()} />
                </BottomSheetModal>

            </SafeAreaView>
            <BottomSheetModal
                ref={notificationModalRef}
                index={second}
                snapPoints={["100%"]}
                // enablePanDownToClose
                backdropComponent={props => (<BottomSheetBackdrop {...props}
                    opacity={0.5}
                    enableTouchThrough={false}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    style={[{ backgroundColor: 'rgba(0, 0, 0, 1)' }, StyleSheet.absoluteFillObject]} />)}
            >
                <NotificationsModal />
            </BottomSheetModal>
        </LinearGradient >
    )
}

export default WorkoutsScreen;

{/* <BottomSheet
    ref={bottomSheetRef}
    index={test} // If the index value is set to -1, the sheet will initialize in a closed state.
    detached={false} // Determines if the bottom sheet is attached to the bottom or not.
    snapPoints={["90%"]}
    enablePanDownToClose
    backdropComponent={props => (<BottomSheetBackdrop {...props}
        opacity={0.5}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        style={[{ backgroundColor: 'rgba(0, 0, 0, 1)' }, StyleSheet.absoluteFillObject]} />)}
    onChange={(index) => {
        if (index === -1) { Keyboard.dismiss() }
    }}
>
    <AddWorkoutModal onClose={() => handleClosePress()} />
</BottomSheet> */}