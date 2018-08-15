import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, SegmentButton, IonicPage } from 'ionic-angular';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { Employee } from '../../models/employee.interface';
import { infinitePulse } from '../../app/animations';

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
  timesheet: any;
  singleActivity: any; 
  isoString: string;
  userObject: Employee;
  state = 'small';
 
  constructor(public navCtrl: NavController, public navParams: NavParams, 
     public authProvider: AuthProvider, public userProvider: UserProvider, public layout: LayoutProvider, public time: TimesheetProvider) {
    this.segment = "today";
    this.isoString = this.time.getCurrentIsoString();
  }
  
  ionViewDidLoad() {
    this.noActivities = true;
    this.layout.presentLoadingDefault();
    setTimeout(() => {
      this.state = 'big';
    }, 0);
    this.subscription = this.userProvider.getAuthenticatedUserProfile()
      .subscribe(user => {
        console.log(user); 
        this.userObject = user
      });   /// VERPLAATSEN NAAR SERVICE?
  }

  onEnd(event) {
    this.state = 'small';
    if (event.toState === 'small') {
      setTimeout(() => {
        this.state = 'big';
      }, 0);
    }
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    this.layout.presentLoadingDefault();
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
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }
}
