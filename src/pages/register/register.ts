import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LayoutProvider } from '../../providers/layout/layout.service';

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
    public authProvider: AuthProvider, public layout: LayoutProvider) {
      this.registerForm = new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
  }

  registerAccount(value) {
    this.authProvider.registerAccount(value)
      .then(_ => {
        this.layout.presentBottomToast(`Je kunt nu inloggen met ${value.email}`);
        this.navCtrl.setRoot('login');
      }, err => {
        this.errorMessage = err.message; 
    }); 
  }
}

