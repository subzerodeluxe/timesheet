import { Component } from '@angular/core';
import { NavParams, NavController, ViewController } from 'ionic-angular';
import { Employee } from '../../models/employee.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validation_messages } from '../../app/app.config';
import { MileageValidator } from '../validators/mileage-validator';
import { CompanyMileageValidator } from '../validators/company-mileage-validator';
import { PdfProvider } from '../../providers/pdf/pdf';
import { firebaseActivity } from '../../models/activityLine.interface';
import { Vehicle } from '../../models/vehicle.interface';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { BrMaskerIonic3, BrMaskModel } from 'brmasker-ionic-3';

@Component({
  selector: 'car-input',
  templateUrl: 'car-input.html',
  providers: [BrMaskerIonic3]
})
export class CarInputComponent {

  carObject: Vehicle;
  userObject: Employee;
  companyCarForm: FormGroup;
  weekActivities: Array<firebaseActivity>;
  carForm: FormGroup;
  companyCar: boolean;
  validation_messages = validation_messages;

  constructor(public params: NavParams, public brMaskerIonic3: BrMaskerIonic3, private viewCtrl: ViewController, private layout: LayoutProvider, private pdf: PdfProvider) {
    
    this.carObject = params.get('carObject');
    this.userObject = params.get('user'); 
    this.weekActivities = params.get('weekActivities');
  
    if (this.carObject.type === 'company') {
      this.companyCar = true;
    } else {
      this.companyCar = false;
    }
  }

  ionViewWillLoad() {
    this.companyCarForm = new FormGroup({
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
        ]))
    });
  }

  private formatMileage(incomingMilage): string {
    const config: BrMaskModel = new BrMaskModel();
    config.numberAndTousand = true;
    config.thousand = '.'; 
    return this.brMaskerIonic3.writeCreateValue(incomingMilage, config);
  }

  closeModal(): void {
    this.viewCtrl.dismiss();
  }

  addCarToPDF(value: any) {
    if (value.licenseplate != null) {
      this.carObject = { mileage: this.formatMileage(value.companyMileage), licenseplate: value.licenseplate, type: 'company'};
    } else {
      this.carObject = { mileage: this.formatMileage(value.mileage), type: 'private' };
    }
    
    this.pdf.generatePDF(this.weekActivities, this.userObject, this.carObject);
  }
}
