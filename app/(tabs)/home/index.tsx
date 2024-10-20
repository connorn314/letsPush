// import { collection, onSnapshot } from "firebase/firestore";
import { View, Text, TouchableOpacity, Keyboard, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAtom } from "jotai";
import { signOut } from "firebase/auth";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Svg, { G, Rect, Path } from "react-native-svg"
import { stravaAuthLoadingState, userState, friendWeekPlansState, myFriends, friendCommitmentsLoadingState, friendWeekPlansLoadingState, hasBadgeNotificationsState, expandFriendReminderSection, tourGuideState } from '@/storage/atomStorage';
import useAuth from '@/storage/useAuth';
import { FIREBASE_AUTH } from '@/firebaseConfig';
import WeeklyCalendarDisplay from '@/components/weeklyDisplay';
import SpinLoader from '@/components/spinLoader';
import NotificationsModal from '@/components/notificationsModal';
// import { useRouter } from 'expo-router';
import WeeklyCommitmentsDisplay from '@/components/weeklyCommitmentsCard';
import { User } from '@/types/user';
import * as Notifications from 'expo-notifications';
import RemindFriendSection from '@/components/remindFriendSection';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import HomeTourGuideView from '@/components/homeTourGuide';

const HomeScreen = () => {

    const { performOAuth, stravaRemoveAuthentication } = useAuth();

    const router = useRouter();

    const [user,] = useAtom(userState);
    const [friends,] = useAtom(myFriends);
    const [friendWeekPlans,] = useAtom(friendWeekPlansState);
    const [stravaAuthLoading,] = useAtom(stravaAuthLoadingState);
    const [friendCommitmentsLoading] = useAtom(friendCommitmentsLoadingState);
    const [friendWeekPlansLoading] = useAtom(friendWeekPlansLoadingState);
    const [hasBadgeNotifications, setHasBadgeNotifications] = useAtom(hasBadgeNotificationsState);
    const [tourGuide, setTourGuide] = useAtom(tourGuideState);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const notificationModalRef = useRef<BottomSheetModal>(null);

    const [friendsWithoutPlans, setFriendsWithoutPlans] = useState<User[]>([]);
    const [test, setTest] = useState(-1);
    const [second, setSecond] = useState(-1);

    const handlePresentModalPress = useCallback(() => {
        setTest(0)
        bottomSheetModalRef.current?.present()
    }, []);

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

    const handleSignOut = async () => {
        try {
            handleClosePress()
            await signOut(FIREBASE_AUTH);
            // setUser(null);
        } catch (err: any) {
            alert(err.message)
        }
    };

    useEffect(() => {
        if (friendWeekPlans && friends) {
            setFriendsWithoutPlans(friends.filter(friend => friendWeekPlans.every(plan => plan.userId !== friend.id)));
        }
    }, [friendWeekPlans, friends])

    useEffect(() => {
        Notifications.getBadgeCountAsync().then((val) => {
            setHasBadgeNotifications(val !== 0)
        }).catch(err => console.log("err getting badge count: " + JSON.stringify(err)))
    }, []);

    return (
        <LinearGradient
            // Background Linear Gradient
            colors={['#f0f0f0', '#ffffff', '#f0f0f0']}
            end={{ x: 0.1, y: 0.1 }}
            start={{ x: 0.9, y: 1 }}
            style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 }}
        >
            {tourGuide && <HomeTourGuideView />}
            <SafeAreaView className='w-screen relative'>

                <View className="items-center justify-start w-screen h-full " >
                    <View className='w-full flex-row justify-center items-center'>
                        <TouchableOpacity onPress={() => handlePresentModalPress()} className='p-4  rounded-full absolute top-2 left-4 '>
                            <Feather name="settings" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-lg text-black font-medium pt-6 pb-4">Home</Text>

                        <View className='flex-row justify-center items-center absolute top-2 right-4 '>
                            <TouchableOpacity onPress={() => setTourGuide(true)} className='p-4  rounded-full mr-2 '>
                                <FontAwesome5 name="question-circle" size={24} color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePresentNotifications} className='p-4  rounded-full '>
                                <View className="relative">
                                    <FontAwesome5 name="bell" size={24} color="black" />
                                    {hasBadgeNotifications && <View className="h-3 w-3 bg-red-500 rounded-full border-[#f0f0f0] border-2 absolute top-0 right-0" />}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View className="w-full ">
                        <ScrollView className="h-full">
                            <WeeklyCalendarDisplay />
                            <View className='w-full'>
                                <Text className="font-medium text-xl p-4">My Friends</Text>
                                {friends?.length > 0 ? (<View>
                                    {friendWeekPlans.length ? friendWeekPlans.map(week => (
                                        <WeeklyCommitmentsDisplay weekPlanData={week} key={week.id} />
                                    )) : (
                                        <View className='p-4 h-20 flex-row items-center justify-center w-full'>
                                            {(friendCommitmentsLoading || friendWeekPlansLoading) ? (
                                                <SpinLoader color='black' />
                                            ) : (
                                                <Text>You have no friends with commitments this week.</Text>
                                            )}
                                        </View>
                                    )}
                                </View>
                                ) : (
                                    <View className='w-full h-40 justify-center items-center'>
                                        <Text className='font-medium mb-4'>Let's get you some friends first</Text>
                                        <TouchableOpacity className='bg-main py-4 pr-6 pl-4 rounded-lg flex-row justify-center items-center' onPress={() => router.push("/(tabs)/friends")} >
                                            <Entypo name="plus" size={16} color="white" />
                                            <Text className='text-white font-medium ml-1'>Friends</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            <View className='p-4 '>
                                <Text className="font-medium text-xl pb-4">Friends Needing Reminders</Text>
                                {!!friendsWithoutPlans.length ? friendsWithoutPlans.map((friend) => (
                                    <RemindFriendSection friend={friend} key={friend.id} />
                                )) : (
                                    <View className='p-4 h-20 flex-row items-center justify-center w-full'>
                                        <Text>No friends needing reminders... Yet.</Text>
                                    </View>
                                )}

                            </View>
                            <View className='w-full h-40' />
                        </ScrollView>

                    </View>

                </View>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={test}
                    snapPoints={["35%"]}
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
                    <View className='h-[90%] justify-between items-center space-y-2 p-4'>
                        {(user?.strava?.expires_at && (user?.strava?.expires_at > (Date.now() / 1000))) ? (
                            <TouchableOpacity className={` bg-[#FC4C02] h-[56px] rounded mb-2 w-full items-center justify-center `} onPress={stravaRemoveAuthentication}>
                                {stravaAuthLoading ? (
                                    <View className='p-2'>
                                        <SpinLoader color='white' size={20} />
                                    </View>
                                ) : (
                                    <Text className={`text-white text-md font-semibold p-4 rounded-lg`}>Un-sync Strava</Text>
                                )}
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity className={` bg-[#FC4C02] h-[56px] rounded py-1  w-full items-center justify-center`} onPress={performOAuth}>
                                {stravaAuthLoading ? (
                                    <View className='p-2'>
                                        <SpinLoader color='white' size={20} />
                                    </View>
                                ) : (
                                    <SvgComponent />
                                )}
                            </TouchableOpacity>
                        )}
                        {/* <TouchableOpacity className={` bg-white  w-full items-center justify-center`} onPress={}>
                                <Text className={`text-main text-xl p-3 rounded-lg`}>set sub</Text>
                            </TouchableOpacity> */}
                        {(user?.strava?.expires_at && (user?.strava?.expires_at > (Date.now() / 1000))) && (
                            <View className='w-full items-center justify-center'>
                                <Text className='text-md font-medium'>Strava Id: {user.strava_athlete_id}</Text>
                            </View>
                        )}
                        <View className="w-full justify-center items-center">
                            <Text className='font-medium'>{user?.email}</Text>
                            <TouchableOpacity className="bg-white h-12 items-center justify-center" onPress={handleSignOut}>
                                <Text className="text-main font-medium text-xl p-3 rounded-lg">Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BottomSheetModal>
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
                // onChange={(index) => {
                //     if (index === -1) { Keyboard.dismiss() }
                // }}
                >
                    <NotificationsModal onClose={handleCloseNotifications} />
                </BottomSheetModal>
            </SafeAreaView>
        </LinearGradient>
    )
}

export default HomeScreen;


/* SVGR has dropped some elements not supported by react-native-svg: title */
export const SvgComponent = (props: any) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={193} height={48} {...props}>
        <G fill="none" fillRule="evenodd">
            <Rect width={185} height={40} x={4} y={4} fill="#FC4C02" rx={2} />
            <Path
                fill="#FFF"
                d="m27 25.164 1.736.35c-.112 1.101-.513 1.993-1.204 2.674-.69.681-1.582 1.022-2.674 1.022-1.241 0-2.256-.434-3.045-1.302-.789-.868-1.183-2.165-1.183-3.892 0-1.605.413-2.844 1.239-3.717.826-.873 1.818-1.309 2.975-1.309 1.017 0 1.876.32 2.576.959.7.64 1.11 1.482 1.232 2.527l-1.708.266c-.243-1.484-.938-2.226-2.086-2.226-.719 0-1.318.29-1.799.868-.48.579-.721 1.465-.721 2.66 0 1.223.236 2.135.707 2.737.471.602 1.076.903 1.813.903 1.223 0 1.937-.84 2.142-2.52Zm6.519 2.604c.55 0 .996-.217 1.337-.651.34-.434.51-1.043.51-1.827s-.17-1.393-.51-1.827a1.62 1.62 0 0 0-1.337-.651c-.56 0-1.01.215-1.351.644-.34.43-.511 1.04-.511 1.834 0 .803.17 1.416.51 1.841.341.425.792.637 1.352.637Zm0 1.442c-.999 0-1.823-.345-2.471-1.036-.649-.69-.973-1.652-.973-2.884 0-1.213.333-2.17 1-2.87.668-.7 1.482-1.05 2.444-1.05.961 0 1.77.35 2.429 1.05.658.7.987 1.657.987 2.87 0 1.232-.32 2.193-.96 2.884-.639.69-1.458 1.036-2.456 1.036Zm5.245-.21v-7.42h1.54v.714h.027c.206-.261.49-.48.854-.658a2.589 2.589 0 0 1 1.148-.266c.822 0 1.468.245 1.94.735.47.49.706 1.169.706 2.037V29h-1.581v-4.438c0-1.148-.481-1.722-1.443-1.722-.485 0-.872.14-1.161.42-.29.28-.434.658-.434 1.134V29h-1.596Zm8.464 0v-7.42h1.54v.714h.028c.206-.261.49-.48.854-.658a2.589 2.589 0 0 1 1.148-.266c.822 0 1.468.245 1.94.735.47.49.706 1.169.706 2.037V29h-1.582v-4.438c0-1.148-.48-1.722-1.442-1.722-.485 0-.872.14-1.162.42-.29.28-.434.658-.434 1.134V29h-1.596Zm13.393-2.464 1.148.938c-.719 1.157-1.745 1.736-3.08 1.736-1.027 0-1.864-.357-2.513-1.071-.649-.714-.973-1.664-.973-2.849 0-1.185.322-2.135.966-2.849.644-.714 1.46-1.071 2.45-1.071.99 0 1.799.355 2.429 1.064.63.71.945 1.661.945 2.856v.476h-5.18c.019.616.189 1.108.511 1.477s.768.553 1.337.553c.27 0 .513-.037.728-.112.215-.075.404-.187.567-.336.163-.15.287-.28.371-.392.084-.112.182-.252.294-.42Zm-3.794-1.974h3.612c-.028-.523-.196-.95-.504-1.281-.308-.331-.747-.497-1.316-.497-.532 0-.957.177-1.274.532-.317.355-.49.77-.518 1.246Zm11.503 1.484 1.582.336c-.15.896-.49 1.591-1.022 2.086-.532.495-1.237.742-2.114.742-1.008 0-1.834-.345-2.478-1.036-.644-.69-.966-1.652-.966-2.884 0-1.185.324-2.135.973-2.849.648-.714 1.467-1.071 2.457-1.071.85 0 1.55.254 2.1.763s.872 1.169.966 1.981l-1.498.252c-.159-1.036-.677-1.554-1.554-1.554-.57 0-1.022.217-1.358.651-.336.434-.504 1.043-.504 1.827s.163 1.393.49 1.827c.326.434.784.651 1.372.651.868 0 1.386-.574 1.554-1.722Zm3.69.476v-3.57H70.9V21.58h1.162v-1.82h1.513v1.82h1.861v1.372h-1.848v3.402c0 .41.063.698.19.861.126.163.384.245.776.245h.588V29h-.713c-.897 0-1.522-.198-1.877-.595-.354-.397-.532-1.024-.532-1.883ZM81.992 29l-1.638-7.42h1.568l1.05 5.166H83l1.764-5.166h1.442l1.652 5.152h.028l1.19-5.152h1.54L88.838 29h-1.54l-1.806-5.572h-.028L83.518 29h-1.526Zm10.41 0v-7.42H94V29h-1.596Zm-.027-8.638V18.78h1.652v1.582h-1.652Zm4.32 6.16v-3.57h-1.12V21.58h1.162v-1.82h1.513v1.82h1.862v1.372h-1.849v3.402c0 .41.063.698.19.861.126.163.384.245.776.245h.588V29h-.713c-.897 0-1.522-.198-1.876-.595-.355-.397-.532-1.024-.532-1.883ZM101.87 29V18.78h1.596v3.528h.028c.168-.252.444-.471.826-.658.383-.187.77-.28 1.162-.28.794 0 1.438.243 1.932.728.495.485.742 1.148.742 1.988V29h-1.582v-4.536c0-.485-.13-.877-.392-1.176-.261-.299-.64-.448-1.134-.448-.476 0-.858.14-1.148.42-.29.28-.434.64-.434 1.078V29h-1.596ZM160.016 18.724l-2.442 4.97-2.444-4.97h-3.591L157.574 31l6.03-12.276h-3.588Zm-19.849 4.34c0-.374-.129-.653-.385-.833-.255-.181-.603-.272-1.04-.272h-1.634v2.261h1.618c.449 0 .801-.1 1.056-.297.256-.199.385-.475.385-.826v-.034ZM149.175 18l6.034 12.276h-3.592l-2.442-4.97-2.44 4.97h-6.712l-2.115-3.3h-.8v3.3h-3.747V18.724h5.477c1.004 0 1.828.119 2.474.355.647.237 1.166.56 1.561.966.342.351.598.748.77 1.187.17.44.256.959.256 1.55v.035c0 .847-.198 1.562-.594 2.145-.394.583-.933 1.046-1.617 1.386l1.947 2.93L149.175 18Zm16.792 0-6.032 12.276h3.591l2.44-4.97 2.444 4.97H172L165.967 18Zm-43.48 3.99h3.3v8.286h3.747V21.99h3.3v-3.266h-10.346v3.266Zm-.134 3.07c.229.408.344.904.344 1.486v.033c0 .605-.117 1.15-.353 1.634a3.472 3.472 0 0 1-.993 1.23c-.427.335-.946.593-1.554.775-.607.183-1.292.274-2.049.274-1.141 0-2.207-.164-3.195-.487-.987-.326-1.838-.813-2.553-1.46l2.001-2.458a5.9 5.9 0 0 0 1.921 1.038c.673.21 1.34.314 2.002.314.343 0 .587-.044.737-.131.15-.089.224-.21.224-.363v-.033c0-.167-.11-.306-.328-.414-.218-.11-.628-.225-1.226-.345a20.64 20.64 0 0 1-1.8-.464 6.1 6.1 0 0 1-1.505-.676 3.215 3.215 0 0 1-1.034-1.04c-.256-.419-.384-.93-.384-1.535v-.033c0-.551.104-1.063.312-1.536.207-.473.512-.886.912-1.237.4-.352.898-.627 1.491-.826.59-.198 1.272-.297 2.041-.297 1.088 0 2.04.132 2.858.397.816.262 1.55.659 2.202 1.187l-1.825 2.608a5.55 5.55 0 0 0-1.69-.868 5.717 5.717 0 0 0-1.673-.273c-.277 0-.483.044-.616.133a.395.395 0 0 0-.2.346v.033c0 .155.1.287.304.398.203.11.598.225 1.184.346.716.131 1.366.291 1.955.477.586.19 1.092.427 1.512.72.422.291.749.64.978 1.048Z"
            />
        </G>
    </Svg>
)
