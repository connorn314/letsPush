import { atom } from "jotai";
import * as Notifications from "expo-notifications";
import { Workout } from "../types/workouts";

export const userState = atom<any>(null);
export const myWorkoutsState = atom<Workout[]>([])

export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: string;
}

export const expoPushTokenState = atom<string | undefined>();
export const notificationState = atom<Notifications.Notification | undefined>();
