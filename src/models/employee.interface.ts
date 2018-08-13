import { Vehicle } from "./vehicle.interface";

export interface Employee {
    uid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    emailVerified?: string;
    vehicleInformation?: Vehicle;
}