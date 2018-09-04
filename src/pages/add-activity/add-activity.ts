import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, NavParams, Slides, IonicPage } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { ActivityLine } from '../../models/activityLine.interface';
import { Subscription } from 'rxjs/Subscription';
import { validation_messages } from '../../app/app.config';

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
  timesheetExists: boolean;
  timesheetSub: Subscription;
  validation_messages = validation_messages;
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

    this.timesheetExists = false; 
    if (this.timesheetExists === false) {
      this.time.createTimesheet()
        .then(res => {
          console.log('De response: ', res);
          if (res === undefined) {
            console.log('Timesheet succesvol aangemaakt.');
            this.timesheetExists = true;
          } else {
            const alert = this.layoutProvider.showAlertMessage('TEST: werkbriefje bestaat al.', 'Geen nieuwe aangemaakt', 'Ok');
            alert.present();
          }
        })
        .catch(err => {
          console.log('Errors: ', err);
          const alert = this.layoutProvider.showAlertMessage('ERROR', err, 'Ok');
          alert.present();
        });
    }
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

      const loading = this.layoutProvider.showLoading();
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

      console.log(activityObject);

      this.time.saveActivity(activityObject)
        .then(() => {
          loading.dismiss().then(() => {
            console.log('Gelukt!');
            this.layoutProvider.presentBottomToast('Activiteit toegevoegd');
            setTimeout(() => {
              this.navCtrl.setRoot('timesheet');
            }, 1500);
          });
      }).catch(err => console.log(err));
    }
  }  

  calculateHours(startTime, endTime) {
    console.log('We komen er wel');
    this.totalHours = this.time.calculateHoursDifference(startTime, endTime);
  }

 

  ngOnDestroy() {
    if (this.timesheetSub) {
      this.timesheetSub.unsubscribe();
    }
  }
}
