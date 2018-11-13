import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, SegmentButton, IonicPage } from 'ionic-angular';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { Employee } from '../../models/employee.interface';
import { infinitePulse } from '../../app/animations';
import { Observable } from 'rxjs/Observable';

// Gebruik animaties voor het laden van de activities in timesheet: https://www.youtube.com/watch?v=ra5qNKNc95U
@IonicPage({
  name: 'timesheet'
})
@Component({
  selector: 'page-timesheet',
  templateUrl: 'timesheet.html',
  animations: [
    infinitePulse
  ]
})
export class TimesheetPage implements OnDestroy {
  
  segment: string;
  subscription: Subscription;
  noActivities: boolean = true;
  isoString: string;
  userObject: Employee;
  state = 'small';
  activities: any;
  weekActivities$: Observable<any>;
  totalMinutes: string;
 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authProvider: AuthProvider, public userProvider: UserProvider, public layout: LayoutProvider, public time: TimesheetProvider) {
    this.segment = "today";
    this.isoString = this.time.getCurrentIsoString();

    this.subscription = this.userProvider.getAuthenticatedUserProfile()
      .subscribe(user => {
        this.userObject = user;
        this.weekActivities$ = this.time.findAllWeekActivitiesByUser(this.userObject);
        this.time.findAllDailyActivitiesByUser(this.userObject).subscribe(activities => {
          if (activities.length === 0) {
            this.noActivities = true;
            this.time.storage.set('totalMinutes', 0); 
            console.log('Week activities: ', activities.length);
          } else {
            this.noActivities = false;
            this.activities = activities;
            console.log('Week activities: ', activities.length);
          }
        });
      }); 
      
    this.time.totalMinutesCounter.subscribe((minutes) => {
      this.totalMinutes = minutes;
      console.log('Counter says: ', this.totalMinutes);
    });
  }
  
  ionViewDidLoad() {
    this.layout.presentLoadingDefault();
    setTimeout(() => {
      this.state = 'big';
    }, 0);  
  }

  callTestFunction() {
    console.log('Call the function');
  }

  onEnd(event) {
    this.state = 'smalls';
    if (event.toState === 'small') {
      setTimeout(() => {
        this.state = 'big';
      }, 0);
    }
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    // this.layout.presentLoadingDefault();
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    // LATEN STAAN
  }

  addNewActivity() {
    this.navCtrl.push('add-activity', { userObject: this.userObject });
  }

  openActivity(activity) {
    let loading = this.layout.showLoading();
    loading.present();

    setTimeout(() => {
      console.log('Being pushed: ', activity); 
      this.navCtrl.push('activity-detail', { activity: activity })
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 1500);
  }

  ngOnDestroy() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }
}
