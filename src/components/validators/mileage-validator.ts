import { FormControl } from '@angular/forms';
 
export class MileageValidator {
 
    static isValid(control: FormControl): any {
 
        if(isNaN(control.value)){
            return {
                isValid: true
              };
        }
 
        if(control.value % 1 !== 0){
            return {
                isValid: true
              };
        }
 
        if(control.value < 5){
            return {
                isValid: true
              };
        }
 
        if (control.value > 1000){
            return {
                isValid: true
            };
        }
 
        return {
            isValid: false
          };
    }
 
}