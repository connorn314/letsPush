import { hasBadgeNotificationsState, lockPageOnCarousel, myWeekPlansState, myWorkoutsState, thisWeekPlanState } from "@/storage/atomStorage";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationsModal from "@/components/notificationsModal";
import AddWorkoutModal from "@/components/addWorkout";
import { Keyboard, StyleSheet, TouchableOpacity, View, Text, ScrollView } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import PersonalCommitmentCard from "@/components/personalCommitmentCard";
import { useLocalSearchParams, useRouter } from "expo-router";
import AddWeeklyCommitmentsModal from "@/components/addWeeklyCommitments";
import WeeklyCommitmentsDisplay from "@/components/weeklyCommitmentsCard";
import * as Notifications from 'expo-notifications';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';


const WorkoutsPage = () => {

    // const [user,] = useAtom(userState);
    const [workouts,] = useAtom(myWorkoutsState);
    const [weekPlans,] = useAtom(myWeekPlansState);
    const [thisWeekPlan] = useAtom(thisWeekPlanState);

    const [lockPage, setLockPage] = useAtom(lockPageOnCarousel);
    const [hasBadgeNotifications, setHasBadgeNotifications] = useAtom(hasBadgeNotificationsState);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const notificationModalRef = useRef<BottomSheetModal>(null);

    const router = useRouter();

    const { showAddWorkout } = useLocalSearchParams();

    const [currFilter, setCurrFilter] = useState("Week")
    const [second, setSecond] = useState(-1);
    // // callbacks
    const handlePresentModalPress = useCallback(() => {
        setTest(0)
        bottomSheetModalRef.current?.present()
    }, []);

    const [test, setTest] = useState(-1);

    const handleClosePress = () => {
        setTest(-1)
        bottomSheetModalRef?.current?.close()
    }

    const handlePresentNotifications = useCallback(() => {
        Notifications.setBadgeCountAsync(0);
        setHasBadgeNotifications(false);
        setSecond(0)
        notificationModalRef.current?.present()
    }, [])

    const handleCloseNotifications = useCallback(() => {
        setSecond(-1)
        notificationModalRef.current?.close()
    }, [])

    useEffect(() => {
        if (showAddWorkout) {
            handlePresentModalPress()
        }
    }, [showAddWorkout])

    useEffect(() => {
        Notifications.getBadgeCountAsync().then((val) => {
            setHasBadgeNotifications(val !== 0)
        }).catch(err => console.log("err getting badge count: " + JSON.stringify(err)))
    }, [])

    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#f0f0f0', '#ffffff', '#f0f0f0']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
        >
            <SafeAreaView className={` transition-all duration-200 relative`}>
                <View className='w-screen h-full justify-start items-center'>
                    <View className=' w-full flex-row justify-center items-center'>
                        <TouchableOpacity onPress={() => handlePresentModalPress()} className='p-4 rounded-full absolute top-2 left-4'>
                            <Entypo name="plus" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-lg text-black font-medium pt-6 pb-4">Workouts</Text>

                        <TouchableOpacity onPress={handlePresentNotifications} className='p-4 rounded-full absolute top-2 right-4'>
                            <View className="relative">
                                <FontAwesome5 name="bell" size={24} color="black" />
                                {hasBadgeNotifications && <View className="h-3 w-3 bg-red-500 rounded-full border-[#f0f0f0] border-2 absolute top-0 right-0" />}
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View className="w-full">
                        <View className="p-4 w-full flex-row justify-start items-center">
                            <TouchableOpacity onPress={() => setCurrFilter("Week")} className={`${currFilter === "Week" ? "bg-main" : "bg-[#e9cfff]"} p-4 rounded-lg mx-1`}>
                                <Text className={`${currFilter === "Week" ? "text-white" : ""}`}>This Week</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setCurrFilter("Previous")} className={`${currFilter === "Previous" ? "bg-main" : "bg-[#e9cfff]"} p-4 rounded-lg mx-1`}>
                                <Text className={`${currFilter === "Previous" ? "text-white" : ""}`}>Previous</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setCurrFilter("Future")} className={`${currFilter === "Future" ? "bg-main" : "bg-[#e9cfff]"} p-4 rounded-lg mx-1`}>
                                <Text className={`${currFilter === "Future" ? "text-white" : ""}`}>Future</Text>
                            </TouchableOpacity>
                        </View>
                        {currFilter === "Week" && (
                            <ScrollView className="h-full w-full" >
                                <Text className="font-medium text-xl px-4 pt-4">This Week's Progress</Text>
                                {!thisWeekPlan && (
                                    <View className='w-full h-80 justify-center items-center'>
                                        <Text className='font-medium mb-4'>Let's set your plan first</Text>
                                        <TouchableOpacity className='bg-main py-4 pr-6 pl-4 rounded-lg flex-row justify-center items-center' onPress={() => handlePresentModalPress()} >
                                            <Entypo name="plus" size={16} color="white" />
                                            <Text className='text-white font-medium ml-1'>Plan</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {thisWeekPlan && (
                                    <WeeklyCommitmentsDisplay weekPlanData={thisWeekPlan} personal />
                                )}

                                {!!workouts?.length && thisWeekPlan && (
                                    <View>
                                        <Text className="font-medium text-xl p-4">Individual Commitments</Text>
                                    </View>
                                )}
                                {thisWeekPlan && workouts
                                    .filter(commitment => thisWeekPlan.commitments.includes(commitment.id))
                                    .sort((a, b) => b.startDate.toDate().getTime() - a.startDate.toDate().getTime())
                                    .map(item => (
                                        <View className="px-4" key={`${item.id}`}>
                                            <PersonalCommitmentCard item={item} onPress={() => {
                                                router.push({
                                                    pathname: `/commitment/[commitmentId]`,
                                                    params: {
                                                        commitmentId: item.id
                                                    }
                                                })
                                            }} />
                                        </View>
                                    ))}
                                <View className="w-full h-40" />
                            </ScrollView>
                        )}

                        {currFilter === "Previous" && (
                            <ScrollView className="h-full w-full" >
                                {/* <View className=" flex-row justify-evenly items-center w-full px-4 mt-6">
                                    <View className="flex-row items-center">
                                        <FontAwesome5 name="running" size={28} color="black" />
                                        <Text className="w-fit text-3xl font-medium ml-2">{workouts?.filter(c => c.startDate.toDate() < new Date() && c.status === "complete").length}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <MaterialCommunityIcons name="emoticon-sick-outline" size={28} color="black" />
                                        <Text className="w-fit text-3xl font-medium ml-2">{workouts?.filter(c => c.startDate.toDate() < new Date() && c.status === "failure").length}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <FontAwesome name="clock-o" size={28} color="black" />
                                        <Text className="w-fit text-3xl font-medium ml-2">{workouts?.filter(c => c.startDate.toDate() < new Date() && c.status === "NA").length}</Text>
                                    </View>
                                </View> */}
                                {weekPlans
                                    .filter(plan => {
                                        const [year, month, day] = plan.end.split("/");
                                        const today = new Date();
                                        return new Date(Number(year), Number(month) - 1, Number(day)) < today
                                    }).length === 0 && (
                                    <View className='w-full h-80 justify-center items-center'>
                                        <Text className='font-medium mb-4'>No history yet!</Text>
                                    </View>
                                )}
                                {weekPlans
                                    .filter(plan => {
                                        const [year, month, day] = plan.end.split("/");
                                        const today = new Date();
                                        return new Date(Number(year), Number(month) - 1, Number(day)) < today
                                    })
                                    .sort((a, b) => {
                                        const [yearA, monthA, dayA] = a.start.split("/")
                                        const [yearB, monthB, dayB] = b.start.split("/")
                                        return new Date(Number(yearB), Number(monthB), Number(dayB)).getTime() - new Date(Number(yearA), Number(monthA), Number(dayA)).getTime()
                                    }).map(plan => (
                                        <WeeklyCommitmentsDisplay key={plan.id} weekPlanData={plan} personal />
                                    ))}
                                <View className="w-full h-40" />
                            </ScrollView>
                        )}

                        {currFilter === "Future" && (
                            <ScrollView className="h-full w-full" >
                                {weekPlans
                                    .filter(plan => {
                                        const [year, month, day] = plan.start.split("/");
                                        const today = new Date();
                                        return new Date(Number(year), Number(month) - 1, Number(day)) > today
                                    }).length === 0 && (
                                    <View className='w-full h-80 justify-center items-center'>
                                        <Text className='font-medium mb-4'>No plans set, get ahead of it</Text>
                                        <TouchableOpacity className='bg-main py-4 pr-6 pl-4 rounded-lg flex-row justify-center items-center' onPress={() => handlePresentModalPress()} >
                                            <Entypo name="plus" size={16} color="white" />
                                            <Text className='text-white font-medium ml-1'>Plan</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                {weekPlans
                                    .filter(plan => {
                                        const [year, month, day] = plan.start.split("/");
                                        const today = new Date();
                                        return new Date(Number(year), Number(month) - 1, Number(day)) > today
                                    })
                                    .sort((a, b) => {
                                        const [yearA, monthA, dayA] = a.start.split("/")
                                        const [yearB, monthB, dayB] = b.start.split("/")
                                        return new Date(Number(yearA), Number(monthA), Number(dayA)).getTime() - new Date(Number(yearB), Number(monthB), Number(dayB)).getTime()
                                    }).map(plan => (
                                        <WeeklyCommitmentsDisplay key={plan.id} weekPlanData={plan} personal />
                                    ))}
                                <View className="w-full h-40" />
                            </ScrollView>
                        )}

                    </View>
                </View>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={test}
                    snapPoints={["100%"]}
                    enablePanDownToClose={!lockPage}
                    backdropComponent={props => (<BottomSheetBackdrop {...props}
                        opacity={0.5}
                        enableTouchThrough={false}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        style={[{ backgroundColor: 'rgba(0, 0, 0, 1)' }, StyleSheet.absoluteFillObject]} />)}
                    onChange={(index) => {
                        if (index === -1) {
                            Keyboard.dismiss()
                            setLockPage(false)
                        }
                    }}
                >
                    {/* <AddWorkoutModal onClose={() => handleClosePress()} /> */}
                    <AddWeeklyCommitmentsModal onClose={() => handleClosePress()} />
                </BottomSheetModal>

            </SafeAreaView>
            <BottomSheetModal
                ref={notificationModalRef}
                index={second}
                snapPoints={["100%"]}
                // enablePanDownToClose
                backdropComponent={props => (<BottomSheetBackdrop {...props}
                    opacity={0.5}
                    enableTouchThrough={false}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    style={[{ backgroundColor: 'rgba(0, 0, 0, 1)' }, StyleSheet.absoluteFillObject]} />)}
            >
                <NotificationsModal onClose={handleCloseNotifications} />
            </BottomSheetModal>
        </LinearGradient >
    )
}

export default WorkoutsPage;