import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/nl'
moment.locale('nl');

@Pipe({
  name: 'formatHours',
})
export class WorkingHoursPipe implements PipeTransform {
  
  transform(minutes: number) {
    
    let finalHours = moment.duration(minutes, "minutes").format("h:mm");
    
    let index = finalHours.indexOf(":"); 
    
    let slicedMinutes = finalHours.slice(index + 1); 
    let slicedHours = finalHours.slice(0, index); 
    
    finalHours = slicedHours + ' uur ' + 'en ' + slicedMinutes + ' min.';
    return finalHours;
  }
}
