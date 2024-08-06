import { atom } from "jotai";
import * as Notifications from "expo-notifications";

export const userState = atom<any>(null);

export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: string;
}

export const expoPushTokenState = atom<string | undefined>();
export const notificationState = atom<Notifications.Notification | undefined>();
