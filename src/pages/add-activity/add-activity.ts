import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavController, NavParams, Slides, IonicPage } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { firebaseActivity } from '../../models/activityLine.interface';
import { validation_messages } from '../../app/app.config';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs';

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
  totalMinutes: number; 
  lastSlide = false;
  user: any;
  timeObject: any;
  subscription: Subscription;
  weekActivity = false;
  validation_messages = validation_messages;
  minutesDifference: number;
  minutesWithBreakDifference: number;
  usedBreak: boolean = false;
  @ViewChild('slider') slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, public time: TimesheetProvider, public userProvider: UserProvider,
    public formBuilder: FormBuilder, public authProvider: AuthProvider, public layoutProvider: LayoutProvider) {
    
      this.timeObject = this.time.calculateDateRange(); 
      if (this.navParams.get('userObject') != null) {
        this.user = this.navParams.get('userObject');
      } else {
        this.subscription = this.userProvider.getAuthenticatedUserProfile()
          .subscribe(user => {
            this.user = user; 
          });
      }
      if (this.navParams.get('newWeekActivity') === true) {
        this.weekActivity = true; 
        console.log('Week activity true? ', this.weekActivity);
      }
  }

  ionViewWillLoad() {
    this.firstActivityForm = new FormGroup({
      clientName: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(4),
        Validators.required
        ])),
      location: new FormControl('', Validators.compose([
        Validators.maxLength(75),
        Validators.minLength(4),
        Validators.required
        ])),
        date: new FormControl(Validators.required)
    });

    this.secondActivityForm = this.formBuilder.group({
      activities: this.formBuilder.array([
         this.initActivityFields()
      ])
    });
    
    this.thirdActivityForm = new FormGroup({
      startTime: new FormControl('06:00', Validators.required),
      endTime: new FormControl('16:00', Validators.required)
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
    this.lastSlide = this.slider.isEnd();
  }

  nextSlide() {
    this.slider.slideNext();
  }

  previousSlide() {
    this.slider.slidePrev();
  }

 async saveActivity() {
    if(!this.firstActivityForm.valid){
      this.slider.slideTo(0);
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

      if (this.usedBreak === false) {
        this.minutesDifference = this.time.calculateMinutesDifference(this.thirdActivityForm.value.startTime, this.thirdActivityForm.value.endTime);
      } else {
        this.minutesDifference = this.minutesWithBreakDifference;
      }

      let correctDate; let weekActivityBoolean;
      if (this.weekActivity === true) {
        correctDate = this.firstActivityForm.value.date;
        weekActivityBoolean = true;
      } else {
        weekActivityBoolean = false;
        correctDate = this.time.getCurrentIsoString();
      }

      const activityObject: firebaseActivity  = { 
        isoDateString: correctDate,
        clientName: this.firstActivityForm.value.clientName,
        location: this.firstActivityForm.value.location,
        startTime: this.thirdActivityForm.value.startTime,  
        endTime: this.thirdActivityForm.value.endTime,
        activities: this.secondActivityForm.value.activities,
        minutesDifference: this.minutesDifference
      };

      try {
        await this.time.saveActivity(activityObject, this.user, weekActivityBoolean);
        loading.dismiss().then(() => {
          this.layoutProvider.presentBottomToast('Klus toegevoegd aan werkbriefje.');
          setTimeout(() => {
            this.navCtrl.setRoot('timesheet');
          }, 1500);
        });
      } catch (e) {
        console.log(e);
        loading.dismiss().then(_ => {
          this.layoutProvider.presentBottomToast(e);
        });
      }
    }
  }  

  calculateBreak(startTime, endTime) {
    const minutesDifferenceBeforeBreak = this.time.calculateMinutesDifference(startTime, endTime);
    
    let alert = this.layoutProvider.alertCtrl.create({
      cssClass: 'category-prompt'
    });
    alert.setTitle('Hoe lang duurde je pauze?');

    alert.addInput({
      type: 'radio',
      label:'15 minuten pauze gehad',
      value:'15',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label:'30 minuten pauze gehad',
      value:'30'
    });

    alert.addInput({
      type: 'radio',
      label:'45 minuten pauze gehad',
      value:'45'
    })

    alert.addInput({
      type: 'radio',
      label:'Een uur pauze gehad',
      value:'60'
    })

    alert.addButton('Annuleer');
    alert.addButton({
      text: 'Bevestig pauze',
      handler: breakMinutes => {
        console.log('Minuten pauze: ', breakMinutes);
        this.usedBreak = true;
        this.minutesWithBreakDifference = (minutesDifferenceBeforeBreak - breakMinutes);
        console.log('Totaal ', this.minutesWithBreakDifference);
      }
    });
    alert.present();
  }
}
