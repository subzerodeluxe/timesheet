import { Employee } from "./employee.interface";

export interface Activity {
    name: string; // Trapleuning geschilderd 
}

export interface firebaseActivity {
    id?: string;
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

export interface firebaseTimesheet {
    vehicleInfo: {
        type: string;
          mileage: string;
          licenseplate: string;
    },
    employee: Employee;
    timesheetId: string;
}