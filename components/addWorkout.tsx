
// import { LinearGradient } from "expo-linear-gradient";
// import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { collection, addDoc, serverTimestamp, setDoc, updateDoc, doc, DocumentReference } from 'firebase/firestore';
// import { FIRESTORE_DB } from "../firebaseConfig";
// import { useAtom } from "jotai";
// import { userState } from "@/storage/atomStorage";
import DismissKeyboard from "@/components/dismissKeyboard";
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useRef, useState } from "react";




const AddWorkoutModal = ({ onClose, workout }:
    {
        onClose: (data: any) => void;
        workout?: {
            name: string;
            distance: string;
            pace: string;
        }
        // onChange: (e: any) => void;
        // formData: {
        //     name: string;
        //     startDate: Date;
        //     distance: string;
        //     pace: string;
        // }
    }) => {

    const nameRef = useRef<TextInput>(null);
    const distanceRef = useRef<TextInput>(null);
    const paceRef = useRef<TextInput>(null);

    const [formData, setFormData] = useState({
        name: workout ? workout.name : "",
        distance: workout ? workout.distance : "",
        pace: workout ? workout.pace : ""
    })

    const isComplete = () => {
        if (workout){
            return (workout.name !== formData.name || workout.distance !== formData.distance || workout.pace !== formData.pace )
        }
        return (formData.distance && formData.pace)
    }


    return (
        // <SafeAreaView className={` transition-all duration-200 relative`}>
        <View className={`w-full px-4 flex justify-start items-center`}>
            <View className="  w-full flex justify-center items-center ">
                {/* <DismissKeyboard> */}
                    <View className="w-full space-y-6 my-6 ">
                        <TouchableOpacity className="w-full h-8 flex-row justify-between items-center" onPress={() => {
                            if (nameRef.current) {
                                nameRef.current.focus()
                            }
                        }}>
                            <Text className="font-medium text-md">Name (Optional)</Text>
                            <View className="w-1/2 text-right justify-center text-md items-end">
                                <TextInput
                                    ref={nameRef}
                                    placeholder="Edit"
                                    // className=" border-black border-2 rounded-lg"
                                    style={{ paddingVertical: 0, paddingHorizontal: 0, fontSize: 16 }}
                                    placeholderTextColor={"gray"}
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({ ...formData, name: text })} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="w-full h-8 flex-row justify-between items-center" onPress={() => {
                            if (distanceRef.current) {
                                distanceRef.current.focus();
                            }
                        }}>
                            <Text className="font-medium text-md">Distance</Text>
                            <View className="w-1/2 text-right flex-row text-md justify-end items-center">
                                <TextInput
                                    value={formData.distance}
                                    onChangeText={(text) => setFormData({ ...formData, distance: text })}
                                    placeholderTextColor={"gray"}
                                    ref={distanceRef}
                                    style={{ fontSize: 16 }}
                                    placeholder="Edit"
                                    keyboardType="numeric"
                                // style={{ borderBottomWidth: 1, marginBottom: 15 }}
                                />
                                {formData.distance && <Text className="ml-1 text-[16px]">mi</Text>}
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="w-full h-8 flex-row justify-between items-center" onPress={() => {
                            if (paceRef.current) {
                                paceRef.current.focus();
                            }
                        }}>
                            <Text className="font-medium text-md">Pace</Text>
                            <View className="w-1/2 text-right flex-row justify-end text-md items-end">
                                <Text className="text-[16px]">{(formData.pace.length <= 2 ? "00" : formData.pace.length === 3 ? `0${formData.pace.slice(0, formData.pace.length - 2)}` : formData.pace.slice(0, formData.pace.length - 2))}:{(formData.pace.length > 2 ? formData.pace.slice(formData.pace.length - 2) : (formData.pace.length === 1 ? `0${formData.pace}` : formData.pace)) || "00"}</Text>
                                <TextInput
                                    ref={paceRef}
                                    style={{ paddingVertical: 0, paddingHorizontal: 0, fontSize: 16, width: 1, overflow: "hidden" }}
                                    placeholderTextColor={"gray"}
                                    value={formData.pace}
                                    keyboardType="numeric"
                                    onChangeText={(text: string) => {
                                        setFormData({ ...formData, pace: text })
                                    }} />
                                <Text className="text-[16px]">" / mi</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                {/* </DismissKeyboard> */}
            </View>
            <View className="w-full flex-row justify-center items-center" >
                <TouchableOpacity className={` w-full rounded-xl ${!isComplete() ? "bg-gray-400" : "bg-[#a538ff]"} justify-center items-center  p-4`}
                    onPress={() => {
                        if (isComplete()) {
                            onClose(formData)
                        } else {
                            workout ? alert("Please change at least one field") : alert("please complete required fields")
                        }
                    }}>
                    <Text className="text-white text font-medium">{workout ? "Update" : "Save"}</Text>
                </TouchableOpacity>

            </View>
        </View >
    )
}
export default AddWorkoutModal;


    // const handleSubmit = async () => {
    //     try {
    //         setLoading(true)
    //         const commitmentRef = await addDoc(collection(FIRESTORE_DB, 'commitments'), {
    //             ...formData,
    //             status: "NA",
    //             userId: user.id, // Attach the userId from the authenticated user
    //             created_at: serverTimestamp() // Optional: Add a timestamp when the commitment was created
    //         });
    //         if (commitmentRef.id){
    //             await updateDoc(doc(FIRESTORE_DB, "users", user.id), {
    //                 workouts: (user.workouts as DocumentReference[]).concat([commitmentRef])
    //             })
    //         }

    //         console.log('Commitment created with ID:', commitmentRef.id);
    //         onClose();
    //     } catch (err) {
    //         alert(JSON.stringify(err))
    //     } finally {
    //         setLoading(false)
    //     }
    // }
