import { atom } from "jotai";
import * as Notifications from "expo-notifications";
import { Workout } from "../types/workouts";
import { User } from "../types/user";

export const userState = atom<any>(null);
export const myWorkoutsState = atom<Workout[]>([]);
export const myFriends = atom<User[]>([]);
export const friendCommitmentsState = atom<Workout[]>([]);

export const firebaseAuthLoadingState = atom<boolean>(true);
export const stravaAuthLoadingState = atom<boolean>(false);

export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: string;
}

export const expoPushTokenState = atom<string | undefined>();
export const notificationState = atom<Notifications.Notification | undefined>();
