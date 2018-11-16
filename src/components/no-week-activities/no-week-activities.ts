import { Component, Input } from '@angular/core';
import { Employee } from '../../models/employee.interface';
import { showNoActivitiesMessage } from '../../app/animations';

@Component({
  selector: 'no-week-activities',
  templateUrl: 'no-week-activities.html',
  animations: [
    showNoActivitiesMessage
  ]
})
export class NoWeekActivitiesComponent {

  @Input() authenticatedUser: Employee;

  constructor() {
    
  }

}
