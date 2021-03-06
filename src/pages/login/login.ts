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
  screenSubscription: Subscription;
  smallScreen: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider,
  public authProvider: AuthProvider, public layout: LayoutProvider) {
  }

  ionViewWillLoad() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.screenSubscription = this.layout.smallScreen.subscribe((smallScreen: boolean) => {
      this.smallScreen = smallScreen; 
    })
  }

  goToSignup() {
    this.navCtrl.push('register');
  }

  forgotPassword() {
    this.navCtrl.push('forgot-password');
  }

  async regularLogin(value: any) {
    this.layout.presentLoadingLoggin(); 
    this.errorMessage = '';
    const result = await this.authProvider.regularLogin(value);
    if (result === 'success') {
      this.userSubscription = this.userProvider.getAuthenticatedUserProfile()
        .subscribe(profile => {
          if (profile.firstName != null) {
            this.layout.presentTopToast(`Welkom terug, ${profile.firstName}`);
            this.navCtrl.setRoot('tabs');   
          } else {
            const welcomeAlert = this.layout.showAlertMessage('Vul je gegevens aan', 'Je profiel is nog niet compleet.', 'Ik snap het');
            welcomeAlert.present();
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

  ionViewWillUnload() {
    if (this.screenSubscription != null) {
      this.screenSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    if (this.userSubscription != null) {
      this.userSubscription.unsubscribe();
    }
  }
}
