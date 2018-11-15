import { Component } from '@angular/core';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';


@Component({
  selector: 'weekly-footer-counter',
  templateUrl: 'weekly-footer-counter.html'
})
export class WeeklyFooterCounterComponent {

  totalMinutes: number;

  constructor(private time: TimesheetProvider) {
    this.time.totalWeekMinutesCounter.subscribe((minutes) => {
      this.totalMinutes = minutes;
    });
  }

}
