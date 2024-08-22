import { Timestamp } from "firebase/firestore";


export interface Workout {
    id: string;
    userId: string;
    created_at: number;
    startDate: Timestamp;
    distance: number;
    status: "complete" | "failure" | "NA";
    pace: string;
    name: string;
    // followers: string[];
}