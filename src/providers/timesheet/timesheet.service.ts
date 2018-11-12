import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { AuthProvider } from '../auth/auth.service';
import { UserProvider } from '../user/user.service';
import { TimeSheet } from '../../models/timesheet.interface';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { firebaseActivity } from '../../models/activityLine.interface';

@Injectable()
export class TimesheetProvider {

  enrichedActivity: any;
  activitiesRef: AngularFirestoreCollection<any>;
  timesheetsRef: AngularFirestoreCollection<any>;
  weekNumbersRef: AngularFirestoreCollection<any>;
  timesheet: TimeSheet;
  docPresent: boolean;
  currentDate: string;
  timesheetPresent = false;
  weekNumber: string;
  year: string;
  uid: string;
  public totalMinutesCounter: BehaviorSubject<string> = new BehaviorSubject<string>('0');

  constructor(public afs: AngularFirestore, public userService: UserProvider,
    public authService: AuthProvider, public storage: Storage) {
      this.activitiesRef = this.afs.collection('activities');

      this.currentDate = this.getCurrentDayNumber().toString(); 
      this.weekNumber = this.getCurrentWeekNumber().toString();
      this.year = this.getCurrentYear().toString(); 

      this.storage.get('totalMinutes').then(minutes => {
        console.log('Storage minutes: ', minutes);
        if (minutes !== '0') {
          this.totalMinutesCounter.next(minutes);
        }
      }).catch(e => console.log('Ophalen aantal uren ging niet goed'));
  }

  findAllDailyActivitiesByUser(userObject: any) {
     return this.afs.collection('activities', ref => {
      return ref.where('userDateString', '==', `${this.currentDate}-week-${this.weekNumber}-${this.year}-${userObject.uid}`);
        }).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as firebaseActivity;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        )
  }

  findAllWeekActivitiesByUser(userObject: any) {
    return this.afs.collection('activities', ref => {
     return ref.where('timesheetId', '==', `week-${this.weekNumber}-${this.year}-${userObject.uid}`);
        }).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as firebaseActivity;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        )
  }

  async saveActivity(activityObject: any, user: any) {
    console.log('Doorgestuurde user: ', user.uid);
    const weekNumber = this.getCurrentWeekNumber().toString();
    const year = this.getCurrentYear().toString(); 

    this.enrichedActivity = {
      timesheetId: `week-${weekNumber}-${year}-${user.uid}`,
      uid: user.uid,
      userDateString: `${this.getCurrentDayNumber().toString()}-week-${weekNumber}-${year}-${user.uid}`,
      ...activityObject
    };
    this.calculateTotalHours(activityObject.hoursDifference);
    this.activitiesRef.add(this.enrichedActivity);
  }

  async updateActivity(activityObject: any, id: string): Promise<boolean> { 
    const ref = this.activitiesRef.doc(id)
    try {
      const uploadedActivity = activityObject;
      await ref.update({...uploadedActivity});
      return true;
    } 
    catch(e) {
      console.log('Er gaat iets niet goed. ', e);
      return false;
    } 
  }

  calculateTotalHours(incomingMinutes: number) {
    this.storage.get('totalMinutes').then((currentMinutes: number) => {
      const x = +currentMinutes + +incomingMinutes;
      console.log('The sum ', x);
     this.storage.set('totalMinutes', x)
       .then(_ => this.totalMinutesCounter.next(x.toString()));
    });
  }

  calculateMinutesDifference(startTime, endTime): number {
    const start = moment.utc(startTime, "HH:mm");
    const end = moment.utc(endTime, "HH:mm");

    // account for crossing over to midnight the next day
    if (end.isBefore(start)) end.add(1, 'day');

    // calculate the duration
    let d = moment.duration(end.diff(start));
  
    const correctMinutes = d.asMinutes();
    console.log('Correct minutes?: ', correctMinutes);   
    return correctMinutes;
  }

  deleteActivity(activityObject: any): Promise<void> {
    return this.activitiesRef.doc(activityObject.id).delete();
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
