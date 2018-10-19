import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { AuthProvider } from '../auth/auth.service';
import { UserProvider } from '../user/user.service';
import { TimeSheet } from '../../models/timesheet.interface';
import { map, mergeMap, switchMap, combineLatest, filter} from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { add } from 'timelite/time'

@Injectable()
export class TimesheetProvider {

  enrichedActivity: any;
  activitiesRef: AngularFirestoreCollection<any>;
  timesheetsRef: AngularFirestoreCollection<any>;
  weekNumbersRef: AngularFirestoreCollection<any>;
  timesheet: TimeSheet;
  docPresent: boolean;
  timesheetPresent = false;
  weekNumber: string;
  year: string;
  uid: string;
  public totalHoursCounter: BehaviorSubject<string> = new BehaviorSubject<string>('0');

  constructor(public afs: AngularFirestore, public userService: UserProvider,
    public authService: AuthProvider, public storage: Storage) {
      this.activitiesRef = this.afs.collection('activities');
      
      this.authService.getAuthenticatedUser()
        .subscribe(user => this.uid = user.uid);

      this.storage.get('totalHours').then(hours => {
        console.log('Storage hours: ', hours);
        if (hours !== '0') {
          this.totalHoursCounter.next(hours);
        }
      })
  }

  getTimesheet() {
    return this.timesheetsRef.doc(`week-${this.weekNumber}-${this.year}-${this.uid}`).valueChanges();
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

  findAllDailyActivitiesByUser() {
    const currentDate = this.getCurrentDayNumber().toString(); 
    console.log('CurrentDate ', currentDate);
    
    return this.afs.collection('activities', ref => {
      return ref
        .where('userDateString', '==', `${currentDate}-week-${this.weekNumber}-${this.year}-${this.uid}`);
    }).valueChanges();
  }

  findAllWeekActivitiesByUser() {
    return this.afs.collection('activities', ref => 
      ref.where('timesheetId', '==', `week-${this.weekNumber}-${this.year}-${this.uid}`)).valueChanges();
  }

  async saveActivity(activityObject: any) {
    this.enrichedActivity = {
      timesheetId: `week-${this.weekNumber}-${this.year}-${this.uid}`,
      uid: this.uid,
      userDateString: `${this.getCurrentDayNumber().toString()}-week-${this.weekNumber}-${this.year}-${this.uid}`,
      ...activityObject
    };
    this.calculateTotalHours(activityObject.hoursDifference);
    this.activitiesRef.add(this.enrichedActivity);
  }

  calculateTotalHours(incomingHours: number) {

    this.storage.get('totalHours').then((currentHours: number) => {
      const x = +currentHours + +incomingHours;
      console.log('The sum ', x);
     this.storage.set('totalHours', x)
       .then(_ => this.totalHoursCounter.next(x.toString()));
    });
  }

  calculateHoursDifference(startTime, endTime): number {
    let start = moment.utc(startTime, "HH:mm");
    let end = moment.utc(endTime, "HH:mm");

    // account for crossing over to midnight the next day
    if (end.isBefore(start)) end.add(1, 'day');

    // calculate the duration
    let d = moment.duration(end.diff(start));
    let a = d.asHours();
    console.log('Berekening in uren: ', a);
    //let f = moment.utc(+a).format('H:mm');
    // console.log('Nieuwe format ', f);

    // format a string result
    // const correctHours = moment.utc(+d).format('H:mm'); 
    const correctHours = d.asHours();   
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
