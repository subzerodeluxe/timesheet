export interface DateLine {
    date: string; // maandag 8 juli 2018 
    activities: Array<ActivityLine>; 
    totalHours: number; // 7.5 
}

export interface ActivityLine {
    hours: number; // 7.5 
    customer: string;  // Needse molen 
    activity: Array<string>; // Bovenwerk: Afwassen balken kruiwerk,raampjes,luiken en schuren..
}