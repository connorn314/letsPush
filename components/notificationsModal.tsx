import { myPushNotificationsState } from '@/storage/atomStorage';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAtom } from "jotai";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import Fontisto from '@expo/vector-icons/Fontisto';

const NotificationsModal = ({ onClose }: { onClose: () => void }) => {

    const router = useRouter();
    const [myPushNotifications,] = useAtom(myPushNotificationsState);

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
                    {!!myPushNotifications.length &&
                        myPushNotifications
                            .sort((a, b) => b.created_at.toDate().getTime() - a.created_at.toDate().getTime())
                            .map(push => (
                                <TouchableOpacity onPress={() => {
                                    const goTo = push.content.data?.url
                                    if (goTo) {
                                        // console.log(goTo.slice(14))
                                        onClose()
                                        setTimeout(() => router.push(`${goTo}` as Href<string>), 100)
                                    }
                                }} key={push.id} className={`${!push.viewed && "bg-blue-100"} w-full h-24 p-4 flex-col justify-start `}>
                                    <Text className='font-medium mb-2'>{push.content.title}</Text>
                                    <Text className='mb-2'>{push.content.body}</Text>
                                    <Text>{push.created_at.toDate().toLocaleString()}</Text>
                                </TouchableOpacity>
                            ))}
                </View>

            </SafeAreaView>
        </View>
    )
}

export default NotificationsModal;