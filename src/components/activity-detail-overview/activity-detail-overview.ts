import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'activity-detail-overview',
  templateUrl: 'activity-detail-overview.html'
})
export class ActivityDetailOverviewComponent {

  activityObject: any;
  noActivityObject: boolean = false; 
  constructor(public navParams: NavParams) {
 
    if (this.navParams.get("activity") != null) {
      this.activityObject = this.navParams.get("activity");
      console.log('Activity object: ', this.activityObject);
    } else {
      this.noActivityObject = true;
    }
    
    
  }

}
