import { Text, View, TouchableOpacity, ScrollView } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import SlideWrapper from "@/components/slideFromSide";
import { useState } from "react";
import { User } from "@/types/user";
import { myFriends } from "@/storage/atomStorage";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { query, where,collection, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { Workout } from "@/types/workouts";
import CommitmentCard from "@/components/commitmentCard";

const ProfilePage = () => {

    const { userId, name } = useLocalSearchParams();
    const router = useRouter();

    const [friends,] = useAtom(myFriends);

    const [profile, setProfile] = useState<User | null>(null);
    const [commitments, setCommitments] = useState<Workout[] | null>(null);

    useEffect(() => {
        if (userId){
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
        <View className="w-screen h-full bg-orange-300">
            <View className="bg-white h-3/4 w-screen justify-start items-center absolute bottom-0" />
            <SafeAreaView className="w-full h-full ">
                <View className="w-full h-full relative  justify-start items-center">
                    <TouchableOpacity className="p-4 z-10 absolute left-4 top-2" onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <View className="w-screen h-full ">
                        <SlideWrapper direction="right" duration={500} >
                            <View className="w-screen h-full -mt-16 justify-center items-center">
                                <View className=" h-1/3" />
                                <View className=" h-3/4 w-screen justify-start items-center">

                                    <View className={`rounded-full -mt-16 border-white border-4 justify-center items-center h-32 w-32 bg-orange-500`}>
                                        <Text className={`text-4xl font-semibold text-center text-white `}>{`${name[0]?.toLocaleUpperCase() ?? "N"}`}</Text>
                                    </View>
                                    <View className="">
                                        <Text className="w-fit text-2xl font-medium">{name}</Text>
                                    </View>
                                    <View className="p-4 w-full items-center justify-center">
                                        <Text>I am the profile page of user: {name}</Text>
                                        {profile && (
                                            <>
                                                <Text>Account created: {new Date(profile.created_at).toDateString()}</Text>
                                                <Text>Total friends: {profile.friends.length}</Text>
                                            </>
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
            {/* <TouchableOpacity onPress={() => navigation.back()} className={`bg-blue-600 rounded`}>
                    <Text className="text-white py-4 px-8">Back to all</Text>
                </TouchableOpacity> */}
        </View>
    )
}

export default ProfilePage;