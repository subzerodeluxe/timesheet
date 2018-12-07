import { FormControl } from '@angular/forms';
 
export class CompanyMileageValidator {
 
    static isValid(control: FormControl): any {
 
        let input = Number(control.value);

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
 
        if(input < 5000){
            return {
                isValid: true
              };
        }
 
        if (input > 400000){
            return {
                isValid: true
            };
        }
 
        return {
            isValid: false
          };
    }
 
}