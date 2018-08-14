import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from '../../../node_modules/rxjs/Subscription';

@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnDestroy {

  loginForm: FormGroup;
  errorMessage: string = '';
  userSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider,
  public authProvider: AuthProvider, public layout: LayoutProvider) {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  goToSignup() {
    this.navCtrl.push('register');
  }

  async regularLogin(value: any) {
    this.layout.presentLoadingDefault(); 
    this.errorMessage = '';
    const result = await this.authProvider.regularLogin(value);
    console.log('Het resultaat: ', result);
    if (result === 'success') {
      this.userSubscription = this.userProvider.getAuthenticatedUserProfile()
        .subscribe(profile => {
          if (profile.firstName != null) {
            this.layout.presentTopToast(`Welkom terug, ${profile.firstName}`);
            this.navCtrl.setRoot('tabs');
          } else {
            this.navCtrl.setRoot('account');
          }
        }, err => {
          this.errorMessage = err.message;
        });
    } else {
      this.errorMessage = result;
      this.layout.presentBottomToast('Er ging iets niet goed. Probeer het opnieuw.');
    }
  }

  ngOnDestroy() {
    if (this.userSubscription != null) {
      this.userSubscription.unsubscribe();
    }
  }
}
