import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { LayoutProvider } from '../../providers/layout/layout.service';

@Component({
  selector: 'activity-detail-overview',
  templateUrl: 'activity-detail-overview.html'
})
export class ActivityDetailOverviewComponent {

  activityObject: any;
  browser: boolean; 
  noActivityObject: boolean = false; 
  constructor(public navParams: NavParams, private layout: LayoutProvider) {
 
    if (this.navParams.get("activity") != null) {
      this.activityObject = this.navParams.get("activity");
    } else {
      this.noActivityObject = true;
    }

    this.browser = this.layout.checkBrowser(); 
    
  }

}
