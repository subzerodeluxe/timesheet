import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, SegmentButton, IonicPage } from 'ionic-angular';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@IonicPage({
  name: 'timesheet'
})
@Component({
  selector: 'page-timesheet',
  templateUrl: 'timesheet.html',
  animations: [
    trigger('shakeButton', [
      state('small', style({
        transform: 'scale(1)',
      })),
      state('large', style({
          transform: 'scale(1.02)',
      })),
      transition('small => large', animate('100ms ease-in')),
      transition('large => small', animate('100ms ease-in'))
    ])
  ]
})
export class TimesheetPage {

  segment: string;
  state: string = 'small';
  noActivities: boolean = true;
  timesheet: any;
  singleActivity: any; 
  shakeButton: boolean = true; 
  convertedDates: any;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
     public authProvider: AuthProvider, public layout: LayoutProvider, public time: TimesheetProvider) {
    this.segment = "today";
    this.loading = this.layout.showLoading();
  }
  
  ionViewDidLoad() {
    this.loading.present();
    this.convertedDates = this.initDates();
    this.time.createTimesheet()
      .then((result) => {
        console.log('Gelukt!', result);
        this.loading.dismiss();
      }).catch(e => console.log(e)); 
  }

  initDates() {
    const weekNumber = this.time.getCurrentWeekNumber();
    const currentDayNumber = this.time.getCurrentDayNumber();
    const currentMonth = this.time.getCurrentMonth();
    const currentYear = this.time.getCurrentYear();
    const isoString = this.time.getCurrentIsoString();
    

    let correctDates = {};
    return correctDates = { weekNumber: weekNumber, currentMonth: currentMonth, 
      currentDayNumber: currentDayNumber, currentYear: currentYear, isoString: isoString };
    
    // console.log('Weeknummer: ', this.weekNumber);
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
    this.loading.present();
    this.navCtrl.push('activity-detail', { activity: activity })
      .then(() => {
        this.loading.dismiss();
      }).catch(() => this.loading.dismiss());
  }


}
