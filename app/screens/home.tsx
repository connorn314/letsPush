// import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
// import { Teko_400Regular, useFonts } from "@expo-google-fonts/teko";
import { LinearGradient } from "expo-linear-gradient";
import { useAtom } from "jotai";
import { expoPushTokenState, notificationState, userState } from "../storage/atomStorage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./login";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { usePushNotifications } from "../storage/usePushNotifications";
import { User } from "../types/user";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import { useNavigation } from "@react-navigation/native";

const HomeScreen = ({navigation}: any) => {

    usePushNotifications();
    
    const [user, setUser] = useAtom(userState);
    const [expoToken, ] = useAtom(expoPushTokenState);
    const [notification, ] = useAtom(notificationState);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, userObj => {
            if (userObj){
                // setUser(userObj);
                getMe(userObj);
            } else {
                setUser(null);
            }
        })

        return unsubscribe;
    }, [])

    const createUser = async (userObj: any) => {
        const userData: User = {
            name: "",
            created_at: Date.now(),
            friends: [],
            pushToken: expoToken || "",
            workouts: []
        }
        // console.log("userData", userData)
        await setDoc(doc(FIRESTORE_DB, "users", userObj.uid), userData);
        return await getDoc(doc(FIRESTORE_DB, "users", userObj.uid))
    }

    const getMe = async (userObj: any) => {
        if (!userObj || !userObj.uid) return;

        const currentUser = FIREBASE_AUTH.currentUser;

        if (!currentUser) {
            console.error("User is not authenticated.");
            return;
        }
        try {
            const userRef = doc(FIRESTORE_DB, `users`, `${userObj.uid}`);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const profile = userDoc.data();
                console.log("retrieved profile", profile);

                setUser({ ...userObj, ...profile });
            } else {
                const newUser = (await createUser(userObj)).data

                setUser({...userObj, ...newUser})
            }
        } catch (err: any) {
            console.log(err, "err")
            alert(err.message)
        }
    }

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
                    <View className="w-full justify-center items-center absolute top-12">
                        <Text className="text-2xl font-medium text-white">Welcome</Text>
                    </View>
                    <View className="w-full h-full items-center justify-center">
                        {/* <Text className="text-black">Home Screen</Text>
                        <Text className="text-black">Name: {user.name ?? "unknown"}</Text> */}
                        <View className="w-full  justify-center items-center space-y-4">
                            <TouchableOpacity className="w-28 h-28 justify-center items-center rounded-xl bg-white shadow-sm shadow-[#a538ff]" onPress={() => console.log("hi")}>
                                <AntDesign name="adduser" size={32} color="black" />
                                <Text className=" text-center mt-2">Friend</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="w-28 h-28  justify-center items-center rounded-xl bg-white shadow-sm shadow-[#a538ff]" onPress={() => navigation.navigate("Add Workout")}>
                                <MaterialIcons name="add-task" size={32} color="black" />
                                <Text className=" text-center mt-2">Workout</Text>
                            </TouchableOpacity>
                        </View>
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