import { Component } from '@angular/core';
import { NavController, NavParams, SegmentButton, LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-timesheets',
  templateUrl: 'timesheets.html',
})
export class TimesheetsPage {

  segment: string;
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.segment = "today";
    this.loading = this.loadingCtrl.create();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimesheetsPage');
    setTimeout(() => {  
      this.loading.dismiss();
    }, 3000);
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    console.log('Segment selected', segmentButton.value);
  }

}
