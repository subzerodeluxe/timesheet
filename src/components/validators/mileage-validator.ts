import { FormControl } from '@angular/forms';
 
export class MileageValidator {
 
    static isValid(control: FormControl): any {
 
        let input = parseInt(control.value)
        console.log(input);
        if(isNaN(input)){
            return {
                isValid: true
              };
        }
 
        if(input % 1 !== 0){
            return {
                isValid: true
              };
        }
 
        if(input < 5){
            return {
                isValid: true
              };
        }
 
        if (input > 1000){
            return {
                isValid: true
            };
        }
    }
 
}