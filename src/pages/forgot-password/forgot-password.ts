import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validation_messages } from '../../app/app.config';

@IonicPage({
  name: 'forgot-password'
})
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  forgotPasswordForm: FormGroup;
  validation_messages = validation_messages;

  constructor(public authProvider: AuthProvider, public layout: LayoutProvider) {
  }

  ionViewWillLoad() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  forgotPassword(value: any) {
    this.authProvider.resetPassword(value.email)
      .then(_ => this.layout.presentBottomToast('Volg de aanwijzingen in de email om je wachtwoord te veranderen.'))
      .catch(e => this.layout.presentBottomToast('Er ging iets niet goed. Probeer het opnieuw.'))
  }


}
