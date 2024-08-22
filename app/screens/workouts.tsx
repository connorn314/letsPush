
import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, Button, ScrollView, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
// import SpinLoader from "../components/spinLoader";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AddWorkoutModal from "../components/addWorkout";
import { StyleSheet } from "react-native";
import { Workout } from "../types/workouts";
import { useAtom } from "jotai";
import { myWorkoutsState, userState } from "../storage/atomStorage";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebaseConfig";
// import { Timestamp } from "firebase/firestore";


const WorkoutsScreen = () => {

    const [user,] = useAtom(userState);
    const [workouts, setWorkouts] = useAtom(myWorkoutsState);
    // const [loading, setLoading] = useState(false);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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

    useEffect(() => {
        if (!user) return;
        // console.log("useEffect running")
        // const toursRef = collection(FIRESTORE_DB, "commitments");
        const q = query(
            collection(FIRESTORE_DB, 'commitments'),
            where('userId', '==', user.uid)
        );

        const subscriber = onSnapshot(q, {
            next: (snapshot) => {
                const workoutsArr: any[] = [];
                snapshot.docs.forEach(doc => {

                    // const tourStops = doc.data()
                    // console.log(doc.data(), console.log(doc.id))
                    workoutsArr.push({ id: doc.id, ...doc.data() })
                })
                setWorkouts(workoutsArr)
            }
        })

        return () => subscriber();
    }, [user])

    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#ffffff', '#ffffff', '#a538ff']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
        >
            <SafeAreaView className={` transition-all duration-200 relative`}>
                <View className='w-screen h-full justify-start items-center'>
                    <View className='absolute top-0 right-0 w-full flex-row justify-between items-center'>
                        <TouchableOpacity onPress={() => handlePresentModalPress()} className='p-4 m-4 bg-white shadow rounded-full'>
                            <Entypo name="plus" size={24} color="#a538ff" />
                        </TouchableOpacity>
                        <Text className="text-2xl text-white font-medium">Workouts</Text>

                        <TouchableOpacity onPress={() => alert("not implemented yet")} className='p-4 m-4 bg-white shadow rounded-full'>
                            <Ionicons name="notifications" size={24} color="#a538ff" />
                        </TouchableOpacity>
                    </View>
                    <View className="w-full px-4 mt-24">
                        <FlatList data={workouts} keyExtractor={(item) => `${item.id}`}
                            renderItem={({ item }) => {
                                const date = item.startDate.toDate();
                                return (
                                    <TouchableOpacity className="bg-[#ffffff] shadow-sm border-rounded-full w-full rounded-lg p-4 my-1 justify-center items-start"
                                        onPress={() => {
                                            // playSound(mediaData[idx].url)
                                            alert("Eventually take to a workout details screen")
                                        }}  >
                                        <View className="flex-row items-center mb-2 w-full">
                                            <View className="grow">
                                                <Text className="text-lg">{item.name}</Text>
                                            </View>
                                            <View className="grow">
                                                <Text className={`text-lg w-full text-right`}>{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`}</Text>
                                            </View>
                                        </View>
                                        <Text className="">{item.distance} miles</Text>
                                        <Text className="">{item.pace}" / mi</Text>
                                    </TouchableOpacity>
                                )
                            }}/>

                    </View>
                {/* <ScrollView className=" w-full border">
                        {workouts.length ? workouts.map((workout: Workout, idx: number)=> {
                            // const dist = location?.coords.latitude && location.coords.longitude ? calculateDistance({ lat: location.coords.latitude, lng: location.coords.longitude }, 
                            //     { lat: workout.location.latitude,lng: workout.location.longitude }) : null
                            const date = workout.startDate.toDate();
                            return (
                                <TouchableOpacity className="bg-[#f9f1ff] shadow-sm border-rounded-full w-full rounded-lg p-4 my-1 justify-center items-start"
                                    key={`${workout.name}_${idx}`} onPress={() => {
                                        // playSound(mediaData[idx].url)
                                        console.log("Eventually take to a workoutDetails screen")
                                        }}  >
                                    <View className="flex-row items-center mb-2 w-full">
                                        <View className="grow">
                                            <Text className="text-lg">{workout.name}</Text>
                                        </View>
                                            <View className="grow">
                                                <Text className={`text-lg w-full text-right`}>{`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`}</Text>
                                            </View>
                                    </View>
                                    <Text className="">{workout.distance} miles</Text>
                                    <Text className="">{workout.pace}" / mi</Text>
                                </TouchableOpacity>
                            )
                        }): null}
                    </ScrollView> */}
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