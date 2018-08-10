import {  Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
moment.locale('nl');

@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {
  
  transform(value: Date | moment.Moment, dateFormat: string): any {
    if (dateFormat == 'dd') {
      const result = moment(value).format(dateFormat);
      return result.toUpperCase();
    } else {
      return moment(value).format(dateFormat);
    }
  }
}
