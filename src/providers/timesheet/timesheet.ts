import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { TimeSheet } from '../../models/timesheet.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TimesheetProvider {

  constructor(public http: HttpClient) {
    console.log('Hello TimesheetProvider Provider');
  }

  getCurrentWeekNumber(): number {
    const weekNumber = moment().isoWeek(); // Number
    return weekNumber;
  }

  getData(): Observable<any> {
    return this.http.get('./assets/example-data/timesheet.json', {responseType: 'json'});
  }

  

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  
}
