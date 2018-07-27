import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { TimeSheet } from '../../models/timesheet.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TimesheetProvider {

  constructor(public http: HttpClient) {
    
  }

  getCurrentWeekNumber(): number {
    const weekNumber = moment().week(); // Number
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

  getData(): Observable<any> {
    return this.http.get('./assets/example-data/timesheet.json', {responseType: 'json'});
  }
}
