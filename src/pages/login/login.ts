import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { UserProvider } from '../../providers/user/user.service';
import { User } from 'firebase/app';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvder: UserProvider,
  public authProvider: AuthProvider, public layout: LayoutProvider) {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.loading = this.layout.showLoading();
  }

  goToSignup() {
    this.navCtrl.push('register');
  }

  regularLogin(value) {
    this.loading.present();

    this.authProvider.regularLogin(value)
      .then(() => {
        this.userProvder.getAuthenticatedUserProfile()
          .subscribe(profile => {
            if (profile.firstName != null) {
              this.loading.dismiss();
              this.layout.presentTopToast(`Welkom terug, ${profile.firstName}`);
              this.navCtrl.setRoot('tabs');
            } else {
              this.loading.dismiss();
              this.navCtrl.setRoot('account');
            }
          });
      }, err => {
        this.loading.dismiss();
        this.errorMessage = err.message;
      });
  }
}
