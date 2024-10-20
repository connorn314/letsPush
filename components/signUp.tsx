import { View, Text, KeyboardAvoidingView, TextInput, Keyboard, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

import { FIREBASE_AUTH, FIRESTORE_DB } from "../firebaseConfig";
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, User } from "firebase/auth";
// import { useAtom } from "jotai";
// import { userState } from "../storage/atomStorage";
// import {SocialIcon, SocialMediaType} from "@rneui/themed";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import SpinLoader from "./spinLoader";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { expoPushTokenState, signingUpState, userState } from "@/storage/atomStorage";
import { useAtom } from "jotai";
import { Href, Link, useRouter } from "expo-router";
import TimezoneSelector from "./timezoneSelector";
import DismissKeyboard from "./dismissKeyboard";

const SignIn = ({ onClose }: { onClose?: () => void }) => {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [selectedTimezone, setSelectedTimezone] = useState<any | null>(null);
    const [expoToken,] = useAtom(expoPushTokenState);
    const [, setUser] = useAtom(userState);
    const [isSigningUp, setIsSigningUp] = useAtom(signingUpState);

    // useEffect(() => {
    // const tz = TimeZone.getTimeZone()
    // console.log(tz, "tz")
    // setSelectedTimezone(tz)
    // }, [])


    const handleSignUp = async () => {
        setIsSigningUp(true);
        Keyboard.dismiss()
        try {
            const { user: userObj } = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const newUser = (await createUser(userObj)).data
            setUser({ ...userObj, id: userObj.uid, ...newUser })
            // router.dismiss()
            // router.push("/(tabs)/home")
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSigningUp(false);
        }
    }

    const createUser = async (userObj: User) => {
        const userData = {
            name,
            created_at: Date.now(),
            friends: [],
            pushToken: expoToken || "",
            workouts: [],
            weekPlans: [],
            friend_requests_recieved: [],
            friend_requests_extended: [],
            onboarding_incomplete: true,
        }
        // console.log("userData", userData)
        await setDoc(doc(FIRESTORE_DB, "users", userObj.uid), userData);
        const nameSegments = name.split(" ");
        await setDoc(doc(FIRESTORE_DB, "searchable_users", userObj.uid), {
            name,
            email: userObj.email,
            lower_first: nameSegments[0].toLocaleLowerCase(),
            lower_last: nameSegments[nameSegments.length - 1].toLocaleLowerCase()
        });
        return await getDoc(doc(FIRESTORE_DB, "users", userObj.uid));
    }

    return (
        <View className={`h-full w-full px-4 flex justify-start items-center`}>
            <DismissKeyboard>
                <View className="h-full w-full flex justify-center items-center overflow-scroll">

                    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100} className="h-full w-full px-4 flex justify-center items-center mt-4">
                        <View className=" w-full flex justify-center items-center pb-20">
                            <View className="mb-12 h-14 relative  w-full ">
                                <Text className="top-0 text-center w-full absolute text-[50px] font-black mb-6 text-main" style={{ fontFamily: "BenchNine_700Bold" }}>Ruñet</Text>
                                <Text className="top-0 text-center w-full absolute text-[50px] font-black mb-6" style={{ fontFamily: "BenchNine_700Bold" }}>Runet</Text>
                            </View>
                            <View className="mb-5">
                                <Text className="text-xl font-medium">Create your account</Text>
                            </View>
                            <View className="w-full space-y-4 mb-4">
                                <View className="w-full relative ">
                                    <Text className="py-2">Name</Text>
                                    <TextInput
                                        autoCapitalize="words"
                                        placeholder="Name"
                                        className=" border border-gray-200 bg-white rounded-lg"
                                        style={{ paddingVertical: 16, paddingHorizontal: 16 }}
                                        placeholderTextColor={"gray"}
                                        value={name}
                                        onChangeText={(text) => setName(text)} />
                                </View>


                                <View className="w-full relative ">
                                    <Text className="py-2">Email</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        placeholder="Email"
                                        className=" border border-gray-200 bg-white rounded-lg"
                                        style={{ paddingVertical: 16, paddingHorizontal: 16 }}
                                        placeholderTextColor={"gray"}
                                        value={email}
                                        onChangeText={(text) => setEmail(text)} />
                                </View>

                                <View className="w-full relative ">
                                    <Text className="py-2">Password</Text>
                                    <TextInput
                                        placeholder="Password"
                                        className=" border border-gray-200 bg-white rounded-lg"
                                        style={{ paddingVertical: 16, paddingHorizontal: 16 }}
                                        value={password}
                                        placeholderTextColor={"gray"}
                                        onChangeText={(text) => setPassword(text)}
                                        secureTextEntry />
                                </View>
                            </View>
                            <View className="w-full">
                                <TouchableOpacity className="bg-main mb-6 w-full rounded-xl h-14 mt-4 justify-center items-center"
                                    onPress={handleSignUp}  >
                                    {isSigningUp ? (
                                        <SpinLoader />
                                    ) : (
                                        <Text className="text text-white font-medium">Sign up</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View className="flex flex-row justify-center items-center mt-4">
                                {/* <Text className="text-gray-500">Need an Account? </Text> */}
                                <TouchableOpacity className="underline" >
                                    <Link href={".."}>
                                        <Text className="underline ml-1">Cancel</Text>
                                    </Link>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>

                    {/* Divider */}
                    {/* <View className="flex flex-row justify-evenly items-center w-full mb-4">
                    <View className="w-2/5 h-0.5 bg-gray-300"/>
                    <Text className="text-gray-300 font-semibold">or</Text>
                    <View className="w-2/5 h-0.5 bg-gray-300"/>
                </View> */}

                    {/* Alternate sign in options */}
                    {/* <View className="flex justify-evenly items-center w-full">
                    <TouchableOpacity className=" mb-2 shadow-sm bg-[#dd4b39] w-full rounded-lg mt-1 flex flex-row justify-center items-center"
                        onPress={() => console.log("Sign in with Google")}  >
                        <SocialIcon
                            type={"google"}
                            iconType={'font-awesome'}
                            iconColor={"white"}
                            raised={false}
                            iconSize={16}
                        />
                        <Text className="text-white text-md font-semibold">Sign up with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className=" mb-2 shadow-sm bg-black w-full rounded-lg mt-1 flex flex-row justify-center items-center"
                        onPress={() => console.log("Sign in with Apple")}  >
                        <SocialIcon
                            type={"apple" as SocialMediaType}
                            iconType={'font-awesome'}
                            iconColor={"white"}
                            raised={false}
                            iconSize={16}
                        />
                        <Text className="text-white text-md font-semibold">Sign up with Apple</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className=" mb-2 shadow-sm bg-[#4267b2] w-full rounded-lg mt-1 flex flex-row justify-center items-center"
                        onPress={() => console.log("Sign in with Facebook")}  >
                        <SocialIcon
                            type={"facebook"}
                            iconType={'font-awesome'}
                            iconColor={"white"}
                            raised={false}
                            iconSize={16}
                            // iconStyle={{marginLeft: 20}}
                        />
                        <Text className="text-white text-md text-center font-semibold ">Sign up with Facebook</Text>
                    </TouchableOpacity>
                </View> */}
                </View>
            </DismissKeyboard>
        </View>
    )
}

export default SignIn;