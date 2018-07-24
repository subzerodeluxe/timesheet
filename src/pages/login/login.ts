import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';

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
  public authProvider: AuthProvider, public layout: LayoutProvider) {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  goToSignup() {
    this.navCtrl.push('register');
  }

  regularLogin(value) {
    console.log('Login object: ', value);
    this.authProvider.regularLogin(value)
      .then(res => {
        this.layout.presentBottomToast(`Welkom ${value.email}`);
        this.navCtrl.setRoot('tabs');
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }

  doGoogleLogin(value) {
    this.authProvider.googleLogin();
  } 
}
