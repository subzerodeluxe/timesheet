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
  totalHours: number;
  validation_messages = validation_messages;

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

      const firebaseMinutesDifference = this.time.calculateMinutesDifference(activityFormValue.startTime, activityFormValue.endTime);

      const updatedActivityObject: firebaseActivity  = { 
        clientName: activityFormValue.clientName,
        location: activityFormValue.location,
        startTime: activityFormValue.startTime,  
        endTime: activityFormValue.endTime,
        // activities: activityFormValue.value.activities,
        minutesDifference: firebaseMinutesDifference
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

  calculateHours(startTime, endTime) {
    const firebaseHoursDifference = this.time.calculateMinutesDifference(startTime, endTime);
    const hoursDifferenceBeforeBreak = this.calculateHoursDifference(firebaseHoursDifference);

    console.log(hoursDifferenceBeforeBreak);
    let alert = this.layout.alertCtrl.create({
      title: 'Hoeveel minuten heb je pauze gehad?',
      message: `Je hebt zonder pauze ${hoursDifferenceBeforeBreak} gewerkt.`,
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
          handler: minutes => {
            console.log(minutes);

            console.log('Firebase hours: ', firebaseHoursDifference);
            const minutesAsInt = parseInt(this.reverseCheck(minutes));
            const hoursDifference = (firebaseHoursDifference - minutesAsInt);
            console.log('Final break difference ', hoursDifference);
              // Aantal minute pauze moet af van huidig totaal
              //console.log('Huidig totaal ', hoursDifferenceBeforeBreak);
              //const hoursWithBreakDifference = (hoursDifferenceBeforeBreak - minutes);
              //console.log('New hours: ', hoursWithBreakDifference);
          }
        }
      ]
    });
    alert.present();
  }

  calculateHoursDifference(hours) {
    console.log('Incoming hours, ', hours); 
    let str = hours.toString();
    let newHours;
    if (str.length === 1) {
      newHours = hours.toString() + ' uur';
    } else {
      let f = str.substr(2);
      let hours = str.substr(0,1);
      let min = this.check(f);   // 15 
      let final = hours + ' uur ' + 'en ' + min + ' minuten';
      newHours = final;
    }

    return newHours;
  }

  check(hrString): string {
 
    switch(hrString) { 
      case '25': { 
         hrString = '15';
         break; 
      } 
      case '5': { 
        hrString = '30'; 
         break; 
      } 
      case '75': { 
        hrString = '45';
        break; 
     } 
      default: { 
         hrString = 'Error'; 
         break; 
      } 
    } 
    return hrString; 
  }

  reverseCheck(hrString): string {
 
    switch(hrString) { 
      case '15': { 
         hrString = '25';
         break; 
      } 
      case '30': { 
        hrString = '5'; 
         break; 
      } 
      case '45': { 
        hrString = '75';
        break; 
      }
      case '60': { 
        hrString = '00';
        break; 
     }  
      default: { 
         hrString = 'Error'; 
         break; 
      } 
    } 
    return hrString; 
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
