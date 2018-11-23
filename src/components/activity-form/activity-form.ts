import { Component } from '@angular/core';
import { firebaseActivity } from '../../models/activityLine.interface';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth.service';
import { NavController, NavParams } from 'ionic-angular';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { validation_messages } from '../../app/app.config';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'activity-form',
  templateUrl: 'activity-form.html'
})
export class ActivityFormComponent {

  activityObject: any;
  updateActivityForm: FormGroup;
  minutesDifference: number;
  minutesWithBreakDifference: number;
  userSubscription: Subscription;
  validation_messages = validation_messages;
  usedBreak: boolean = false; 
  update: boolean = true;
  timeObject: any;
  user: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, 
    public layout: LayoutProvider, public time: TimesheetProvider,
    public authProvider: AuthProvider, public formBuilder: FormBuilder) {
    
      this.timeObject = this.time.calculateDateRange();

      if (this.navParams.get("activity") != null) {
        this.activityObject = this.navParams.get("activity");
        this.update = true;
        console.log(this.activityObject);
      } else {
        this.update = false;
        console.log('Dit is een nieuwe activiteit');
      }

    this.userSubscription = this.userProvider.getAuthenticatedUserProfile()
      .subscribe(user => {
        this.user = user;
    });

    this.initUpdateActivityForm();

      
  }

  initUpdateActivityForm() {
    this.updateActivityForm = new FormGroup({
      clientName: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(4),
        Validators.required
        ])),
      location: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(4),
        Validators.required
      ])),
      startTime: new FormControl('06:30', Validators.required),
      endTime: new FormControl('16:00', Validators.required)
    });
  }

  initActivityFields(): FormGroup {
    return this.formBuilder.group({
       name: ['', Validators.required]
    });
  }

  performChange(activityFormValue: any, update: boolean) {
    if (update === true) {
      this.updateActivity(activityFormValue);
    } else {
      // this.calculateBreak(this.updateActivityForm.value.startTime, this.updateActivityForm.value.endTime);
      // this.saveActivity(activityFormValue);
    }
  }



  async updateActivity(activityFormValue: any) {
     
    const loading = this.layout.showLoading();
        loading.present();

      if (this.usedBreak === false) {
        this.minutesDifference = this.time.calculateMinutesDifference(activityFormValue.startTime, activityFormValue.endTime);
      } else {
        this.minutesDifference = this.minutesWithBreakDifference;
      }

      const updatedActivityObject: firebaseActivity  = { 
        clientName: activityFormValue.clientName,
        location: activityFormValue.location,
        startTime: activityFormValue.startTime,  
        endTime: activityFormValue.endTime,
        // activities: activityFormValue.value.activities,
        minutesDifference: this.minutesDifference
      };

      try {
        await this.time.updateActivity(updatedActivityObject, this.activityObject.id); 
        loading.dismiss().then(() => {
          this.layout.presentBottomToast('Klus succesvol bijgewerkt.');
          setTimeout(() => {
            this.navCtrl.setRoot('timesheet');
          }, 1500);
        });
      } catch (error) {
        loading.dismiss().then(_ => {
          this.layout.presentBottomToast('Er ging iets mis met bijwerken. Probeer het opnieuw.');
        });
    }
  }

  calculateBreak(startTime, endTime) {
    const minutesDifferenceBeforeBreak = this.time.calculateMinutesDifference(startTime, endTime);
    
    let alert = this.layout.alertCtrl.create({
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

  ngOnDestroy() {
    if (this.userSubscription != null) {
      this.userSubscription.unsubscribe();
    }
  }
}