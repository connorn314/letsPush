import { atom } from "jotai";
import * as Notifications from "expo-notifications";
import { WeekOfCommitments, Workout } from "../types/workouts";
import { User } from "../types/user";
import { MyPushNotification } from "@/types/Push";

export const userState = atom<any>(undefined);
export const myPushNotificationsState = atom<MyPushNotification[]>([])
export const myWorkoutsState = atom<Workout[]>([]);
export const myWeekPlansState = atom<WeekOfCommitments[]>([]);
export const thisWeekPlanState = atom<WeekOfCommitments | null>(null);
export const myFriends = atom<User[]>([]);
export const friendWeekPlansState = atom<WeekOfCommitments[]>([]);
export const friendCommitmentsState = atom<Workout[]>([]);
export const expandFriendReminderSection = atom<string | null>(null);

export const signingUpState = atom<boolean>(false);
export const firebaseAuthLoadingState = atom<boolean>(true);
export const stravaAuthLoadingState = atom<boolean>(false);
export const friendCommitmentsLoadingState = atom<boolean>(true);
export const friendWeekPlansLoadingState = atom<boolean>(true);
export const hasBadgeNotificationsState = atom<boolean>(false);

export const lockPageOnCarousel = atom<boolean>(false);

export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: string;
    makeEnablePushRequest: () => void;
}

export const expoPushTokenState = atom<string | undefined>();
export const notificationState = atom<Notifications.Notification | undefined>();
