import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
// import { useAtom } from "jotai";
// import { userState } from "../storage/atomStorage";
// import {SocialIcon, SocialMediaType} from "@rneui/themed";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import SpinLoader from "./spinLoader";

const SignIn = ({onClose}:{onClose: () => void}) => {

    // const appImage = require('../../assets/images/icon.png');
    // const [user, setUser] = useAtom(userState);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className={`h-full w-full px-4 flex justify-start items-center mt-10`}>
            <View className="h-auto w-full flex justify-center items-center overflow-scroll">
                <KeyboardAvoidingView behavior="padding" className=" w-full px-4 flex justify-center items-center">
                    <View className=" w-full flex justify-center items-center">
                        <View className="mb-5">
                            {/* <Image source={appImage} className="w-20 h-20" 
                                style={{
                                    borderBottomLeftRadius: 5,
                                    borderBottomRightRadius: 5,
                                    borderTopLeftRadius: 5,
                                    borderTopRightRadius: 5,
                                    }} resizeMode={"contain"}/> */}
                            <Text className="text-xl font-semibold">Create your account</Text>
                        </View>
                        <View className="w-full space-y-4 mb-4">
                            <View className="w-full relative ">
                                <TextInput 
                                    placeholder="Email"
                                    className=" border-black border-2 rounded-lg"
                                    style={{paddingVertical: 16, paddingHorizontal: 36}}
                                    placeholderTextColor={"gray"}
                                    value={email}
                                    onChangeText={(text) => setEmail(text)} />
                                <View className="absolute left-2 top-0 bottom-0 justify-center items-center">
                                    <MaterialCommunityIcons name="email-outline" className="absolute left-0" size={24} color="black" />
                                </View>
                            </View>
                            
                            <View className="w-full relative ">
                                <TextInput 
                                    placeholder="Password"
                                    className=" border-black border-2 rounded-lg"
                                    style={{paddingVertical: 16, paddingHorizontal: 36}}
                                    value={password}
                                    placeholderTextColor={"gray"}
                                    onChangeText={(text) => setPassword(text)}
                                    secureTextEntry/>
                                <View className="absolute left-2 top-0 bottom-0 justify-center items-center">
                                    <Feather name="lock" size={24} color="black" />
                                </View>
                            </View>

                        </View>
                        <View className="w-full">
                            <TouchableOpacity className="bg-[#a538ff] mb-6 shadow-sm border-rounded-full w-full rounded-full py-3 mt-1 justify-center items-center"
                                onPress={handleSignUp}  >
                                {loading ? (
                                    <SpinLoader />
                                ) : (
                                    <Text className="text-xl text-white font-semibold">Sign up</Text>
                                )}
                            </TouchableOpacity>
                            {/* <TouchableOpacity className=" mb-6 shadow-md border-rounded-full border-2 border-[#a538ff] w-full rounded-full py-4 mt-1 justify-center items-center"
                                onPress={handleSignUp}  >
                                <Text className="text-xl text-[#a538ff] font-semibold">Register</Text>
                            </TouchableOpacity> */}
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
        </View>
    )
}

export default SignIn;