import { Component } from '@angular/core';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { loadHoursAnimation, infinitePulse } from '../../app/animations';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'weekly-footer-counter',
  templateUrl: 'weekly-footer-counter.html',
  animations: [
    loadHoursAnimation,
    infinitePulse,
  ]
})
export class WeeklyFooterCounterComponent {

  totalMinutes: number;
  state = 'small';
  totalMinutesSubscription: Subscription;

  constructor(private time: TimesheetProvider, public navCtrl: NavController, public layout: LayoutProvider) {
    this.time.totalWeekMinutesCounter.subscribe((minutes) => {
      this.totalMinutes = minutes;
    }); 
  }


  addNewActivity() {
    this.navCtrl.push('add-activity', { newWeekActivity: true});
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.state = 'big';
    }, 0);  
  }

  onEnd(event) {
    this.state = 'small';
    if (event.toState === 'small') {
      setTimeout(() => {
        this.state = 'big';
      }, 0);
    }
  }

  ngOnDestroy() {
    if (this.totalMinutesSubscription != null) {
      this.totalMinutesSubscription.unsubscribe();
    }
  }
}
