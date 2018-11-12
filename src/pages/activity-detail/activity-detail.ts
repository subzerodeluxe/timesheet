import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, Form } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public layout: LayoutProvider, public time: TimesheetProvider,
    public authProvider: AuthProvider, public formBuilder: FormBuilder) {

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


  deleteActivity() {
    console.log('Deleting activity');
      let alert = this.layout.alertCtrl.create({
        title: 'Verwijder',
        message: 'Weet je zeker dat je dit wilt verwijderen?',
        buttons: [
          {
            text: 'Nee',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
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
