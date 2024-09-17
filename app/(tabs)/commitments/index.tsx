import { myWorkoutsState } from "@/storage/atomStorage";
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

const WorkoutsPage = () => {

    // const [user,] = useAtom(userState);
    const [workouts,] = useAtom(myWorkoutsState);
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
                    <View className="w-full px-4">

                        <ScrollView className="h-full" >
                            {workouts.sort((a, b) => a.startDate.toDate().getTime() - b.startDate.toDate().getTime()).map(item => (
                                <PersonalCommitmentCard key={`${item.id}`} item={item} onPress={() => {
                                    router.push({
                                        pathname: `/commitment/[commitmentId]`,
                                        params: {
                                            commitmentId: item.id
                                        }
                                    })
                                }} />
                            ))}
                        </ScrollView>

                    </View>
                </View>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={test}
                    snapPoints={["100%"]}
                    // enablePanDownToClose
                    backdropComponent={props => (<BottomSheetBackdrop {...props}
                        opacity={0.5}
                        enableTouchThrough={false}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        style={[{ backgroundColor: 'rgba(0, 0, 0, 1)' }, StyleSheet.absoluteFillObject]} />)}
                    onChange={(index) => {
                        if (index === -1) { Keyboard.dismiss() }
                    }}
                >
                    <AddWorkoutModal onClose={() => handleClosePress()} />
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