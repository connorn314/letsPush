import { Workout } from "./workouts";


export interface User {
    name: string;
    created_at: number;
    friends: string[];
    pushToken: string;
    workouts: Workout[];
}