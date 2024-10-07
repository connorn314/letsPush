import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image, Button } from "react-native";
import { StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
// import {SocialIcon, SocialMediaType} from "@rneui/themed";
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import SpinLoader from "@/components/spinLoader";
import SignIn from "@/components/signUp";
import DismissKeyboard from "@/components/dismissKeyboard";
import { LinearGradient } from "expo-linear-gradient";
// import CustomBackdrop from "../components/CustomBackdrop";

const Login = ({ navigation }: any) => {


    const appImage = require('@/assets/images/besvarra_long_horiz.png');
    const stravaImage = require('@/assets/images/api_logo_pwrdBy_strava_stack_gray.png');
    // const [user, setUser] = useAtom(userState);
    // const [withPassword, setWithPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [test, setTest] = useState(-1);

    const handleClosePress = () => {
        setTest(-1)
        bottomSheetRef?.current?.close()
    }
    const handleOpenPress = () => {
        setTest(0)
        bottomSheetRef?.current?.expand()
    }

    // const handleSignUp = async () => {
    //     try {
    //         const userCredentials = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
    //         setUser(userCredentials.user)
    //     } catch (err: any) {
    //         alert(err.message)
    //     }
    // }

    const handleSignIn = async () => {
        setLoading(true)
        try {
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
        } catch (err: any) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#f0f0f0', '#ffffff', '#f0f0f0']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
        >
            <SafeAreaView className={` relative`}>
                <DismissKeyboard>
                    <View className="h-full w-screen px-4 flex justify-evenly items-center">
                        <View className="h-auto w-full flex justify-center items-center overflow-scroll">
                            <KeyboardAvoidingView behavior="padding" className=" w-full px-4 flex justify-center items-center">
                                <View className=" w-full flex justify-center items-center">
                                    <View className="mb-12">
                                        <Text className=" text-[50px] font-black mb-6" style={{ fontFamily: "BenchNine_700Bold"}}>Ruñet</Text>
                                        {/* <Image source={appImage} className="w-screen h-20"
                                            style={{
                                                borderBottomLeftRadius: 5,
                                                borderBottomRightRadius: 5,
                                                borderTopLeftRadius: 5,
                                                borderTopRightRadius: 5,
                                            }} resizeMode={"contain"} /> */}

                                    </View>
                                    {/* <TouchableOpacity>

                                    </TouchableOpacity> */}
                                    <View className="w-full space-y-4 mb-4">
                                        <View className="w-full relative ">
                                            <Text className="py-2">Email</Text>
                                            <TextInput
                                                placeholder="Email"
                                                className=" border border-gray-200 rounded-lg"
                                                style={{ paddingVertical: 16, paddingHorizontal: 16 }}
                                                placeholderTextColor={"gray"}
                                                value={email}
                                                onChangeText={(text) => setEmail(text)} />
                                            {/* <View className="absolute left-2 top-0 bottom-0 justify-center items-center">
                                                <MaterialCommunityIcons name="email-outline" className="absolute left-0" size={20} color="black" />
                                            </View> */}
                                        </View>

                                        <View className="w-full relative ">
                                            <Text className="py-2">Password</Text>
                                            <TextInput
                                                placeholder="Password"
                                                className="border border-gray-200  rounded-lg"
                                                style={{ paddingVertical: 16, paddingHorizontal: 16 }}
                                                value={password}
                                                placeholderTextColor={"gray"}
                                                onChangeText={(text) => setPassword(text)}
                                                secureTextEntry />
                                            {/* <View className="absolute left-2 top-0 bottom-0 justify-center items-center">
                                                <Feather name="lock" size={20} color="black" />
                                            </View> */}
                                        </View>

                                    </View>
                                    <View className="w-full">
                                        <TouchableOpacity className="bg-[#a538ff] mb-6 w-full rounded-xl h-14 mt-4 justify-center items-center"
                                            onPress={handleSignIn}  >
                                            {loading ? (
                                                <SpinLoader />
                                            ) : (
                                                <Text className="text text-white font-medium">Log in</Text>
                                            )}
                                        </TouchableOpacity>
                                        {/* <View className="w-full justify-center items-center mb-6">
                                            <Text className="text-md underline text-black">forgot password?</Text>
                                        </View> */}
                                        <View className="w-full items-center justify-center">
                                            <Image source={stravaImage} className="w-24 h-24"
                                                style={{
                                                    borderBottomLeftRadius: 5,
                                                    borderBottomRightRadius: 5,
                                                    borderTopLeftRadius: 5,
                                                    borderTopRightRadius: 5,
                                                }} resizeMode={"contain"} />

                                        </View>
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
                                    <Text className="text-white text-md font-semibold">Sign in with Google</Text>
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
                                    <Text className="text-white text-md font-semibold">Sign in with Apple</Text>
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
                                    <Text className="text-white text-md text-center font-semibold ">Sign in with Facebook</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>

                        {/* Create Account */}
                        <View className="flex flex-row justify-center items-center">
                            <Text className="text-gray-500">Need an Account?</Text>
                            <TouchableOpacity className="underline" onPress={handleOpenPress}>
                                <Text className="underline ml-1">Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </DismissKeyboard>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={test} // If the index value is set to -1, the sheet will initialize in a closed state.
                    detached={false} // Determines if the bottom sheet is attached to the bottom or not.
                    snapPoints={["90%"]}
                    enablePanDownToClose
                    // backgroundStyle={{}}
                    // backdropComponent={(props: BottomSheetBackdropProps) => (
                    //     <BottomSheetBackdrop {...props} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} enableTouchThrough={true} />
                    // )}
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
                    <SignIn onClose={() => handleClosePress()} />
                </BottomSheet>
            </SafeAreaView>

        </LinearGradient>
    )
};


export default Login;