import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActivityLine } from '../../models/activityLine.interface';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class TimesheetProvider {

  
  constructor(public http: HttpClient, public afs: AngularFirestore) {
    
  }

  getActivities() {
    const activitiesRef = this.afs.collection('activities');
  }

  saveActivity(activityObject: ActivityLine) {
    const ref = this.afs.collection('activities');
    return ref.add(activityObject);
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

  getFakeData(): Observable<any> {
    return this.http.get('./assets/example-data/timesheet.json', {responseType: 'json'});
  }
}
