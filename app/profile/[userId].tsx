import { Text, View, TouchableOpacity, ScrollView, Image, useWindowDimensions } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import SlideWrapper from "@/components/slideFromSide";
import { useState } from "react";
import { User } from "@/types/user";
import { myFriends } from "@/storage/atomStorage";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { query, where, collection, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { Workout } from "@/types/workouts";
import CommitmentCard from "@/components/commitmentCard";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const ProfilePage = () => {

    const { userId } = useLocalSearchParams();
    const router = useRouter();
    const { width } = useWindowDimensions();

    const [friends,] = useAtom(myFriends);

    const [profile, setProfile] = useState<User | null>(null);
    const [commitments, setCommitments] = useState<Workout[] | null>(null);

    useEffect(() => {
        if (userId) {
            const q = query(
                collection(FIRESTORE_DB, 'commitments'),
                where('userId', '==', userId)
            );

            const subscriber = onSnapshot(q, {
                next: (snapshot) => {
                    const workoutsArr: any[] = [];
                    snapshot.docs.forEach(doc => {
                        // const tourStops = doc.data()
                        // console.log(doc.data(), console.log(doc.id))
                        workoutsArr.push({ id: doc.id, ...doc.data() })
                    })
                    setCommitments(workoutsArr as Workout[])
                }
            })

            return () => subscriber();
        }
    }, [])

    useEffect(() => {
        if (!profile) {
            setProfile(friends.find(friend => friend.id === userId) ?? null)
        }
    }, [])

    return (
        <View className="w-screen h-full " style={{ backgroundColor: "#d7a6ff" }}>
            <View className="bg-white h-3/4 w-screen justify-start items-center absolute bottom-0" >
            </View>
            <View className=" absolute top-[25vh] border-b-white  w-20 h-20"
                style={{
                    borderBottomWidth: 75,
                    borderRightWidth: (width / 2),
                    borderLeftWidth: (width / 2),
                    borderLeftColor: "#d7a6ff",
                    borderRightColor: "#d7a6ff"
                }} />

            <SafeAreaView className="w-full h-full ">
                <View className="w-full h-full relative  justify-start items-center">
                    <TouchableOpacity className="p-4 z-10 absolute left-4 top-2" onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View className="w-screen h-full ">
                        <SlideWrapper direction="right" duration={500} >
                            <View className="w-screen h-full -mt-16 justify-center items-center">
                                <View className=" h-1/3" />
                                <View className=" h-3/4 w-screen justify-start items-center relative">
                                    {profile?.profile_image_url ? (
                                        <View className={`rounded-full -mt-16 border-white border-4 justify-center items-center h-32 w-32 overflow-hidden`}>
                                            <Image source={{ uri: profile.profile_image_url }} className="w-32 h-32"
                                                style={{
                                                    borderBottomLeftRadius: 5,
                                                    borderBottomRightRadius: 5,
                                                    borderTopLeftRadius: 5,
                                                    borderTopRightRadius: 5,
                                                }} resizeMode={"cover"} />
                                        </View>
                                    ) : (
                                        <View className={`rounded-full -mt-16 border-white border-4 justify-center items-center h-32 w-32 bg-orange-500`}>
                                            <Text className={`text-4xl font-semibold text-center text-white `}>{`${profile?.name[0]?.toLocaleUpperCase() ?? "N"}`}</Text>
                                        </View>
                                    )}
                                    <View className="">
                                        <Text className="w-fit text-2xl font-medium">{profile?.name}</Text>
                                    </View>
                                    <View className="p-4 w-full flex-row items-center justify-center space-x-8">
                                        {profile && (
                                            <View className="flex-row justify-center items-center">
                                                <Feather name="users" size={22} color="black" />
                                                <Text className="text-lg font-medium ml-2">{profile.friends.length}</Text>
                                            </View>
                                        )}
                                        {commitments?.length && (
                                            <View className="flex-row justify-center items-center">
                                                <FontAwesome5 name="running" size={20} color="black" />
                                                <Text className="text-lg font-medium ml-2">{commitments.filter(commit => commit.status === "complete").length}</Text>
                                            </View>
                                        )}
                                        {commitments?.length && (
                                            <View className="flex-row justify-center items-center">
                                                <MaterialCommunityIcons name="emoticon-sick-outline" size={22} color="black" />

                                                <Text className="text-lg font-medium ml-2">{commitments.filter(commit => commit.status === "failure").length}</Text>
                                            </View>
                                        )}

                                    </View>
                                    <ScrollView>
                                        {commitments && commitments.map(item => {
                                            return (
                                                <CommitmentCard key={`${item.id}`} commitment={item} onPress={() => router.push({
                                                    pathname: `/commitment/[commitmentId]`,
                                                    params: {
                                                        commitmentId: item.id
                                                    }
                                                })} />
                                            )
                                        })}
                                    </ScrollView>
                                </View>
                            </View>
                        </SlideWrapper>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default ProfilePage;