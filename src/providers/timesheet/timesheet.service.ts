import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { EnrichedActivity, ActivityLine } from '../../models/activityLine.interface';
import { AuthProvider } from '../auth/auth.service';
import { UserProvider } from '../user/user.service';
import { Employee } from '../../models/employee.interface';
import { User } from 'firebase/app';
import { TimeSheet } from '../../models/timesheet.interface';
import { DocumentReference } from '@firebase/firestore-types';
import { first } from 'rxjs/operators';

@Injectable()
export class TimesheetProvider {

  enrichedActivity: EnrichedActivity;
  activitiesRef: AngularFirestoreCollection<any>;
  timesheet: TimeSheet;
  user: User;
  
  constructor(public afs: AngularFirestore, public userService: UserProvider,  
    public authService: AuthProvider) {
      this.activitiesRef = this.afs.collection('activities');
  }
    
  createTimesheet() {
    const timesheetref = this.afs.collection('timesheets');
    this.user = this.authService.getCurrentUser(); // gets firebase user 
    return this.userService.getCurrentUserInfo(this.user).toPromise()
      .then((userObject: Employee) => {
        this.timesheet = {
          employee: { uid: userObject.uid },
          weekNumber: this.getCurrentWeekNumber(),
          timesheetFinished: false,
          isoStartDate: this.getCurrentIsoString()
        };

        return timesheetref.add(this.timesheet);
      }).catch(err => console.log('Oh no ... ', err));
  
  }

  updateTimesheet() {

  }

  saveActivity(activityObject: ActivityLine) {
    return this.userService.getCurrentUserInfo(this.user).toPromise()
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
