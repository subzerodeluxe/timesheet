import { Employee } from "./employee.interface";
import { DateLine } from "./dateLine.interface";
import { Vehicle } from "./vehicle.interface";

export interface TimeSheet {
    employee: Employee; // first and lastname  
    weekNumber: number;  // 1 t/m 51
    isoString: string; // 2018-07-27T19:52:34.099+02:00
    dateLines: Array<DateLine>;   // date line contains all activies (activityLines) on a single date (maandag 6 juli)
    allDates: string; // maandag 6 juli t/m vrijdag 10 juli 
    totalHours: number; // 37.5 
    vehicleInformation: Vehicle; // license plate and mileage 
}

// Zie voorbeeld: ./assets/timesheetExample EN ./assets/example.ts 
