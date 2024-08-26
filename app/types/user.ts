import { Workout } from "./workouts";


export interface User {
    id: string;
    name: string;
    created_at: number;
    friends: string[];
    pushToken: string;
    workouts: Workout[];
}