// import { collection, onSnapshot } from "firebase/firestore";
import { View, Text, TouchableOpacity, FlatList, Keyboard, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../firebaseConfig";
// import { Teko_400Regular, useFonts } from "@expo-google-fonts/teko";
import { LinearGradient } from "expo-linear-gradient";
import { useAtom } from "jotai";
import { friendCommitmentsState, userState } from "../storage/atomStorage";
import { signOut } from "firebase/auth";
// import { useNavigation } from "@react-navigation/native";
// import { collection, onSnapshot, query, where } from "firebase/firestore";
import Ionicons from '@expo/vector-icons/Ionicons';
// import { FIRESTORE_DB } from "../../firebaseConfig";
import CommitmentCard from "../components/commitmentCard";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
// import SpinLoader from "../components/spinLoader";
import React, { useCallback, useEffect, useRef, useState } from "react";

const HomeScreen = ({ navigation }: any) => {

    const [user,] = useAtom(userState);
    const [friendCommitments, ] = useAtom(friendCommitmentsState);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // // callbacks
    const handlePresentModalPress = useCallback(() => {
        setTest(0)
        bottomSheetModalRef.current?.present()
    }, []);

    const [test, setTest] = useState(-1);

    // const handleClosePress = () => {
    //     setTest(-1)
    //     bottomSheetModalRef?.current?.close()
    // }

    const handleSignOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            // setUser(null);
        } catch (err: any) {
            alert(err.message)
        }
    };

    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#ffffff', '#ffffff', '#a538ff']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
        >
            <SafeAreaView>
                <View className="items-center justify-start w-screen h-full " >
                    <View className='w-full flex-row justify-center items-center'>
                        <TouchableOpacity onPress={() => handlePresentModalPress()} className='p-4  bg-white shadow rounded-full absolute top-4 left-4 '>
                            <Ionicons name="settings-sharp" size={24} color="#a538ff" />
                        </TouchableOpacity>
                        <Text className="text-2xl text-white font-medium pt-7">Home</Text>

                        <TouchableOpacity onPress={() => alert("not implemented yet")} className='p-4  bg-white shadow rounded-full absolute top-4 right-4 '>
                            <Ionicons name="notifications" size={24} color="#a538ff" />
                        </TouchableOpacity>
                    </View>
                    <View className="w-full mt-8 ">
                        <FlatList data={friendCommitments.sort((a, b) => a.startDate.toDate().getTime() - b.startDate.toDate().getTime())} keyExtractor={(item) => `${item.id}`}
                            renderItem={({ item }) => {
                                return <CommitmentCard commitment={item} />
                            }} />
                    </View>
                    {/* <View className="w-full h-full items-center justify-center">
                        <View className="w-full  justify-center items-center space-y-4">
                            <TouchableOpacity className="w-28 h-28 justify-center items-center rounded-xl bg-white shadow-sm shadow-[#a538ff]" onPress={() => navigation.navigate("Friends")}>
                                <AntDesign name="adduser" size={32} color="black" />
                                <Text className=" text-center mt-2">Friend</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="w-28 h-28  justify-center items-center rounded-xl bg-white shadow-sm shadow-[#a538ff]" onPress={() => navigation.navigate("Workouts")}>
                                <MaterialIcons name="add-task" size={32} color="black" />
                                <Text className=" text-center mt-2">Workout</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    
                </View>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={test}
                    snapPoints={["25%"]}
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
                    <View className='h-full justify-center items-center'>
                        <View className="w-full justify-center items-center">
                            <Text>{user?.email}</Text>
                            <TouchableOpacity className="bg-white h-12" onPress={handleSignOut}>
                                <Text className="text-[#a538ff] text-xl p-3 rounded-lg">Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetModal>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default HomeScreen;