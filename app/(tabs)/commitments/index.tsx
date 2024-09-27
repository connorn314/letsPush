import { lockPageOnCarousel, myWeekPlansState, myWorkoutsState } from "@/storage/atomStorage";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationsModal from "@/components/notificationsModal";
import AddWorkoutModal from "@/components/addWorkout";
import { Keyboard, StyleSheet, TouchableOpacity, View, Text, ScrollView } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import PersonalCommitmentCard from "@/components/personalCommitmentCard";
import { useRouter } from "expo-router";
import AddWeeklyCommitmentsModal from "@/components/addWeeklyCommitments";
import WeeklyCommitmentsDisplay from "@/components/weeklyCommitmentsCard";

const WorkoutsPage = () => {

    // const [user,] = useAtom(userState);
    const [workouts,] = useAtom(myWorkoutsState);
    const [weekPlans, ] = useAtom(myWeekPlansState);

    const [lockPage, setLockPage] = useAtom(lockPageOnCarousel);
    // const [loading, setLoading] = useState(false);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const notificationModalRef = useRef<BottomSheetModal>(null);

    const router = useRouter();
    
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
        setSecond(0)
        notificationModalRef.current?.present()
    }, [])

    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#ffffff', '#ffffff', '#ffffff']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
        >
            <SafeAreaView className={` transition-all duration-200 relative`}>
                <View className='w-screen h-full justify-start items-center'>
                    <View className=' w-full flex-row justify-center items-center'>
                        <TouchableOpacity onPress={() => handlePresentModalPress()} className='p-4  bg-white rounded-full absolute top-2 left-4'>
                            <Entypo name="plus" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-lg text-black font-medium pt-6 pb-4">Workouts</Text>

                        <TouchableOpacity onPress={handlePresentNotifications} className='p-4  bg-white rounded-full absolute top-2 right-4'>
                            <FontAwesome5 name="bell" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View className="w-full">

                        <ScrollView className="h-full w-full" >
                            {weekPlans.map(plan => (
                                <WeeklyCommitmentsDisplay key={plan.id} weekPlanData={plan} personal/>
                            ))}

                            {!!workouts?.length && (
                                <View>
                                    <Text className="font-medium text-xl p-4">Individual Commitments</Text>
                                </View>
                            )}
                            {workouts.sort((a, b) => b.startDate.toDate().getTime() - a.startDate.toDate().getTime()).map(item => (
                                <View className="px-4" key={`${item.id}`}>
                                    <PersonalCommitmentCard  item={item} onPress={() => {
                                        router.push({
                                            pathname: `/commitment/[commitmentId]`,
                                            params: {
                                                commitmentId: item.id
                                            }
                                        })
                                    }} />
                                </View>
                            ))}
                        </ScrollView>

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
                <NotificationsModal />
            </BottomSheetModal>
        </LinearGradient >
    )
}

export default WorkoutsPage;