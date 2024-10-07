import { useAtom } from "jotai";
import { useState } from "react";
import { myFriends } from "@/storage/atomStorage";
import { SafeAreaView } from "react-native-safe-area-context";
import DismissKeyboard from "@/components/dismissKeyboard";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import Animated from "react-native-reanimated";

const FriendsPage = () => {

    const [searchInput, setSearchInput] = useState("");
    const [friends, ] = useAtom(myFriends);
    const router = useRouter();

    // const [user,] = useAtom(userState);

    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#f0f0f0', '#ffffff', '#f0f0f0']}
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
                                    className=" bg-white rounded-lg shadow-sm"
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
                                        <TouchableOpacity className="bg-[#ffffff] shadow-sm my-1 border-rounded-full w-full rounded-lg p-4 justify-center items-start"
                                            onPress={() => {
                                                // playSound(mediaData[idx].url)
                                                router.push({
                                                    pathname: "/profile/[userId]",
                                                    params: {
                                                        userId: item.id,
                                                        name: item.name
                                                    }
                                                })
                                            }}  >
                                            <View className="flex-row items-center w-full">
                                                <Animated.View className="justify-center items-center h-12 w-12 bg-[#a538ff]" >
                                                    {/* <Text className="text-white">{item.name.length ? item.name[0].toLocaleUpperCase() : "U"}</Text> */}
                                                </Animated.View>
                                                <View className="grow ml-2">
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

export default FriendsPage;