import {  Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {
  
  transform(isoString: Date|moment.Moment, ...args: any[]): any {
    let [format] = args;
    return moment(isoString).format(format);
  }
}
