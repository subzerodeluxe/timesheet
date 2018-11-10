import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, Form } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, public formBuilder: FormBuilder) {

    this.activityObject = this.navParams.get("activity");

    this.activityForm = new FormGroup({
      clientName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      location: new FormControl('', Validators.compose([
        Validators.required
      ])),
      startTime: new FormControl(),
      endTime: new FormControl(),
      activities: this.formBuilder.array([
        this.initActivityFields()
     ])
    });
  }

  initActivityFields(): FormGroup {
    return this.formBuilder.group({
       name: ['', Validators.required]
    });
   }


}
