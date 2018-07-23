import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, SegmentButton, LoadingController, IonicPage } from 'ionic-angular';
import { TimesheetProvider } from '../../providers/timesheet/timesheet';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage({
  name: 'timesheet'
})
@Component({
  selector: 'page-timesheet',
  templateUrl: 'timesheet.html',
})
export class TimesheetPage {

  segment: string;
  timesheet: any;
  singleActivity: any; 
  weekNumber: string;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public loadingCtrl: LoadingController, public authProvider: AuthProvider, public time: TimesheetProvider) {
    this.segment = "today";
    this.loading = this.loadingCtrl.create();
  }
  
  ionViewDidLoad() {
    this.weekNumber = this.time.getCurrentWeekNumber().toString();
    console.log('Weeknummer: ', this.weekNumber);
    
    // this.timesheet = this.time.getData();
     this.time.getData()
      .subscribe(
        (res) => {
        console.log('Binnengekomen data ', res);
        this.timesheet = res;
        this.singleActivity = res.dateLines[0];
        console.log('Single: ', this.singleActivity);
        this.loading.dismiss();
      });
  }

  ionViewCanEnter() {
    return this.authProvider.authenticated();
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    console.log('Segment selected', segmentButton.value);
  }

  addNewActivity() {
    this.navCtrl.push('add-activity');
  }

  openActivity(activity) {
    this.navCtrl.push('activity-detail', { activity: activity });
  }


}
