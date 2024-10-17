import { expandFriendReminderSection, userState } from "@/storage/atomStorage";
import { User } from "@/types/user"
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard } from 'react-native';
import SpinLoader from '@/components/spinLoader';
import { getFunctions, httpsCallable } from 'firebase/functions';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import DismissKeyboard from "./dismissKeyboard";

const functions = getFunctions();
const sendReminderToFriend = httpsCallable(functions, 'sendReminderToFriend');

const RemindFriendSection = ({ friend }: { friend: User }) => {

    const [user, setUser] = useAtom(userState)
    const [expandReminder, setExpandReminder] = useAtom(expandFriendReminderSection);

    const [loading, setLoading] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [test, setTest] = useState(-1);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    // const notificationMessage = useRef("");

    // const sectionHeight = useSharedValue(80);
    // const inputHeight = useSharedValue(0);

    // const animatedStyle = useAnimatedStyle(() => ({
    //     height: sectionHeight.value, // Dynamically change height
    // }));

    // const animatedInputStyle = useAnimatedStyle(() => ({
    //     height: inputHeight.value, // Dynamically change height
    // }));

    useEffect(() => {
        if (expandReminder === friend.id) {
            // if (expandReminder === friend.id && sectionHeight.value < 200) {
            // sectionHeight.value = withTiming(200, { duration: 500, easing: Easing.elastic(1) });
            // inputHeight.value = withTiming(100, { duration: 200, easing: Easing.linear });
            handlePresentModalPress()
        } else if (expandReminder !== friend.id) {
            // } else if (!(expandReminder === friend.id) && sectionHeight.value > 80) {
            // sectionHeight.value = withTiming(80, { duration: 500, easing: Easing.elastic(1) });
            // inputHeight.value = withTiming(0, { duration: 100, easing: Easing.linear });
            handleClosePress()
        }
    }, [expandReminder]);

    const handleTextChange = (newText: string) => {
        // console.log("Hi", newText)
        // notificationMessage.current = newText
        if (newText.length < 61) {
            setNotificationMessage(newText)
        }
    };

    const handlePresentModalPress = useCallback(() => {
        setTest(0)
        bottomSheetModalRef.current?.present()
    }, []);


    const handleClosePress = () => {
        setTest(-1)
        bottomSheetModalRef?.current?.close()
    }

    const sendReminder = async () => {
        setLoading(true)
        try {
            await sendReminderToFriend({ to: friend.id, notiMessage: notificationMessage });
            setUser({
                ...user,
                reminders_sent: (user.reminders_sent ?? []).concat([friend.id])
            })
        } catch (err) {
            alert("Error sending reminder: " + JSON.stringify(err))
        } finally {
            setLoading(false)
            setExpandReminder(null)
        }
    }

    return (
        <View id={friend.id} className={`${expandReminder === friend.id && "z-40 "} items-center rounded-lg bg-white shadow-sm my-1 justify-start w-full`}>
            <View className={"flex-row w-full justify-between items-center p-4 "}>
                <View className='flex-row justify-center items-center'>
                    {/* <View className={`rounded-full justify-center items-center h-12 w-12 bg-main`}>
                        <Text className={`text-xl font-medium text-center text-white `}>{`${friend?.name[0]?.toLocaleUpperCase() ?? "N"}`}</Text>
                    </View> */}
                    <View className=''>
                        <Text className="font-medium text-lg">{friend.name}</Text>
                    </View>
                </View>
                <View className="flex flex-row justify-center items-center">
                    {expandReminder === friend.id && (
                        <TouchableOpacity className=' h-10 w-20 justify-center items-center'
                            onPress={() => setExpandReminder(expandReminder === friend.id ? null : friend.id)}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    )}
                    {(user?.reminders_sent && user.reminders_sent.includes(friend.id)) ? (
                        <TouchableOpacity className='bg-gray-200 h-10 w-20 justify-center items-center rounded-lg'>
                            <Text className=''>Reminded</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity className='bg-main h-10 w-20 justify-center items-center rounded-lg'
                            onPress={() => setExpandReminder(expandReminder === friend.id ? null : friend.id)}>
                            {loading ? (
                                <SpinLoader size={18} />
                            ) : (
                                <Text className='text-white'>{expandReminder === friend.id ? "Send" : "Remind"}</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* <Animated.View className="w-full px-4 relative overflow-hidden" style={[animatedInputStyle]}>
                <TextInput
                    multiline
                    placeholder="Make a plan..."
                    className=" border border-gray-200 bg-white rounded-lg h-full"
                    style={{ padding: 16 }}
                    placeholderTextColor={"gray"}
                    numberOfLines={4}
                    value={notificationMessage}
                    onChangeText={(text) => setNotificationMessage(text)} />
                <View className="absolute right-8 bottom-2">
                    <Text>{notificationMessage.length}/150</Text>
                </View>
            </Animated.View> */}
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={test}
                snapPoints={[600]}
                enablePanDownToClose
                backdropComponent={props => (<BottomSheetBackdrop {...props}
                    opacity={0.5}
                    enableTouchThrough={false}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    style={[{ backgroundColor: 'rgba(0, 0, 0, 1)' }, StyleSheet.absoluteFillObject]} />)}
                onChange={(index) => {
                    if (index === -1) {
                        Keyboard.dismiss()
                        setExpandReminder(null)
                    }
                }}
            >
                {/* <AddWorkoutModal onClose={() => handleClosePress()} /> */}
                <DismissKeyboard >
                    <View className="h-full">

                        <View className="px-4 pb-4">
                            <Text className="font-medium">To: {friend.name}</Text>
                        </View>
                        <View className="w-full px-4 relative " >
                            <TextInput
                                placeholder="Make a plan..."
                                className=" border border-gray-200 bg-white rounded-lg "
                                aria-disabled={notificationMessage.length > 59}
                                style={{ padding: 16, paddingBottom: 28 }}
                                placeholderTextColor={"gray"}
                                value={notificationMessage.slice(0, 60)}
                                onChangeText={handleTextChange} />
                            <View className={`absolute right-8 bottom-2 `}>
                                <Text className={`${notificationMessage.length === 60 && "text-red-600"}`}>{notificationMessage.length}/60</Text>
                            </View>
                        </View>
                        <View className="flex flex-row justify-end items-center mt-4 w-full pr-4">
                            <TouchableOpacity className=' h-10 w-20 justify-center items-center'
                                onPress={() => setExpandReminder(expandReminder === friend.id ? null : friend.id)}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className='bg-main h-10 w-20 justify-center items-center rounded-lg'
                                onPress={() => sendReminder()}>
                                {loading ? (
                                    <SpinLoader size={18} />
                                ) : (
                                    <Text className='text-white'>Send</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                        <View></View>
                    </View>
                </DismissKeyboard>

            </BottomSheetModal>
        </View>
    )
}

export default RemindFriendSection;