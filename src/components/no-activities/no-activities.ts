import { Component, Input } from '@angular/core';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { Employee } from '../../models/employee.interface';

@Component({
  selector: 'no-activities',
  templateUrl: 'no-activities.html'
})
export class NoActivitiesComponent {

  isoString: string;
  @Input() authenticatedUser: Employee;
  
  constructor(public time: TimesheetProvider) {
    this.isoString = this.time.getCurrentIsoString();
  }
}
