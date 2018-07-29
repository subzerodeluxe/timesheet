export interface DateLine {
    date: string; // maandag 8 juli 2018 
    totalActivities: Array<ActivityLine>; 
    totalHours: number; // 7.5 
}

export interface ActivityLine {
    hours?: number // 3.5 
    clientName: string;  // Needse molen 
    location: string; // Neede
    startTime: string; // 7:30
    endTime: string; // 16:45 
    activities: Array<Activity>; // Bovenwerk: Afwassen balken kruiwerk,raampjes,luiken en schuren..
}

export interface Activity {
    name: string; // Trapleuning geschilderd 
}