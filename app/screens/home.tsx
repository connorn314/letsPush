// import { collection, onSnapshot } from "firebase/firestore";
import { View, Text, TouchableOpacity, FlatList, Keyboard, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIREBASE_FUNCTIONS, helloWorld } from "../../firebaseConfig";
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
// import axios from 'axios';
// import Auth from '../components/auth';
import useAuth from '../storage/useAuth';


const HomeScreen = ({ navigation }: any) => {

    const [user,] = useAtom(userState);
    const [friendCommitments,] = useAtom(friendCommitmentsState);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const { performOAuth } = useAuth();

    const handlePresentModalPress = useCallback(() => {
        setTest(0)
        bottomSheetModalRef.current?.present()
    }, []);

    const [test, setTest] = useState(-1);

    const handleSignOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            // setUser(null);
        } catch (err: any) {
            alert(err.message)
        }
    };

    const testFunction = async () => {
        try {
            // const res = await axios.get("https://us-central1-push-fe07a.cloudfunctions.net/helloWorld")
            const { data } = await helloWorld()
            console.log(data, "data")
        } catch (err) {
            console.log(JSON.stringify(err))
        }
    }

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

                </View>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={test}
                    snapPoints={["45%"]}
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
                    <View className='h-full justify-center items-center px-4'>
                        <View className="w-full justify-center items-center">
                            <Text>{user?.email}</Text>
                            <TouchableOpacity className="bg-white h-12 items-center justify-center" onPress={handleSignOut}>
                                <Text className="text-[#a538ff] text-xl p-3 rounded-lg">Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                        {user?.strava?.expires_at && (user?.strava?.expires_at > (Date.now() / 1000)) ? (
                            <TouchableOpacity className={` bg-[#a538ff] w-full items-center justify-center `} onPress={() => alert("no unsync functionality yet")}>
                                <Text className={`text-white text-xl p-3 rounded-lg`}>Strava Synced</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity className={` bg-white  w-full items-center justify-center`} onPress={performOAuth}>
                                <Text className={`text-[#a538ff] text-xl p-3 rounded-lg`}>Sync Strava</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity className="bg-white h-12" onPress={testFunction}>
                            <Text className="text-[#a538ff] text-xl p-3 rounded-lg">Test Function</Text>
                        </TouchableOpacity>
                        {user?.strava?.expires_at && (user?.strava?.expires_at > (Date.now() / 1000)) && (
                            <View className='w-full items-center justify-center'>
                                <Text className='text-lg'>Strava Id: {user?.strava?.athlete?.id}</Text>
                                <Text className='text-lg'>Strava Name: {user?.strava?.athlete?.firstname}</Text>
                            </View>
                        )}
                    </View>
                </BottomSheetModal>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default HomeScreen;