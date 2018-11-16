import { Component } from '@angular/core';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { loadHoursAnimation } from '../../app/animations';


@Component({
  selector: 'weekly-footer-counter',
  templateUrl: 'weekly-footer-counter.html',
  animations: [
    loadHoursAnimation
  ]
})
export class WeeklyFooterCounterComponent {

  totalMinutes: number;

  constructor(private time: TimesheetProvider) {
    this.time.totalWeekMinutesCounter.subscribe((minutes) => {
      this.totalMinutes = minutes;
    });
  }

}
