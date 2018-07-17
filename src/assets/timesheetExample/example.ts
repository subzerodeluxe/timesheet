import { TimeSheet } from "../../models/timesheet.interface";

export class Example {
 
    timesheet: TimeSheet = {
        employee: { 
            firstName: 'Willem',
            lastName: 'Waanders' 
        },
        weekNumber: 21,
        dateLines: [{
                date: 'Maandag 16 augustus',
                    activities: [{
                        hours: 3,
                        customer: 'Needse molen',
                        activity: ['Voorwerk', 'Aflakken']
                    }, {
                        hours: 4.5,
                        customer: 'Gemeente Berkelland',
                        activity: ['Voorwerk', 'Grondverven']
                    }],
                totalHours: 7.5
            }, {
                date: 'Dinsdag 17 augustus',
                activities: [{
                    hours: 7.5,
                    customer: 'Needse molen',
                    activity: ['Voorwerk', 'Aflakken']
                }],
                totalHours: 7.5
            }
        ],
        allDates: 'Maandag 16 augustus t/m dinsdag 17 augustus',
        totalHours: 15,
        vehicleInformation: {
            licensePlate: '44-VD-356',
            mileAge: 120.000
        }
    }
}