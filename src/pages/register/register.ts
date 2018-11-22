import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { UserProvider } from '../../providers/user/user.service';
import { PasswordValidator } from '../../components/validators/password.validator';
import { validation_messages } from '../../app/app.config';
import { Subscription } from 'rxjs';
import { PrivacyPolicyComponent } from '../../components/privacy-policy/privacy-policy';

@IonicPage({
  name: 'register'
})
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  registerForm: FormGroup;
  forgotPasswordForm: FormGroup;
  loading: any;
  errorMessage: string = '';
  matching_passwords_group: FormGroup;
  validation_messages = validation_messages;
  userSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController,
    public authProvider: AuthProvider, public layout: LayoutProvider, public userService: UserProvider) {

  }

  ionViewWillLoad() {
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    this.registerForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      matching_passwords: this.matching_passwords_group,
      terms: new FormControl(true, Validators.pattern('true'))
    });
  }

  async registerAccount(value: any) {
    this.layout.presentLoadingDefault(); 
    this.errorMessage = '';
    const result = await this.authProvider.registerAccount(value);

    if (result === 'success') {
      this.userSubscription = this.userService.getAuthenticatedUserProfile()
        .subscribe(profile => {
          if (profile.firstName != null) {
            this.layout.presentBottomToast(`Gelukt! Je wordt nu ingelogd met ${value.email}`);
            this.navCtrl.setRoot('tabs');   
          } else {
            this.layout.presentBottomToast(`Gelukt! Je wordt nu ingelogd met ${value.email}`);
            setTimeout(() => {
              const welcomeAlert = this.layout.showAlertMessage('Vul je gegevens aan', 'Je profiel is nog niet compleet. Deze gegevens komen terug op je werkbriefje. Het is dus belangrijk dat je ze goed invuld.', 'Ik snap het');
              welcomeAlert.present();
              this.navCtrl.setRoot('account');
            }, 1500);
          }
        }, err => {
          this.errorMessage = err.message;
        });
  
    } else {
      this.errorMessage = result;
      this.layout.presentBottomToast('Er ging iets niet goed. Probeer het opnieuw.');
    }
  }

  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyComponent);
    modal.present();
  }

  ngOnDestroy() {
    if (this.userSubscription != null) {
      this.userSubscription.unsubscribe();
    }
  }
}
