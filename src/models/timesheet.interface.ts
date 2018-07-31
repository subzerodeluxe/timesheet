import { Employee } from "./employee.interface";
import { Vehicle } from "./vehicle.interface";
import { ActivityLine } from "./activityLine.interface";

export interface TimeSheet {
    employee?: Employee; // first and lastname  
    weekNumber: number;  // 1 t/m 51
    timesheetFinished: boolean;
    isoStartDate: string;
    isoEndDate?: string;
    activityLines?: Array<ActivityLine>;   // activity contains all activies (activityLines) on a single date (maandag 6 juli)
    allDates?: string; // maandag 6 juli t/m vrijdag 10 juli 
    totalHours?: string; // 37.5 
    vehicleInformation?: Vehicle; // license plate and mileage 
}

// Zie voorbeeld: ./assets/timesheetExample EN ./assets/example.ts 
