import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, NavParams, Slides, IonicPage } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { ActivityLine } from '../../models/activityLine.interface';
import { Subscription } from 'rxjs/Subscription';

@IonicPage({
  name: 'add-activity'
})
@Component({
  selector: 'page-add-activity',
  templateUrl: 'add-activity.html',
})
export class AddActivityPage {

  firstActivityForm: FormGroup; 
  secondActivityForm: FormGroup;
  thirdActivityForm: FormGroup;
  totalHours: string; 
  lastSlide = false;
  timesheetSub: Subscription;
  @ViewChild('slider') slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, public time: TimesheetProvider,
    public formBuilder: FormBuilder, public authProvider: AuthProvider, public layoutProvider: LayoutProvider) {

    this.firstActivityForm = new FormGroup({
      clientName: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(4),
        Validators.required
        ])),
      location: new FormControl('', Validators.required)
    });

    this.secondActivityForm = this.formBuilder.group({
      activities: this.formBuilder.array([
         this.initActivityFields()
      ])
    });
    
    this.thirdActivityForm = new FormGroup({
      startTime: new FormControl('07:00', Validators.required),
      endTime: new FormControl('16:00', Validators.required)
    });

    this.timesheetSub = this.time.createTimesheet().subscribe((s) => {
      console.log(s);
    });
   
  }

  initActivityFields(): FormGroup {
   return this.formBuilder.group({
      name: ['', Validators.required]
   });
  }

  addNewInputField(): void {
   const control = <FormArray>this.secondActivityForm.controls.activities;
   control.push(this.initActivityFields());
  }

  removeInputField(i: number): void {
   const control = <FormArray>this.secondActivityForm.controls.activities;
   control.removeAt(i);
}

  onSlideChanged() {
    // If it's the last slide, then hide the 'Skip' button on the header
    this.lastSlide = this.slider.isEnd();
  }

  nextSlide() {
    // this.slider.lockSwipeToNext(true);
    this.slider.slideNext();
  }

  previousSlide() {
    this.slider.slidePrev();
  }

  saveActivity() {
    if(!this.firstActivityForm.valid){
      this.slider.slideTo(0);
      // boodschap: niet alle velden zijn (correct) ingevuld!
      this.layoutProvider.presentBottomToast('Niet alle velden zijn (correct) ingevuld!')
    }
    else if(!this.secondActivityForm.valid) {
        this.slider.slideTo(1);
        this.layoutProvider.presentBottomToast('Niet alle velden zijn (correct) ingevuld!')
      } else if(!this.thirdActivityForm.valid) {
        this.slider.slideTo(3);
        this.layoutProvider.presentBottomToast('Niet alle velden zijn (correct) ingevuld!')
      }
    else {

      let loading = this.layoutProvider.showLoading();
      loading.present();

      this.totalHours = this.time.calculateHoursDifference(this.thirdActivityForm.value.startTime, this.thirdActivityForm.value.endTime,);

      const activityObject: ActivityLine  = { 
        isoDateString: this.time.getCurrentIsoString(),
        clientName: this.firstActivityForm.value.clientName,
        location: this.firstActivityForm.value.location,
        startTime: this.thirdActivityForm.value.startTime,  
        endTime: this.thirdActivityForm.value.endTime,
        activities: this.secondActivityForm.value.activities,
        hoursDifference: this.totalHours
      };

      // this.time.saveActivity(activityObject)
      //   .then(() => {
      //     loading.dismiss().then(() => {
      //       console.log('Gelukt!');
      //       this.layoutProvider.presentBottomToast('Activiteit toegevoegd');
      //       setTimeout(() => {
      //         this.navCtrl.setRoot('timesheet');
      //       }, 2000);
      //     });
      // }).catch(err => console.log(err));
    }
  }  

  calculateHours(startTime, endTime) {
    console.log('We komen er wel');
    this.totalHours = this.time.calculateHoursDifference(startTime, endTime);
  }

  validation_messages = {
    'clientName': [
      { type: 'required', message: 'Dit is een verplicht veld.' },
      { type: 'minlength', message: 'Veld moet minimaal 4 tekens bevatten.' },
      { type: 'maxlength', message: 'Veld mag niet langer zijn dan 25 tekens.' }
    ],
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };

  // ngOnDestroy() {
  //   this.timesheetSub.unsubscribe();
  // }
}
