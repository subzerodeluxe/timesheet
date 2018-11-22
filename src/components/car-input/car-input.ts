import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { Employee } from '../../models/employee.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validation_messages } from '../../app/app.config';
import { MileageValidator } from '../validators/mileage-validator';
import { CompanyMileageValidator } from '../validators/company-mileage-validator';

@Component({
  selector: 'car-input',
  templateUrl: 'car-input.html'
})
export class CarInputComponent {

  carChoice: string;
  userObject: Employee;
  companyCarForm: FormGroup;
  carForm: FormGroup;
  companyCar: boolean = false;
  validation_messages = validation_messages;

  constructor(public params: NavParams, private navCtrl: NavController) {
    
    if (params.get('carChoice') && params.get('user') != null) {
      this.carChoice = params.get('carChoice');
      this.userObject = params.get('user'); 
      console.log("Dit is meegekomen " + this.carChoice, ' en ', this.userObject);
    }

    if (this.carChoice === 'companyCar') {
      this.companyCar = true;
    } else {
      this.companyCar = false;
    }
  
    this.companyCarForm= new FormGroup({
      licenseplate: new FormControl('', Validators.compose([
        Validators.maxLength(10),
        Validators.minLength(4),
        Validators.required
        ])),
        companyMileage: new FormControl('', Validators.compose([
          Validators.required,
          CompanyMileageValidator.isValid
        ]))
    });
    
    this.carForm = new FormGroup({
        mileage: new FormControl('', Validators.compose([
          Validators.required,
          MileageValidator.isValid
        ])),
    });
  }

  closeModal() {
    //this.viewCtrl.dismiss();
    this.navCtrl.setRoot('tabs'); 
  }

  submitCar(value: any) {
    console.log(value); 
  }

}
