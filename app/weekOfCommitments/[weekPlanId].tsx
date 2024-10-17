import { Text, View, TouchableOpacity, ScrollView } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import SlideWrapper from "@/components/slideFromSide";
import { useState } from "react";
import { User } from "@/types/user";
import { friendCommitmentsState, friendWeekPlansState, myFriends, userState } from "@/storage/atomStorage";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { query, where, collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/firebaseConfig";
import { WeekOfCommitments, Workout } from "@/types/workouts";
import CommitmentCard from "@/components/commitmentCard";
import SpinLoader from "@/components/spinLoader";

const WeekOfCommitmentsPage = () => {

    const { weekPlanId, name } = useLocalSearchParams();
    const router = useRouter();

    const [user,] = useAtom(userState);

    // const [friends,] = useAtom(myFriends);
    // const [friendWeekPlans, setFriendWeekPlans] = useAtom(friendWeekPlansState);
    // const [friendCommitments, setFriendCommitments] = useAtom(friendCommitmentsState);
    // const [loading, setLoading] = useState(true);

    const [pageDoesNotExist, setPageDoesNotExist] = useState(false);

    const [error, setError] = useState("");

    // const [profile, setProfile] = useState<User | null>(null);
    const [weekPlan, setWeekPlan] = useState<WeekOfCommitments | null>(null);
    const [commitments, setCommitments] = useState<Workout[] | null>(null);

    const loadData = async () => {
        try {
            const planRes = await getDoc(doc(FIRESTORE_DB, 'week_plans', weekPlanId as string))
            const correctPlan = planRes.exists() ? { ...planRes.data(), id: planRes.id } as WeekOfCommitments : undefined
            if (!correctPlan) { setPageDoesNotExist(true); return; } else { setWeekPlan(correctPlan) }
            const promises: any[] = [];
            
            correctPlan?.commitments.forEach(commitId => {
                promises.push(getDoc(doc(FIRESTORE_DB, "commitments", commitId)))
            })

            const results = await Promise.allSettled(promises)
            const commits = results.filter(({ status }) => status === "fulfilled").map((res) => {
                if ((res as any).value?.exists()) {
                    return {
                        ...(res as any).value.data(),
                        id: (res as any).value.id
                    }
                }
            })
            setCommitments(commits as Workout[])
        } catch (err) {
            setError("err loading data:" + JSON.stringify(err))
        }
    }
    useEffect(() => {
        if (weekPlanId !== "undefined") {
            loadData()
        } else {
            setPageDoesNotExist(true);
            setError("weekPlanId is 'undefined'")
        }
    }, [])

    return (
        <View className="w-screen h-full bg-white">
            {/* <View className=" h-3/4 w-screen justify-start items-center absolute bottom-0" /> */}
            <SafeAreaView className="w-full h-full ">
                {!pageDoesNotExist ? (
                    <View className="w-full h-full relative  justify-start items-center">
                        <TouchableOpacity className="p-4 z-10 absolute left-4 top-2" onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-lg text-black font-medium pt-6 pb-4">{name}</Text>
                        <View className="w-screen h-full justify-center items-center">
                            {commitments ? (
                                <SlideWrapper direction="right" duration={500} >

                                    <View className=" h-full w-screen justify-start items-center">
                                        <ScrollView className="">
                                            {commitments && commitments
                                                .sort((a, b) => a.startDate.toDate().getTime() - b.startDate.toDate().getTime())
                                                .map(item => {
                                                    return (
                                                        <CommitmentCard key={`${item.id}`} commitment={item} personal={item.userId === user.id} onPress={() => router.push({
                                                            pathname: `/commitment/[commitmentId]`,
                                                            params: {
                                                                commitmentId: item.id
                                                            }
                                                        })} />
                                                    )
                                                })}
                                        </ScrollView>
                                    </View>
                                </SlideWrapper>
                            ) : (
                                <SpinLoader color="black" />
                            )}
                        </View>
                    </View>
                ) : (
                    <View className="w-full h-full relative justify-center items-center">
                        <TouchableOpacity className="p-4 z-10 absolute left-4 top-2" onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <View className="px-6 py-4 bg-black rounded-xl m-4">
                            <Text className="text-white font-medium text-xl">404</Text>
                        </View>
                        <View className="flex flex-col justify-centerr items-center max-w-[50%]">
                            <Text className="text-lg font-medium mb-2">Oops!</Text>
                            <Text className="text-center">We can't find the workouts you're looking for :(</Text>
                            {error && <Text className="text-red-500 text-center mt-4">{error}</Text>}
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    )
}

export default WeekOfCommitmentsPage;