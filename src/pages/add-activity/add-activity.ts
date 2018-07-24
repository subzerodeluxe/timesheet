import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, IonicPage } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';

@IonicPage({
  name: 'add-activity'
})
@Component({
  selector: 'page-add-activity',
  templateUrl: 'add-activity.html',
})
export class AddActivityPage {

  firstActivityForm: FormGroup; 
  secondActivityForm: FormGroup;
  lastSlide = false;
  @ViewChild('slider') slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public formBuilder: FormBuilder, public authProvider: AuthProvider, public layoutProvider: LayoutProvider) {

    this.firstActivityForm = new FormGroup({
      clientName: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(4),
        Validators.required
        ])),
      location: new FormControl('', Validators.required)
    });

    this.secondActivityForm = this.formBuilder.group({
      activities: this.formBuilder.array([
         this.initActivityFields()
      ])
   });
  }

  ionViewCanEnter() {
    return this.authProvider.authenticated();
  }


  initActivityFields(): FormGroup {
   return this.formBuilder.group({
      name: ['', Validators.required]
   });
  }

  addNewInputField(): void {
   const control = <FormArray>this.secondActivityForm.controls.activities;
   control.push(this.initActivityFields());
  }

  removeInputField(i: number): void {
   const control = <FormArray>this.secondActivityForm.controls.activities;
   control.removeAt(i);
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
      // boodschap: niet alle velden zijn (correct) ingevuld!
      this.layoutProvider.presentBottomToast('Niet alle velden zijn (correct) ingevuld!')
    }
    else if(!this.secondActivityForm.valid){
        this.slider.slideTo(1);
        this.layoutProvider.presentBottomToast('Niet alle velden zijn (correct) ingevuld!')
      }
    else {
        console.log("success!")
        console.log(this.firstActivityForm.value);
        console.log(this.secondActivityForm.value);
        this.layoutProvider.presentBottomToast('Success!')
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
