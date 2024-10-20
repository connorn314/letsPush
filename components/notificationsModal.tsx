import { myPushNotificationsState, userState } from '@/storage/atomStorage';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAtom } from "jotai";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import Fontisto from '@expo/vector-icons/Fontisto';
import { updateDoc, doc } from 'firebase/firestore';
import { FIRESTORE_DB } from '@/firebaseConfig';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import SpinLoader from './spinLoader';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { timeAgoString } from '@/util/helpers';

const functions = getFunctions();
const respondToFriendRequest = httpsCallable(functions, 'respondToFriendRequest');

const NotificationsModal = ({ onClose }: { onClose: () => void }) => {

    const router = useRouter();
    const [user, setUser] = useAtom(userState);
    const [myPushNotifications,] = useAtom(myPushNotificationsState);
    const [updatingRequest, setUpdatingRequest] = useState<undefined | { accept: boolean; id: string; }>(undefined);

    const viewNotification = async (pushId: string) => {
        await updateDoc(doc(FIRESTORE_DB, `push_notifications`, pushId), {
            viewed: true
        })
    }

    const answerRequest = async (props: { accept: boolean; to: string; pushId: string }) => {
        // console.log("accept: ", accept)
        setUpdatingRequest({ accept: props.accept, id: props.pushId})
        try {
            await respondToFriendRequest(props);
            setUser({
                ...user,
                friend_requests_recieved: (user.friend_requests_recieved ?? []).filter((userId: string) => userId !== props.to),
                friends: (user.friends ?? []).concat([props.to])
            })
            viewNotification(props.pushId)
        } catch (err) {
            alert("Error sending request: " + JSON.stringify(err))
        } finally {
            setUpdatingRequest(undefined)
        }
    }

    return (
        <View className='h-full w-screen items-center justify-center'>
            <SafeAreaView className='w-full h-full'>
                <View className='w-full h-full overflow-y-scroll items-center justify-start'>
                    <View className='w-full flex-row items-center justify-start p-4'>
                        <TouchableOpacity onPress={onClose}>
                            <Fontisto name="close-a" size={14} color="black" />
                        </TouchableOpacity>

                        <View className='w-full flex-row justify-start px-4'>
                            <Text className='font-medium text-xl '>What you missed</Text>
                        </View>
                    </View>
                    <ScrollView className='w-screen'>
                        {!!myPushNotifications.length &&
                            myPushNotifications
                                .sort((a, b) => b.created_at.toDate().getTime() - a.created_at.toDate().getTime())
                                .map(push => push.friend_request ? (
                                    <View key={push.id} className={`${!push.viewed && "bg-blue-100"} w-full p-4 border-b-gray-200 border-b-[0.5px]  flex-row justify-between items-center`}>
                                        <View className={`flex-col justify-start ${push.friend_request && "max-w-[60%]"} max-w-[60%]`}>
                                            <Text className='font-medium mb-2'>{push.content.title}</Text>
                                            <Text className='mb-2'>{push.content.body}</Text>
                                            <Text className='text-gray-400'>{timeAgoString(push.created_at.toDate())}</Text>
                                        </View>
                                        {(user.friends ?? []).includes(push.friend_request.from) ? (
                                            <View className='flex-row justify-center items-center'>
                                                <Text>Accepted</Text>
                                            </View>
                                        ) : (
                                            <View className='flex-row justify-center items-center pl-4'>
                                                {!(updatingRequest?.id === push.id && !updatingRequest?.accept) && (<TouchableOpacity className='w-12 h-10 rounded-lg mr-2 bg-main items-center justify-center'
                                                    onPress={() => answerRequest({ accept: true, to: push.friend_request?.from || "none", pushId: push.id })}>
                                                    {(updatingRequest?.id === push.id && updatingRequest?.accept) ? (
                                                        <SpinLoader color='white' size={20} />
                                                    ) : (
                                                        <MaterialCommunityIcons name="account-check-outline" size={24} color="white" />
                                                    )}
                                                </TouchableOpacity>)}
                                                {!(updatingRequest?.id === push.id && updatingRequest?.accept) && (
                                                <TouchableOpacity className='w-12 h-10 rounded-lg bg-gray-200 items-center justify-center'
                                                    onPress={() => answerRequest({ accept: false, to: push.friend_request?.from || "none", pushId: push.id })}>
                                                    {(updatingRequest?.id === push.id && !updatingRequest?.accept) ? (
                                                        <SpinLoader size={20} />
                                                    ) : (
                                                        <Fontisto name="close-a" size={14} color="black" />
                                                    )}
                                                </TouchableOpacity>
                                                )}
                                            </View>)}
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={() => {
                                        const goTo = push.content.data?.url
                                        if (goTo) {
                                            // console.log(goTo.slice(14))
                                            onClose()
                                            viewNotification(push.id);
                                            setTimeout(() => router.push(`${goTo}` as Href<string>), 100)
                                        }
                                    }} key={push.id} className={`${!push.viewed && "bg-blue-100"} w-full  p-4 border-b-gray-200 border-b-[0.5px] flex-col justify-start `}>
                                        <Text className='font-medium mb-2'>{push.content.title}</Text>
                                        <Text className='mb-2'>{push.content.body}</Text>
                                        <Text className='text-gray-400'>{push.created_at.toDate().toLocaleString()}</Text>
                                    </TouchableOpacity>
                                ))}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default NotificationsModal;