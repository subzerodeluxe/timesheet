import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, SegmentButton, IonicPage } from 'ionic-angular';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { Employee } from '../../models/employee.interface';

@IonicPage({
  name: 'timesheet'
})
@Component({
  selector: 'page-timesheet',
  templateUrl: 'timesheet.html'
})
export class TimesheetPage implements OnDestroy {

  segment: string;
  subscription: Subscription;
  noActivities: boolean = true;
  timesheet: any;
  singleActivity: any; 
  convertedDates: any;
  userObject: Employee;
 
  constructor(public navCtrl: NavController, public navParams: NavParams, 
     public authProvider: AuthProvider, public userProvider: UserProvider, public layout: LayoutProvider, public time: TimesheetProvider) {
    this.segment = "today";
  }
  
  ionViewDidLoad() {
    this.layout.presentLoadingDefault();
    this.convertedDates = this.initDates();
    this.subscription = this.userProvider.getAuthenticatedUser()
      .subscribe(user => this.userObject = user);
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
  }


  onSegmentChanged(segmentButton: SegmentButton) {
    this.layout.presentLoadingDefault();
    this.convertedDates = this.initDates();
    console.log('Segment changed', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    console.log('Segment selected', segmentButton.value);
  }

  addNewActivity() {
    this.navCtrl.push('add-activity');
  }

  openActivity(activity) {
    let loading = this.layout.showLoading();
    loading.present();

    setTimeout(() => {
      this.navCtrl.push('activity-detail', { activity: activity })
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // presentLoadingDefault() {
  //   let loading = this.layout.showLoading();
  
  //   loading.present();
  
  //   setTimeout(() => {
  //     loading.dismiss();
  //   }, 1500);
  // }
}
