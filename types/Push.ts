import { Timestamp } from "firebase/firestore";

export interface MyPushNotification {
    id: string;
    content: {
        badge: number;
        body: string;
        data?: {
            url?: string;
        };
        sound: "default";
        title: string;
        to: string;
    },
    created_at: Timestamp;
    userId: string;
    viewed: boolean;
}