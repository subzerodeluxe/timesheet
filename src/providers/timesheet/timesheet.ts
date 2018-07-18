import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable()
export class TimesheetProvider {

  constructor(public http: HttpClient) {
    console.log('Hello TimesheetProvider Provider');
  }

  getCurrentWeekNumber(): number {
    const weekNumber = moment().isoWeek(); // Number
    return weekNumber;
  }

}
