import { Component } from '@angular/core';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'daily-footer-counter',
  templateUrl: 'daily-footer-counter.html'
})
export class DailyFooterCounterComponent {

  totalMinutes: number;
  totalMinutesSubscription: Subscription;

  constructor(private time: TimesheetProvider) {
    this.time.totalDailyMinutesCounter.subscribe((minutes) => {
      this.totalMinutes = minutes;
    });
  }

  ngOnDestroy() {
    if (this.totalMinutesSubscription != null) {
      this.totalMinutesSubscription.unsubscribe();
    }
  }

}
