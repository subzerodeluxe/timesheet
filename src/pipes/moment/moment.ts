import {  Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
moment.locale('nl');

@Pipe({
  name: 'formatDate',
})
export class MomentPipe implements PipeTransform {
  
  transform(value: Date | moment.Moment, dateFormat: string): any {
    if (dateFormat === 'dddd') {
      const result = moment(value).format(dateFormat).replace(/\w/, c => c.toUpperCase())
      return result;
    } else {
      return moment(value).format(dateFormat);
    }
  }
}