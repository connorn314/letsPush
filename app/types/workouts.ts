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
    strava_activity_id?: number;
    strava?: {
        distance: number;
        elapsed_time: number;
        moving_time: number;
        sport_type: "Run";
        total_elevation_gain: number;
    }
    // followers: string[];
}