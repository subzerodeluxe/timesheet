import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { LayoutProvider } from '../layout/layout.service';

import { firebaseActivity, firebaseTimesheet } from '../../models/activityLine.interface';
import { Vehicle } from '../../models/vehicle.interface';
import { Employee } from '../../models/employee.interface';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';

import * as moment from 'moment';
import 'moment-duration-format';
import { TimeObject } from '../../models/time.interface';

@Injectable()
export class TimesheetProvider {

  enrichedActivity: firebaseActivity;
  activitiesRef: AngularFirestoreCollection<any>;
  currentDate: string;
  weekNumber: string;
  year: string;
  uid: string;
  public totalDailyMinutesCounter: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public totalWeekMinutesCounter: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(public afs: AngularFirestore, public layout: LayoutProvider, public storage: Storage) {
      this.activitiesRef = this.afs.collection('activities');

      this.currentDate = this.getCurrentDayNumber().toString(); 
      this.weekNumber = this.getCurrentWeekNumber().toString();
      this.year = this.getCurrentYear().toString();
  }

  findAllDailyActivitiesByUser(userObject: any): Observable<firebaseActivity[]> {
     return this.afs.collection('activities', ref => {
      return ref.where('userDateString', '==', `${this.currentDate}-week-${this.weekNumber}-${this.year}-${userObject.uid}`);
        }).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            let data = a.payload.doc.data() as firebaseActivity;
            data.id = a.payload.doc.id;
            return { ...data };
          })
        )
      )
  }

  
  findAllWeekActivitiesByUser(userObject: any): Observable<firebaseActivity[]> {
    return this.afs.collection('activities', ref => {
     return ref.where('timesheetId', '==', `week-${this.weekNumber}-${this.year}-${userObject.uid}`);
        }).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            let data = a.payload.doc.data() as firebaseActivity;
            data.id = a.payload.doc.id;
            return { ...data };
          }))
        )
  }

  findTimesheetByUserAndWeekNumber(): Observable<any> {
    const activities = this.afs.collection('activities', ref => {
      return ref.where('timesheetId', '==', `week-47-2018-eFI1cHuXpyS01Yjcj8jWAQavIMN2`);
         }).snapshotChanges().pipe(
           map(actions => actions.map(a => {
             const data = a.payload.doc.data() as firebaseActivity;
             data.id = a.payload.doc.id;
             return { ...data };
           })
        )
      );
      
    const timesheet = this.afs.collection('timesheets').doc('week-47-2018-eFI1cHuXpyS01Yjcj8jWAQavIMN2').valueChanges();
    const correctTimesheet = combineLatest(activities, timesheet);
    return correctTimesheet;
  }

  calculateDailyMinutes(incomingMinutes: Array<firebaseActivity>) {
    const totalMinutes = incomingMinutes.reduce((acc, activity) => acc + activity.minutesDifference, 0);
    this.totalDailyMinutesCounter.next(totalMinutes);
  }

  calculateWeekMinutes(incomingMinutes: Array<firebaseActivity>) {
    const totalMinutes = incomingMinutes.reduce((acc, activity) => acc + activity.minutesDifference, 0);
    this.totalWeekMinutesCounter.next(totalMinutes); 
  }

  calculateDateRange(): TimeObject {
    const currentYear = this.getCurrentYear(); 
    const currentWeekNumber = this.getCurrentWeekNumber(); 
    const startDayofWeekNumberAsISOString = moment([currentYear]).isoWeek(currentWeekNumber).startOf('isoWeek').format()    

    let max = moment(startDayofWeekNumberAsISOString).add(5, 'days').format();

     const timeObject: TimeObject = {
        start: startDayofWeekNumberAsISOString,
        min: startDayofWeekNumberAsISOString,
        max: max, 
      };

    return timeObject;
  }

  calculateDatesForPDF(weekActivies: any): TimeObject {
    weekActivies.sort((a, b) => {   
          return a.isoDateString > b.isoDateString ? 1 : a.isoDateString < b.isoDateString ? -1 : 0
    });
  
    const earliestDate = weekActivies[0].isoDateString;
    const latestDate   = weekActivies[weekActivies.length - 1].isoDateString;

    const timeObject: TimeObject = {
      earliestDate: moment(earliestDate).format('dddd D MMMM'),
      latestDate: moment(latestDate).format('dddd D MMMM'),
      weekNumber: moment(earliestDate).format('WW'),
      year: moment(earliestDate).format('YYYY')
    };
    
    return timeObject;
  }

  formatRowDateForPDF(date: string): string {
    const formattedDate = moment(date).format('dddd D MMM');
    return formattedDate;
  }

  async saveActivity(activityObject: any, user: any, weekActivity: boolean) {
    const weekNumber = this.getCurrentWeekNumber().toString();
    const year = this.getCurrentYear().toString(); 
  
    let correctDayNumber;
    if (weekActivity === true) {
      correctDayNumber = this.calculateDayNumber(activityObject.isoDateString);
    } else {
      correctDayNumber = this.getCurrentDayNumber().toString();
    }
    
    this.enrichedActivity = {
      timesheetId: `week-${weekNumber}-${year}-${user.uid}`,
      uid: user.uid,
      userDateString: `${correctDayNumber}-week-${weekNumber}-${year}-${user.uid}`,
      ...activityObject
    };
    this.activitiesRef.add(this.enrichedActivity);
  }

  updateActivity(activityObject: any, id: string) { 
    const ref = this.activitiesRef.doc(id)
    const uploadedActivity = activityObject;
    return ref.update({...uploadedActivity});
  }
      
  addTimesheet(carObject: Vehicle, user: Employee) {
    const ref = this.afs.collection('timesheets');
    const docId = `week-${this.weekNumber}-${this.year}-${user.uid}`;
    const doc = ref.doc(docId);

    const timesheetObject: firebaseTimesheet = 
    {
      vehicleInfo: {
        type: carObject.type,
        mileage: carObject.mileage || "",
        licenseplate: carObject.licenseplate || ""
      },
      employee: {
        firstName: user.firstName,
        lastName: user.lastName
      },
      timesheetId: docId
    };
    
    return doc.set({...timesheetObject});
  }

  calculateMinutesDifference(startTime, endTime): number {
    const start = moment.utc(startTime, "HH:mm");
    const end = moment.utc(endTime, "HH:mm");

    // account for crossing over to midnight the next day
    if (end.isBefore(start)) end.add(1, 'day');

    // calculate the duration
    let d = moment.duration(end.diff(start));
  
    const correctMinutes = d.asMinutes();
    return correctMinutes;
  }

  transformMinutesToHours(minutes: number): string {
    let finalHours = moment.duration(minutes, "minutes").format("h:mm");
    
    let index = finalHours.indexOf(":"); 
    
    let slicedMinutes = finalHours.slice(index + 1); 
    let slicedHours = finalHours.slice(0, index); 
    
    finalHours = slicedHours + ' uur ' + 'en ' + slicedMinutes + ' minuten';
    return finalHours;
  }

  deleteActivity(activityObject: any): Promise<void> {
    return this.activitiesRef.doc(activityObject.id).delete();
  }

  getCurrentWeekNumber(): number {
    const weekNumber = moment().isoWeek(); // Number
    return weekNumber;
  }

  calculateDayNumber(isoDateString: string): number {
    const dayNumber = moment(isoDateString).date();
    return dayNumber;
  }

  getCurrentDayNumber(): number {
    const currentIso = this.getCurrentIsoString();
    const date = moment(currentIso);
    const dayNumber = date.date();
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
