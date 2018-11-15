import { Component } from '@angular/core';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';

@Component({
  selector: 'daily-footer-counter',
  templateUrl: 'daily-footer-counter.html'
})
export class DailyFooterCounterComponent {

  totalMinutes: number;

  constructor(private time: TimesheetProvider) {
    this.time.totalDailyMinutesCounter.subscribe((minutes) => {
      this.totalMinutes = minutes;
    });
  }

}
