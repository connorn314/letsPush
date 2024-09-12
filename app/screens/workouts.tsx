
import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, Button, ScrollView, FlatList } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
// import SpinLoader from "../components/spinLoader";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AddWorkoutModal from "../components/addWorkout";
import { StyleSheet } from "react-native";
// import { Workout } from "../types/workouts";
import { useAtom } from "jotai";
import { myWorkoutsState, userState } from "../storage/atomStorage";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebaseConfig";
// import { Timestamp } from "firebase/firestore";


const WorkoutsScreen = ({ navigation }: any) => {

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
            where('userId', '==', user.id)
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
                    <View className=' w-full flex-row justify-center items-center'>
                        <TouchableOpacity onPress={() => handlePresentModalPress()} className='p-4  bg-white shadow rounded-full absolute top-4 left-4'>
                            <Entypo name="plus" size={24} color="#a538ff" />
                        </TouchableOpacity>
                        <Text className="text-2xl text-white font-medium pt-7">Workouts</Text>

                        <TouchableOpacity onPress={() => alert("not implemented yet")} className='p-4  bg-white shadow rounded-full absolute top-4 right-4'>
                            <Ionicons name="notifications" size={24} color="#a538ff" />
                        </TouchableOpacity>
                    </View>
                    <View className="w-full px-4 mt-8">
                        <FlatList data={workouts.sort((a, b) => a.startDate.toDate().getTime() - b.startDate.toDate().getTime())} keyExtractor={(item) => `${item.id}`}
                            renderItem={({ item }) => {
                                const date = item.startDate.toDate();
                                return (
                                    <TouchableOpacity className="bg-[#ffffff] shadow-sm border-rounded-full w-full rounded-lg p-4 my-1 flex-row justify-start items-center"
                                        onPress={() => {
                                            // playSound(mediaData[idx].url)
                                            // alert("Eventually take to a workout details screen")
                                            navigation.navigate("Personal Workout Details", {
                                                workoutDetails: item
                                            })
                                        }}  >
                                        <View className={`rounded-md justify-center items-center h-16 w-16 ${item.status === "complete" ? "bg-green-300" : (item.status === "failure" ? "bg-red-400" : "bg-slate-200")}`}>
                                            <Text className={`text-lg text-center `}>{`${date.getMonth() + 1}/${date.getDate()}`}</Text>
                                        </View>
                                        <View className="ml-2">
                                            <Text className="text-lg">{item.name}</Text>
                                            <Text className="">{item.distance} miles</Text>
                                            <Text className="">{(item.pace.length <= 2 ? "00" : item.pace.length === 3 ? `0${item.pace.slice(0, item.pace.length - 2)}` : item.pace.slice(0, item.pace.length - 2))}:{(item.pace.length > 2 ? item.pace.slice(item.pace.length - 2) : (item.pace.length === 1 ? `0${item.pace}` : item.pace)) || "00"}" / mi</Text>
                                        </View>
                                        <View className="grow text-right ">
                                            <Text className="grow text-right">{item.status === "complete" ? "Complete" : (item.status === "failure" ? "Failed" : "Unattempted")}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }} />

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