import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

@IonicPage({
  name: 'activity-detail'
})
@Component({
  selector: 'page-activity-detail',
  templateUrl: 'activity-detail.html',
})
export class ActivityDetailPage {

  activityObject: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.activityObject = this.navParams.get("activity");
    console.log('Activity object: ', this.activityObject);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivityDetailPage');
  }

}