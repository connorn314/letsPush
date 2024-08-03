// import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
// import { Teko_400Regular, useFonts } from "@expo-google-fonts/teko";
import { LinearGradient } from "expo-linear-gradient";
import { useAtom } from "jotai";
import { userState } from "../storage/atomStorage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./login";
// import { useNavigation } from "@react-navigation/native";

const HomeScreen = ({navigation}: any) => {
    const [user, setUser] = useAtom(userState);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, userObj => {
            if (userObj){
                setUser(userObj);
            } else {
                setUser(null);
            }
        })

        return unsubscribe;
    }, [])

    // useEffect(() => {
    //     if (!user) return;
    //     // console.log("useEffect running")
    //     const toursRef = collection(FIRESTORE_DB, "tours")

    //     const subscriber = onSnapshot(toursRef, {
    //         next: (snapshot) => {
    //             const toursArr: any[] = [];
    //             snapshot.docs.forEach(doc => {

    //                 // const tourStops = doc.data()
    //                 // console.log(doc.data(), console.log(doc.id))
    //                 toursArr.push({id: doc.id, ...doc.data()})
    //             })
    //             setTours(toursArr)
    //         }
    //     })
        
    //     return () => subscriber();
    // }, [user])

    const handleSignOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            // setUser(null);
        } catch (err: any){
            alert(err.message)
        }
    };

    return user ? (
        <LinearGradient
            // Background Linear Gradient
            colors={['#ffffff', '#ffffff', '#a538ff']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20}}
            >
            <SafeAreaView>
                <View className="items-center justify-start w-[100vw] h-full  py-12 " >
                    <View className="w-full h-full items-center justify-center">
                        <Text className="text-black">Home Screen</Text>
                    </View>
                    <View className="w-full justify-center items-center absolute bottom-12">
                        <Text>{user?.email}</Text>
                        <TouchableOpacity className="bg-white h-12" onPress={handleSignOut}>
                            <Text className="text-[#a538ff] text-xl p-3 rounded-lg">Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    ) : <Login />
}

export default HomeScreen;