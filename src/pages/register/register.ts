import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@IonicPage({
  name: 'register'
})
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  registerForm: FormGroup;
  loading: any;
  errorMessage: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public authProvider: AuthProvider) {
      this.registerForm = new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  registerAccount(value) {
    this.authProvider.registerAccount(value)
      .then(res => {
        console.log('Success!');
        this.navCtrl.setRoot('tabs');
      }, err => {
        console.log(err);
        this.errorMessage = err.message; 
      })
  }

}
