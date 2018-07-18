import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, SegmentButton, LoadingController } from 'ionic-angular';
import { TimesheetProvider } from '../../providers/timesheet/timesheet';
import { TimeSheet } from '../../models/timesheet.interface';

@Component({
  selector: 'page-timesheet',
  templateUrl: 'timesheet.html',
})
export class TimesheetPage {

  segment: string;
  timesheet: any;
  weekNumber: string;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public loadingCtrl: LoadingController, public time: TimesheetProvider) {
    this.segment = "today";
    this.loading = this.loadingCtrl.create();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TimesheetsPage');
    this.weekNumber = this.time.getCurrentWeekNumber().toString();
    
     this.time.getData()
      .subscribe(
        (res) => {
        console.log('Binnengekomen data ', res);
        this.timesheet = res;
        this.loading.dismiss();
      })
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    console.log('Segment selected', segmentButton.value);
  }


}
