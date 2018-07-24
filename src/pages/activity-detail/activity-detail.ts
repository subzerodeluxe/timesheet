import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';

@IonicPage({
  name: 'activity-detail'
})
@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
})
export class ActivityDetailPage {

  activityObject: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider) {

    this.activityObject = this.navParams.get("activity");
    console.log('Activity object: ', this.activityObject);
  }

  ionViewCanEnter() {
    return this.authProvider.authenticated();
  }
}
