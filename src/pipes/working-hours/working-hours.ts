import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatHours',
})
export class WorkingHoursPipe implements PipeTransform {
  
  newHours: string; 

  transform(hours: number) {
    console.log('PIPE incoming hours: ', hours);
    
    let str = hours.toString();

    if (str.length === 1) {
      this.newHours = hours.toString() + ' uur';
    } else {
      let f = str.substr(2);
      let hours = str.substr(0,1);
      let min = this.check(f);   // 15 
      let final = hours + ' uur ' + 'en ' + min + ' min.';
  
      this.newHours = final;
    }
  
    return this.newHours;
  }

  check(hrString): string {
 
    switch(hrString) { 
      case '25': { 
         hrString = '15';
         break; 
      } 
      case '5': { 
        hrString = '30'; 
         break; 
      } 
      case '75': { 
        hrString = '45';
        break; 
     } 
      default: { 
         hrString = 'Error'; 
         break; 
      } 
    } 
    return hrString;  
  }
}
