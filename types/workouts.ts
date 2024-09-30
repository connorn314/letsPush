import { Timestamp } from "firebase/firestore";


export interface WeekOfCommitments {
    id: string;
    userId: string;
    created_at: Timestamp;
    start: string;
    end: string;
    current: boolean;
    commitments: string[]; //holds IDs corresponding to Workouts
}

export interface WeekOfCommitmentsFormData {
    
}

export interface Workout {
    id: string;
    userId: string;
    created_at: number;
    startDate: Timestamp;
    distance: number;
    status: "complete" | "failure" | "NA";
    pace: string;
    name: string;
    weekPlanId: string;
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


export interface MyDate { 
    day: number, 
    month: number, 
    monthString: string, 
    year: number, 
    simpleString: string 
}