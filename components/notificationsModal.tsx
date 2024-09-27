import { myPushNotificationsState } from '@/storage/atomStorage';
import { View, Text, ScrollView } from 'react-native';
import { useAtom } from "jotai";

const NotificationsModal = () => {

    const [myPushNotifications, ] = useAtom(myPushNotificationsState);
    
    return (
        <View className='h-full w-full items-center justify-center'>
            <ScrollView>
                <Text>New</Text>
                {!!myPushNotifications.length && myPushNotifications.filter(push => !push.viewed).map(push => (
                    <View key={push.id} className='bg-blue-100'>
                        <Text>{push.content.title}</Text>
                        <Text>{push.content.body}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default NotificationsModal;