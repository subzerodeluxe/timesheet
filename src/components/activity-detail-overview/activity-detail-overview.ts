import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'activity-detail-overview',
  templateUrl: 'activity-detail-overview.html'
})
export class ActivityDetailOverviewComponent {

  activityObject: any;
  smallScreenSubscription: Subscription;
  noActivityObject: boolean = false; 
  smallScreen: boolean = true;
  constructor(public navParams: NavParams, private layout: LayoutProvider) {
 
    if (this.navParams.get("activity") != null) {
      this.activityObject = this.navParams.get("activity");
    } else {
      this.noActivityObject = true;
    }

    this.smallScreenSubscription = this.layout.smallScreen.subscribe((smallScreen: boolean) => {
      this.smallScreen = smallScreen;
    });
  }

  ionViewWillUnload() {
    if (this.smallScreenSubscription != null) {
      this.smallScreenSubscription.unsubscribe();
    }
  }

}
