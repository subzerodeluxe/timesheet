import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'page-add-activity',
  templateUrl: 'add-activity.html',
})
export class AddActivityPage {

  activityForm: FormGroup; 
  lastSlide = false;
  @ViewChild('slider') slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.activityForm = new FormGroup({
      title: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      from_date: new FormControl('2016-09-18', Validators.required),
      from_time: new FormControl('13:00', Validators.required),
      to_date: new FormControl('', Validators.required),
      to_time: new FormControl('', Validators.required)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddActivityPage');
  }

  onSlideChanged() {
    // If it's the last slide, then hide the 'Skip' button on the header
    this.lastSlide = this.slider.isEnd();
  }

  nextSlide() {
    // this.slider.lockSwipeToNext(true);
    this.slider.slideNext();
  }

  previousSlide() {
    this.slider.slidePrev();
  }

  onSubmit(values){
    console.log(values);
  }

}
