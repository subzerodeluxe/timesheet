import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { EnrichedActivity, ActivityLine } from '../../models/activityLine.interface';
import { AuthProvider } from '../auth/auth.service';
import { UserProvider } from '../user/user.service';
import { Employee } from '../../models/employee.interface';
import { TimeSheet } from '../../models/timesheet.interface';
import { map, mergeMap} from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'timesheetPresent'; 
@Injectable()
export class TimesheetProvider {

  enrichedActivity: EnrichedActivity;
  activitiesRef: AngularFirestoreCollection<any>;
  timesheetsRef: AngularFirestoreCollection<any>;
  weekNumbersRef: AngularFirestoreCollection<any>;
  timesheet: TimeSheet;
  docPresent: boolean;
  timesheetPresent = false;
  weekNumber: string;
  year: string;
  uid: string;

  constructor(public afs: AngularFirestore, public userService: UserProvider, public storage: Storage,
    public authService: AuthProvider) {
      this.activitiesRef = this.afs.collection('activities');
      this.timesheetsRef = this.afs.collection('timesheets');
      // this.weekNumbersRef = this.afs.collection('weekNumbers');

      this.getLocalTimesheet()
        .then(timesheet => {
          console.log(timesheet);
        })

        // MOET DIT NIET IN DE APP.COMPONENT? 
    
  }

  async createTimesheet(user): Promise<any> {
    this.weekNumber = this.getCurrentWeekNumber().toString();
    this.year = this.getCurrentYear().toString();
    this.uid = user.uid;
    
    const doc = await this.docExists(`week-${this.weekNumber}-${this.year}-${this.uid}`);
    console.log('Controleren of timesheet bestaat...');
    if (doc.exists === false) {
     return this.authService.getAuthenticatedUser().pipe(
        map(user => {
          this.timesheet = {
            id: `week-${this.weekNumber}-${this.year}-${this.uid}`,
            employee: { uid: user.uid },
            weekNumber: this.getCurrentWeekNumber(),
            timesheetFinished: false,
            isoCreated: this.getCurrentIsoString(),
            isoLastUpdated: this.getCurrentIsoString(),
            totalHours: 0
          };
        }),
        mergeMap(() => this.timesheetsRef.doc(`week-${this.weekNumber}-${this.year}-${this.uid}`).set(this.timesheet))
      ).toPromise();
    } else {
      return 'timesheet already exists';
    }
  } 

  getLocalTimesheet() {
    return this.storage.get(STORAGE_KEY);
  }

  async docExists(path: string): Promise<any> {
    return this.timesheetsRef.doc(path).ref.get();
  }


  async saveActivityToTimesheet(activityObject: ActivityLine) {

    try {
      await this.saveActivity(activityObject);
      return 'success';
    } catch (err) {
      return 'error';
      console.log(err);
    }
    // return this.authService.getAuthenticatedUser().pipe(
    //   map(user => {
    //     this.enrichedActivity = {
    //       // employee: { uid: userObject.uid },
    //       activityLine: activityObject
    //     };
    //   }),
    //   mergeMap(() => this.timesheetsRef.doc(`week-${this.weekNumber}-${this.year}-${this.uid}`).set(this.timesheet))
    // ).toPromise();
  } 

  async saveActivity(activityObject: ActivityLine) {
      this.enrichedActivity = {
        // employee: { uid: userObject.uid },
        activityLine: activityObject
      };

      return this.activitiesRef.add(this.enrichedActivity);
  }



  calculateHoursDifference(startTime, endTime): string {
    let start = moment.utc(startTime, "HH:mm");
    let end = moment.utc(endTime, "HH:mm");

    // account for crossing over to midnight the next day
    if (end.isBefore(start)) end.add(1, 'day');

    // calculate the duration
    let d = moment.duration(end.diff(start));

    // format a string result
    const correctHours = moment.utc(+d).format('H:mm');  
    console.log(correctHours);
    return correctHours;
  }

  getCurrentWeekNumber(): number {
    const weekNumber = moment().week(); // Number
    weekNumber.toLocaleString()
    return weekNumber;
  }

  getCurrentDayNumber(): number {
    // const date = moment().isoWeekday().toString(); 
    const dayNumber = moment().date();
   
    return dayNumber; 
  }

  getCurrentMonth(): string {
    const month = moment().format('MMM'); 
    return month;
  }

  getCurrentYear(): string {
    const year = moment().format('YYYY');
    return year; 
  }

  getCurrentIsoString(): string {
    const isoString = moment().toISOString(true); 
    return isoString; 
  }
}
