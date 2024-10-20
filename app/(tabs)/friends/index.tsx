import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { myFriends, userState } from "@/storage/atomStorage";
import { SafeAreaView } from "react-native-safe-area-context";
import DismissKeyboard from "@/components/dismissKeyboard";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from "expo-router";
import Animated from "react-native-reanimated";
import { query, collection, where, documentId, getDocs, limit } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import SpinLoader from "@/components/spinLoader";
import Fontisto from '@expo/vector-icons/Fontisto';
import { debounce } from "lodash";
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const sendFriendRequest = httpsCallable(functions, 'sendFriendRequest');

const FriendsPage = () => {

    const [user, setUser] = useAtom(userState);
    const [friends,] = useAtom(myFriends);
    const router = useRouter();

    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState<null | string>(null)

    const handleTextChange = (text: string) => {
        setSearchInput(text);
        handleSearch(text)
    }
    const handleSearch = useRef(
        debounce(async (value: string) => {
            const currentSearchInput = (value || value === "") ? value : searchInput
            if (currentSearchInput.length > 1) {
                try {
                    setLoading(true)
                    const q = query(
                        collection(FIRESTORE_DB, 'searchable_users'),
                        where(documentId(), "not-in", (user?.friends ?? []).concat([`${user?.id}`])),
                        where('lower_first', '>=', currentSearchInput.toLocaleLowerCase()),
                        where('lower_first', '<=', currentSearchInput.toLocaleLowerCase() + '\uf8ff'), // Range query for partial match
                        limit(10)
                    );

                    const q2 = query(
                        collection(FIRESTORE_DB, 'searchable_users'),
                        where(documentId(), "not-in", (user?.friends ?? []).concat([`${user?.id}`])),
                        where('lower_last', '>=', currentSearchInput.toLocaleLowerCase()),
                        where('lower_last', '<=', currentSearchInput.toLocaleLowerCase() + '\uf8ff'), // Range query for partial match
                        limit(10)
                    );

                    const querySnapshot = await getDocs(q);
                    const querySnapshot2 = await getDocs(q2);

                    const matchingUsers: any[] = [];

                    querySnapshot.forEach(doc => {
                        matchingUsers.push({ id: doc.id, ...doc.data() });
                    });

                    querySnapshot2.forEach(doc => {
                        if (!matchingUsers.find(us => us.email === doc.data().email)) {
                            matchingUsers.push({ id: doc.id, ...doc.data() });
                        }
                    });

                    setSearchResults(matchingUsers)

                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            } else if (currentSearchInput.length === 0) {
                setSearchResults([])
            }
        }, 300)
    ).current

    const sendRequest = async (friendId: string) => {
        setSending(friendId)
        try {
            await sendFriendRequest({ to: friendId });
            setUser({
                ...user,
                friend_requests_extended: (user.friend_requests_extended ?? []).concat([friendId])
            })
        } catch (err) {
            alert("Error sending request: " + JSON.stringify(err))
        } finally {
            setSending(null)
        }
    }


    useEffect(() => {
        return () => {
            handleSearch.cancel();
        };
    }, [handleSearch]);


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
                        <View className='w-full p-4 justify-start items-center relative overflow-visible z-20'>
                            <View className={`w-full relative overflow-hidden `}>
                                <TextInput
                                    placeholder="Find Friends..."
                                    autoComplete="off"
                                    autoCorrect={false}
                                    className={`bg-white  shadow-sm ${searchResults.length > 0 ? "rounded-t-lg" : " rounded-lg"}`}
                                    style={{ paddingVertical: 16, paddingHorizontal: 48 }}
                                    placeholderTextColor={"gray"}
                                    value={searchInput}
                                    onChangeText={handleTextChange} />
                                <View className="absolute left-4 top-0 bottom-0 justify-center items-center">
                                    {loading ? (
                                        <SpinLoader color="black" size={20} />
                                    ) : (
                                        <FontAwesome name="search" size={20} color="black" />
                                    )}
                                </View>
                                {searchResults.length > 0 && (
                                    <TouchableOpacity onPress={() => {
                                        setSearchInput("")
                                        setSearchResults([])
                                    }} className="absolute right-4 top-0 bottom-0 justify-center items-center">
                                        <Fontisto name="close-a" size={14} color="black" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            {searchResults.length > 0 && (
                                <View className="max-h-80 absolute top-16">
                                    <FlatList className="shadow-sm" data={searchResults} keyExtractor={(item) => item.id}
                                        renderItem={({ item, index }) => (
                                            <View className={`w-full  bg-white p-4 flex-row justify-between items-center ${index === searchResults.length - 1 ? "rounded-b-lg" : "border-b-gray-200 border-b"}`}>
                                                <View className="flex-row justify-center items-center">
                                                    {item.profile_image_url && (
                                                        <Image source={{ uri: item?.profile_image_url }} className="w-10 h-10 mr-2"
                                                            style={{
                                                                borderBottomLeftRadius: 5,
                                                                borderBottomRightRadius: 5,
                                                                borderTopLeftRadius: 5,
                                                                borderTopRightRadius: 5,
                                                            }} resizeMode={"cover"} />
                                                    )}
                                                    <View>
                                                        <Text className="font-medium">{item.name}</Text>
                                                        <Text className="text-sm">{item.email}</Text>
                                                    </View>
                                                </View>
                                                <View>
                                                    {(user.friend_requests_extended ?? []).includes(item.id) ? (
                                                        <View className="bg-gray-200 h-8 w-16 justify-center items-center rounded-lg">
                                                            <Text className="">Pending</Text>
                                                        </View>
                                                    ) : (
                                                        <TouchableOpacity onPress={() => sendRequest(item.id)} className="bg-main h-8 w-16 justify-center items-center rounded-lg">
                                                            {sending === item.id ? (
                                                                <SpinLoader color="white" size={16} />
                                                            ) : (
                                                                <Text className="text-white">Add</Text>
                                                            )}
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>
                                        )} />
                                </View>
                            )}
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
                                                {item.profile_image_url && (
                                                    <Image source={{ uri: item?.profile_image_url }} className="w-12 h-12 mr-2"
                                                        style={{
                                                            borderBottomLeftRadius: 5,
                                                            borderBottomRightRadius: 5,
                                                            borderTopLeftRadius: 5,
                                                            borderTopRightRadius: 5,
                                                        }} resizeMode={"cover"} />
                                                )}
                                                <View className="grow ml-2">
                                                    <Text className="text-lg">{item.name}</Text>
                                                </View>
                                                <View>
                                                    <Text></Text>
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