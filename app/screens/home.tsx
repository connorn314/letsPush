// import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../firebaseConfig";
// import { Teko_400Regular, useFonts } from "@expo-google-fonts/teko";
import { LinearGradient } from "expo-linear-gradient";
import { useAtom } from "jotai";
import { userState } from "../storage/atomStorage";
import { signOut } from "firebase/auth";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import { useNavigation } from "@react-navigation/native";

const HomeScreen = ({navigation}: any) => {

    const [user, ] = useAtom(userState);

    const handleSignOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            // setUser(null);
        } catch (err: any){
            alert(err.message)
        }
    };
    
    return (
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
                            <TouchableOpacity className="w-28 h-28 justify-center items-center rounded-xl bg-white shadow-sm shadow-[#a538ff]" onPress={() => navigation.navigate("Friends")}>
                                <AntDesign name="adduser" size={32} color="black" />
                                <Text className=" text-center mt-2">Friend</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="w-28 h-28  justify-center items-center rounded-xl bg-white shadow-sm shadow-[#a538ff]" onPress={() => navigation.navigate("Workouts")}>
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
    )
}

export default HomeScreen;