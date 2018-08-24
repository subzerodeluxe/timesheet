import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { UserProvider } from '../../providers/user/user.service';
import { Employee } from '../../models/employee.interface';
import { PasswordValidator } from '../../components/validators/password.validator';
import { validation_messages } from '../../app/app.config';

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
  matching_passwords_group: FormGroup;
  validation_messages = validation_messages;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public authProvider: AuthProvider, public layout: LayoutProvider, public userService: UserProvider) {

  }

  ionViewWillLoad() {
    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
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
      matching_passwords: this.matching_passwords_group
    });
  }

  async registerAccount(value: Employee) {
    this.layout.presentLoadingDefault(); 
    this.errorMessage = '';
    const result = await this.authProvider.registerAccount(value);
    console.log('Het resultaat: ', result);
    if (result === 'success') {
      this.layout.presentBottomToast(`Gelukt! Je kunt nu inloggen met ${value.email}`);
      this.navCtrl.setRoot('login');  
    } else {
      this.errorMessage = result;
      this.layout.presentBottomToast('Er ging iets niet goed. Probeer het opnieuw.');
    }
  }
}

