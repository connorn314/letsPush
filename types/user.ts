import { WeekOfCommitments, Workout } from "./workouts";


export interface User {
    id: string;
    name: string;
    created_at: number;
    friends: string[];
    pushToken: string;
    workouts: Workout[];
    workoutPlans: WeekOfCommitments[];
    reminders_sent?: string[];
    profile_image_url?: string;
}