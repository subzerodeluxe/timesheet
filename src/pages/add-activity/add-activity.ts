import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'page-add-activity',
  templateUrl: 'add-activity.html',
})
export class AddActivityPage {

  firstActivityForm: FormGroup; 
  secondActivityForm: FormGroup;
  lastSlide = false;
  @ViewChild('slider') slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.firstActivityForm = new FormGroup({
      clientName: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(4),
        Validators.required
      ])),
      location: new FormControl('', Validators.required)
      // from_date: new FormControl('2016-09-18', Validators.required),
      // from_time: new FormControl('13:00', Validators.required),
      // to_date: new FormControl('', Validators.required),
      // to_time: new FormControl('', Validators.required)
    });

    this.secondActivityForm = new FormGroup({
      date: new FormControl('2016-09-18', Validators.required),
      // from_time: new FormControl('13:00', Validators.required),
    })
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

  save() {
    if(!this.firstActivityForm.valid){
      this.slider.slideTo(0);
    }
    else if(!this.secondActivityForm.valid){
        this.slider.slideTo(1);
    }
    else {
        console.log("success!")
        console.log(this.firstActivityForm.value);
        console.log(this.secondActivityForm.value);
    }
  }

  validation_messages = {
    'clientName': [
      { type: 'required', message: 'Dit is een verplicht veld.' },
      { type: 'minlength', message: 'Veld moet minimaal 4 tekens bevatten.' },
      { type: 'maxlength', message: 'Veld mag niet langer zijn dan 25 tekens.' }
    ],
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'lastname': [
      { type: 'required', message: 'Last name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'phone': [
      { type: 'required', message: 'Phone is required.' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions.' }
    ],
  };


}
