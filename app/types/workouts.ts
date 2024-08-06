

export interface Workout {
    id: number;
    created_at: number;
    start_time: number;
    end_time: number;
    distance: number;
    complete: "complete" | "failure" | "NA";
    followers: string[];
}