import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, Form } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { validation_messages } from '../../app/app.config';
import { firebaseActivity } from '../../models/activityLine.interface';

@IonicPage({
  name: 'activity-detail'
})
@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
})
export class ActivityDetailPage {

  activityObject: any;
  activityForm: FormGroup;
  minutesDifference: number;
  minutesWithBreakDifference: number;
  validation_messages = validation_messages;
  usedBreak: boolean = false; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public layout: LayoutProvider, public time: TimesheetProvider,
    public authProvider: AuthProvider, public formBuilder: FormBuilder) {

    this.activityObject = this.navParams.get("activity");

    this.activityForm = new FormGroup({
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
      startTime: new FormControl(),
      endTime: new FormControl()
      // activities: this.formBuilder.array([
      //   this.initActivityFields()
      // ])
    });  
  }

  // initActivityFields(): FormGroup {
  //   return this.formBuilder.group({
  //      name: ['', Validators.required]
  //   });
  // }

  async updateActivity(activityFormValue: any) {
      const loading = this.layout.showLoading();
      loading.present();

      
      if (this.usedBreak === false) {
        this.minutesDifference = this.time.calculateMinutesDifference(activityFormValue.startTime, activityFormValue.endTime);
      } else {
        this.minutesDifference = this.minutesWithBreakDifference;
      }
      
      console.log('Welke minuten worden gebruikt? ', this.minutesDifference);
     
      const updatedActivityObject: firebaseActivity  = { 
        clientName: activityFormValue.clientName,
        location: activityFormValue.location,
        startTime: activityFormValue.startTime,  
        endTime: activityFormValue.endTime,
        // activities: activityFormValue.value.activities,
        minutesDifference: this.minutesDifference
      };

      const result = await this.time.updateActivity(updatedActivityObject, this.activityObject.id); 
      if (result) {
        loading.dismiss().then(() => {
          this.layout.presentBottomToast('Activiteit succesvol bijgewerkt.');
          setTimeout(() => {
            this.navCtrl.setRoot('timesheet');
          }, 1500);
        });
      } else {
        loading.dismiss().then(_ => {
          this.layout.presentBottomToast('Er ging iets mis met bijwerken. Probeer het opnieuw.');
        });
      }
  }

  calculateBreak(startTime, endTime) {
    const minutesDifferenceBeforeBreak = this.time.calculateMinutesDifference(startTime, endTime);
    const transformedMinutes = this.time.transformMinutesToHours(minutesDifferenceBeforeBreak);

    console.log(minutesDifferenceBeforeBreak);
    let alert = this.layout.alertCtrl.create({
      title: 'Hoeveel minuten heb je pauze gehad?',
      message: `Je hebt zonder pauze ${transformedMinutes} gewerkt.`,
      inputs: [
        {
          type:'radio',
          label:'15 minuten pauze gehad',
          value:'15'
        },
        {
          type:'radio',
          label:'30 minuten pauze gehad',
          value:'30'
        },
        {
          type:'radio',
          label:'45 minuten pauze gehad',
          value:'45'
        },
        {
          type:'radio',
          label:'Een uur pauze gehad',
          value:'60'
        }
      ],
      buttons: [
        {
          text: 'Geen pauze gehad',
          role: 'cancel'
        },
        {
          text: 'Geef duur van pauze op',
          handler: breakMinutes => {
            console.log('Minuten pauze: ', breakMinutes);
            this.usedBreak = true;
            this.minutesWithBreakDifference = (minutesDifferenceBeforeBreak - breakMinutes);
            console.log('Totaal ', this.minutesWithBreakDifference);
          }
        }
      ]
    });
    alert.present();
  }
 
  deleteActivity() {
    console.log('Deleting activity');
      let alert = this.layout.alertCtrl.create({
        title: 'Verwijder',
        message: 'Weet je zeker dat je dit wilt verwijderen?',
        buttons: [
          {
            text: 'Nee',
            role: 'cancel'
          },
          {
            text: 'Ja, verwijder',
            handler: () => {
              console.log('Deleting activity');
              this.time.deleteActivity(this.activityObject)
                .then(_ => {
                  console.log('DELETED!');
                  this.layout.presentBottomToast('Activiteit verwijderd');
                  this.navCtrl.setRoot('timesheet');
                })
                .catch(e => {
                  this.layout.presentBottomToast(e);
                })
              }
          }
        ]
      });
    alert.present();
  }
}
