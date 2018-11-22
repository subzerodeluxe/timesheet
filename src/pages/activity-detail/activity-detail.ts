import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, Form } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { validation_messages } from '../../app/app.config';

@IonicPage({
  name: 'activity-detail'
})
@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
})
export class ActivityDetailPage {

  activityObject: any;
  clientName: string; 
  minutesDifference: number;
  minutesWithBreakDifference: number;
  validation_messages = validation_messages;
  usedBreak: boolean = false;
  update: boolean = true;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public layout: LayoutProvider, public time: TimesheetProvider,
    public authProvider: AuthProvider) {

    if (this.navParams.get("activity") != null) {
      this.clientName = this.navParams.get("activity").clientName; 
      this.activityObject = this.navParams.get("activity");
      this.update = true; 
    } else {
      this.clientName = 'Nieuwe klus';
      this.update = false;
    }
  }

  deleteActivity() {
    console.log('Deleting activity');
      
    let alert = this.layout.alertCtrl.create({
      cssClass: 'delete-prompt'
    });
    alert.setTitle('Verwijder klus');
    alert.setMessage('Weet je zeker dat je deze klus wilt verwijderen?');
    
    alert.addButton('Annuleer');
    alert.addButton({
      text: 'Ja, verwijder',
      handler: () => {
        this.time.deleteActivity(this.activityObject)
          .then(_ => {
            this.layout.presentBottomToast('Gelukt! De klus is verwijderd van je werkbriefje!');
            this.navCtrl.setRoot('timesheet');
          })
          .catch(e => {
            this.layout.presentBottomToast(e);
          })
        }
    });
    alert.present();
  }
}
