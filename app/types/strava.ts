export interface Athlete {
    badge_type_id:  number;
    bio:            null;
    city:           null;
    country:        null;
    created_at:     Date;
    firstname:      string;
    follower:       null;
    friend:         null;
    id:             number;
    lastname:       string;
    premium:        boolean;
    profile:        string;
    profile_medium: string;
    resource_state: number;
    sex:            string;
    state:          null;
    summit:         boolean;
    updated_at:     Date;
    username:       null;
    weight:         number;
}

export interface WebhookRequestBody {
    owner_id: number;
    event_time: number; // timestamp
    object_id: number;
    object_type: "activity" | "athlete";
    aspect_type: "create" | "update" | "delete";
}
