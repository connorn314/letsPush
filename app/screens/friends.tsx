
import { View, TextInput, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from 'react';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DismissKeyboard } from './login';
import Feather from '@expo/vector-icons/Feather';

const FriendsScreen = () => {

    const [searchInput, setSearchInput] = useState("");

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

    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#ffffff', '#ffffff', '#a538ff']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20}}
            >
            <SafeAreaView className={` transition-all duration-200 relative`}>
            <DismissKeyboard>
                <View className='w-screen h-full justify-start items-center'>
                    <View className='w-full p-4 h-full justify-start items-center'>
                        <View className="w-full relative  rounded-lg   ">
                            <TextInput 
                                placeholder="Find Friends..."
                                className=" shadow bg-white rounded-lg"
                                style={{paddingVertical: 16, paddingHorizontal: 36}}
                                placeholderTextColor={"gray"}
                                value={searchInput}
                                onChangeText={(text) => setSearchInput(text)} />
                            <View className="absolute left-2 top-0 bottom-0 justify-center items-center">
                                <Feather name="search" size={20} color="black" />
                            </View>
                        </View>

                    </View>
                </View>
            </DismissKeyboard>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default FriendsScreen;