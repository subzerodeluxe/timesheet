export interface EnrichedActivity {
    id: string;
    activityLine: ActivityLine;
}

export interface ActivityLine {
    isoDateString: string;
    minutesDifference: number;
    clientName: string;  // Needse molen 
    location: string; // Neede
    startTime: string; // 7:30
    endTime: string; // 16:45 
    activities: Array<Activity>; // Bovenwerk: Afwassen balken kruiwerk,raampjes,luiken en schuren..
}

export interface Activity {
    name: string; // Trapleuning geschilderd 
}

export interface firebaseActivity {
    activities?: Array<Activity>;
    clientName: string;
    endTime: string;
    minutesDifference: number;
    isoDateString?: string;
    location: string;
    startTime: string;
    timesheetId?: string;
    uid?: string;
    userDateString?: string; 
}