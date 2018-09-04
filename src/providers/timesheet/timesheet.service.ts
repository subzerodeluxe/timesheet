import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { EnrichedActivity, ActivityLine } from '../../models/activityLine.interface';
import { AuthProvider } from '../auth/auth.service';
import { UserProvider } from '../user/user.service';
import { Employee } from '../../models/employee.interface';
import { TimeSheet } from '../../models/timesheet.interface';
import { map, mergeMap} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class TimesheetProvider {

  enrichedActivity: EnrichedActivity;
  activitiesRef: AngularFirestoreCollection<any>;
  timesheetsRef: AngularFirestoreCollection<any>;
  weekNumbersRef: AngularFirestoreCollection<any>;
  timesheet: TimeSheet;
  docPresent: boolean;

  constructor(public afs: AngularFirestore, public userService: UserProvider,  
    public authService: AuthProvider) {
      this.activitiesRef = this.afs.collection('activities');
      this.timesheetsRef = this.afs.collection('timesheets');
      this.weekNumbersRef = this.afs.collection('weekNumbers');
  }
    
  // createTimesheet(): Observable<any> {
  //   let weekNumber = this.getCurrentWeekNumber().toString();
  //   let year = this.getCurrentYear().toString();
  //   this.checkWeekNumber(weekNumber, year)
  //     .then(doc => {
  //       if (doc.exists) {
  //         console.log('Show doc data: ', doc.data());
  //         this.docPresent = true;
  //       } else {
  //         console.log('Doc not present');
  //         this.docPresent = false; 
  //       }
  //     });

  //     if (this.docPresent === false) {
  //       return this.authService.getAuthenticatedUser().pipe(
  //         map(user => {
  //           this.timesheet = {
  //             id: this.afs.createId(),
  //             employee: { uid: user.uid },
  //             weekNumber: this.getCurrentWeekNumber(),
  //             timesheetFinished: false,
  //             isoStartDate: this.getCurrentIsoString()
  //           };
  //         }),
  //         mergeMap(() => this.timesheetsRef.doc(`week-${weekNumber}-${year}`).set(this.timesheet))
  //         );
  //     } else {
  //       return Observable.of('Timesheet reeds aangemaakt');
  //     } 
  // }

  async createTimesheet(): Promise<any> {
    let weekNumber = this.getCurrentWeekNumber().toString();
    let year = this.getCurrentYear().toString();
    const doc = await this.docExists(`week-${weekNumber}-${year}`);
    console.log('Controleren of timesheet bestaat...');
    if (doc.exists === false) {
     return this.authService.getAuthenticatedUser().pipe(
        map(user => {
          this.timesheet = {
            id: this.afs.createId(),
            employee: { uid: user.uid },
            weekNumber: this.getCurrentWeekNumber(),
            timesheetFinished: false,
            isoStartDate: this.getCurrentIsoString()
          };
        }),
        mergeMap(() => this.timesheetsRef.doc(`week-${weekNumber}-${year}`).set(this.timesheet))
      ).toPromise();
    } else {
      return 'timesheet already exists';
    }
  }

  async checkWeekNumber(weekNumber: string, year: string) {
    const doc = await this.docExists(`week-${weekNumber}-${year}`);
    return doc;
  }

  async docExists(path: string): Promise<any> {
    return this.timesheetsRef.doc(path).ref.get();
  }


  saveActivity(activityObject: ActivityLine) {
    return this.userService.getAuthenticatedUserProfile().toPromise()
      .then((userObject: Employee) => {
        this.enrichedActivity = {
          employee: {...userObject},
          activityLine: activityObject
        };

        return this.activitiesRef.add(this.enrichedActivity);
      }).catch(err => console.log('Oh no ... ', err));
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
