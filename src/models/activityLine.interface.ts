// export interface DateLine {
//     date: string; // maandag 8 juli 2018 
//     isoDateString: string;
//     totalActivities: Array<ActivityLine>; 
//     totalHours: string; // 7.5 
// }

export interface ActivityLine {
    isoDateString: string;
    hoursDifference: string; // 7:30 
    clientName: string;  // Needse molen 
    location: string; // Neede
    startTime: string; // 7:30
    endTime: string; // 16:45 
    activities: Array<Activity>; // Bovenwerk: Afwassen balken kruiwerk,raampjes,luiken en schuren..
}

export interface Activity {
    name: string; // Trapleuning geschilderd 
}