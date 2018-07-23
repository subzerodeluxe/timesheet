import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  loading: any;
  errorMessage: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public authProvider: AuthProvider) {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  goToSignup() {
    this.navCtrl.push('register');
  }

  regularLogin(value) {
    console.log(value);
    this.authProvider.regularLogin(value)
      .then(res => {
        console.log('Success!')
        this.navCtrl.setRoot('tabs');
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }
}
