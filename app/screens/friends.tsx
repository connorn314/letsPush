
import { View, TextInput, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from 'react';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DismissKeyboard } from './login';
import Feather from '@expo/vector-icons/Feather';
import { myFriends, userState } from '../storage/atomStorage';
// import { collection, doc, getDoc, onSnapshot, query, where, documentId } from 'firebase/firestore';
// import { FIRESTORE_DB } from '../../firebaseConfig';
import { useAtom } from "jotai";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const FriendsScreen = () => {

    const [searchInput, setSearchInput] = useState("");
    const [friends, ] = useAtom(myFriends);

    // const [user,] = useAtom(userState);

    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#ffffff', '#ffffff', '#ffffff']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
        >
            <SafeAreaView className={` transition-all duration-200 relative`}>
                <DismissKeyboard>
                    <View className='w-screen h-full justify-start items-center'>
                        <View className='w-full p-4 justify-start items-center'>
                            <View className="w-full relative  rounded-lg   ">
                                <TextInput
                                    placeholder="Find Friends..."
                                    className=" bg-white rounded-lg"
                                    style={{ paddingVertical: 16, paddingHorizontal: 40 }}
                                    placeholderTextColor={"gray"}
                                    value={searchInput}
                                    onChangeText={(text) => setSearchInput(text)} />
                                <View className="absolute left-2 top-0 bottom-0 justify-center items-center">
                                    <FontAwesome name="search" size={20} color="black" />
                                </View>
                            </View>

                        </View>
                        <View className='w-full px-4'>
                            <FlatList data={friends} keyExtractor={(item) => `${item.id}`}
                                renderItem={({ item }) => {
                                    // const date = item.startDate.toDate();
                                    return (
                                        <TouchableOpacity className="bg-[#ffffff] border-rounded-full w-full rounded-lg p-4 justify-center items-start"
                                            onPress={() => {
                                                // playSound(mediaData[idx].url)
                                                alert("Eventually take to a friends detail screen")
                                            }}  >
                                            <View className="flex-row items-center w-full">
                                                <View className="grow">
                                                    <Text className="text-lg">{item.name}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }} />
                        </View>
                    </View>
                </DismissKeyboard>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default FriendsScreen;