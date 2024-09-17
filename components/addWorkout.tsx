
// import { LinearGradient } from "expo-linear-gradient";
// import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useRef, useState } from "react";
import DismissKeyboard from "@/components/dismissKeyboard";
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, addDoc, serverTimestamp, setDoc, updateDoc, doc, DocumentReference } from 'firebase/firestore';
import { FIRESTORE_DB } from "../firebaseConfig";
import { useAtom } from "jotai";
import { userState } from "@/storage/atomStorage";
import SpinLoader from "./spinLoader";



const AddWorkoutModal = ({ onClose }: { onClose: () => void }) => {

    const nameRef = useRef<TextInput>(null);
    // const startDateRef = useRef<TextInput>(null);
    const distanceRef = useRef<TextInput>(null);
    const paceRef = useRef<TextInput>(null);
    const [user,] = useAtom(userState);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        startDate: new Date(),
        distance: "",
        pace: ""
    })

    const isComplete = () => {
        return !!(formData.startDate && formData.distance && formData.pace)
    }

    const handlePaceChange = (text: string) => {
        setFormData({ ...formData, pace: text })
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const commitmentRef = await addDoc(collection(FIRESTORE_DB, 'commitments'), {
                ...formData,
                status: "NA",
                userId: user.id, // Attach the userId from the authenticated user
                created_at: serverTimestamp() // Optional: Add a timestamp when the commitment was created
            });
            if (commitmentRef.id){
                await updateDoc(doc(FIRESTORE_DB, "users", user.id), {
                    workouts: (user.workouts as DocumentReference[]).concat([commitmentRef])
                })
            }

            console.log('Commitment created with ID:', commitmentRef.id);
            onClose();
        } catch (err) {
            alert(JSON.stringify(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        // <SafeAreaView className={` transition-all duration-200 relative`}>
        <DismissKeyboard>
            <View className={`h-full w-full px-4 flex justify-start items-center mt-10 relative`}>
                <View className="relative w-full flex-row justify-center items-center z-20 ">
                    <Text className="font-medium text-xl mt-2">New Commitment</Text>
                    <TouchableOpacity onPress={() => onClose()} className="absolute bottom-0 right-0">
                        <Text className="text-lg">Cancel</Text>
                    </TouchableOpacity>
                </View>
                <View className="max-h-full  w-full flex justify-center items-center ">
                    <KeyboardAvoidingView behavior="padding" className=" w-full  flex justify-center items-center">
                        <View className="w-full space-y-6 my-6">
                            <TouchableOpacity className="w-full h-8 flex-row justify-between items-center" onPress={() => {
                                if (nameRef.current) {
                                    nameRef.current.focus()
                                }
                            }}>
                                <Text className="font-medium text-lg">Name (Optional)</Text>
                                <View className="w-1/2 text-right justify-center text-lg items-end">
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
                            <View className="w-full flex-row h-8 justify-between items-center " >
                                <Text className="font-medium text-lg">Date</Text>
                                <View className="w-1/2 text-right flex-row justify-end items-end">
                                    <DateTimePicker
                                        value={formData.startDate}
                                        mode="date"
                                        display="default"
                                        onChange={(event, date) => setFormData({ ...formData, startDate: date || formData.startDate })}
                                    // style={{ marginBottom: 15 }}
                                    />
                                </View>
                            </View>
                            <TouchableOpacity className="w-full h-8 flex-row justify-between items-center" onPress={() => {
                                if (distanceRef.current) {
                                    distanceRef.current.focus();
                                }
                            }}>
                                <Text className="font-medium text-lg">Distance</Text>
                                <View className="w-1/2 text-right flex-row text-lg justify-end items-center">
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
                                <Text className="font-medium text-lg">Pace</Text>
                                <View className="w-1/2 text-right flex-row justify-end text-lg items-end">
                                    <Text className="text-[16px]">{(formData.pace.length <= 2 ? "00" : formData.pace.length === 3 ? `0${formData.pace.slice(0, formData.pace.length - 2)}` : formData.pace.slice(0, formData.pace.length - 2))}:{(formData.pace.length > 2 ? formData.pace.slice(formData.pace.length - 2) : (formData.pace.length === 1 ? `0${formData.pace}` : formData.pace)) || "00"}</Text>
                                    <TextInput
                                        ref={paceRef}
                                        style={{ paddingVertical: 0, paddingHorizontal: 0, fontSize: 16, width: 1, overflow: "hidden" }}
                                        placeholderTextColor={"gray"}
                                        value={formData.pace}
                                        keyboardType="numeric"
                                        onChangeText={handlePaceChange} />
                                    <Text className="text-[16px]">" / mi</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
                <View className="w-full bottom-24 absolute">
                    <TouchableOpacity className={` rounded-full ${!isComplete() ? "bg-gray-400" : "bg-[#a538ff]"} justify-center items-center h-16 `}
                        onPress={() => isComplete() ? handleSubmit() : alert("please complete required fields")}>
                        {loading ? (
                            <SpinLoader />
                        ) : (
                            <Text className="text-white text-lg font-medium ">Save</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </DismissKeyboard>
        // </SafeAreaView>
    )
}
export default AddWorkoutModal;