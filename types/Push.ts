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
    friend_request?: {
        is_request: boolean,
        from: string,
        is_answered: boolean
    },
    created_at: Timestamp;
    userId: string;
    viewed: boolean;
}