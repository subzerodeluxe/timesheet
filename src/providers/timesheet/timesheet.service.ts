import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { EnrichedActivity, ActivityLine } from '../../models/activityLine.interface';
import { AuthProvider } from '../auth/auth.service';
import { UserProvider } from '../user/user.service';
import { TimeSheet } from '../../models/timesheet.interface';
import { map, mergeMap} from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';

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

  constructor(public afs: AngularFirestore, public userService: UserProvider,
    public authService: AuthProvider) {
      this.activitiesRef = this.afs.collection('activities');
      this.timesheetsRef = this.afs.collection('timesheets');
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
            finished: false,
            created: this.getCurrentIsoString(),
            lastUpdated: this.getCurrentIsoString(),
            totalHours: 0
          };
        }),
        mergeMap(() => this.timesheetsRef.doc(`week-${this.weekNumber}-${this.year}-${this.uid}`).set(this.timesheet))
      ).toPromise();
    } else {
      return 'timesheet already exists';
    }
  } 

  async docExists(path: string): Promise<any> {
    return this.timesheetsRef.doc(path).ref.get();
  }


  async saveActivityToTimesheet(activityObject: ActivityLine) {


    return this.saveActivity(activityObject)
      .then(answer=> {
        if (answer.success === true) {
          const docRef = this.timesheetsRef.doc(`week-${this.weekNumber}-${this.year}-${this.uid}`);
            docRef.update({
    
            });
          return 'success';
        } else {
          console.log('Error BIG TIME');
        }
      })
      .catch(err => {
        console.log(err);
        return 'error';
      });
  } 

  async saveActivity(activityObject: ActivityLine) {
    const id = this.afs.createId();
    const ref = this.afs.doc(`activities/${id}`);

      this.enrichedActivity = {
        id: id,
        activityLine: activityObject
      };

    try {
      await ref.set(this.enrichedActivity);
      const answer = { success: true, payload: id };
      return answer;
    } catch(e) {
      const answer = { success: false, payload: null};
      return answer; 
    }
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
