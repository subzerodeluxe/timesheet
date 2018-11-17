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
  clientName: string; 
  activityForm: FormGroup;
  minutesDifference: number;
  minutesWithBreakDifference: number;
  validation_messages = validation_messages;
  usedBreak: boolean = false;
  update: boolean = true;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public layout: LayoutProvider, public time: TimesheetProvider,
    public authProvider: AuthProvider, public formBuilder: FormBuilder) {

    if (this.navParams.get("activity") != null) {
      this.clientName = this.navParams.get("activity").clientName; 
      this.update = true; 
    } else {
      this.clientName = 'Nieuwe klus';
      this.update = false;
    }
  }
}
