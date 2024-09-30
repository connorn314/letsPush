import { useEffect, useRef } from "react";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";
import { Platform } from "react-native";
import { expoPushTokenState, myPushNotificationsState, notificationState, PushNotificationState, userState } from "./atomStorage";
import { useAtom } from "jotai";
import { useRouter } from "expo-router";



export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const router = useRouter();
  
  const [user,] = useAtom(userState);
  const [expoPushToken, setExpoPushToken] = useAtom(expoPushTokenState);
  const [notification, setNotification] = useAtom(notificationState);
  const [, setMyPushNotifications] = useAtom(myPushNotificationsState);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();


  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }
  
  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError('Project ID not found');
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        // console.log(pushTokenString, " Hi");
        // setExpoPushToken(pushTokenString);
        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
  }


  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => {
        // console.log("this is where it's being set to nothing", token)
        setExpoPushToken(token ?? '')
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      if (!notification.request.content) return;
      notification.request.content
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.notification.request.content?.data?.url) {
        router.push(response.notification.request.content.data.url)
      }
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
        collection(FIRESTORE_DB, 'push_notifications'),
        where('userId', '==', user.id),
        limit(50)
    );

    const subscriber = onSnapshot(q, {
        next: (snapshot) => {
            const myPushes: any[] = [];
            snapshot.docs.forEach(doc => {
                myPushes.push({ id: doc.id, ...doc.data() })
            })
            setMyPushNotifications(myPushes)
        }
    })

    return () => subscriber();
}, [user])

  return {
    expoPushToken,
    notification
  }
}