import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { UserProvider } from '../../providers/user/user.service';

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
    public authProvider: AuthProvider, public layout: LayoutProvider, public userService: UserProvider) {
      this.registerForm = new FormGroup({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      });
  }

  registerAccount(value) {
    this.authProvider.registerAccount(value)
      .then(_ => {
        this.userService.createUserProfile()
          .then(_ => {
            this.layout.presentBottomToast(`Je kunt nu inloggen met ${value.email}`);
            this.navCtrl.setRoot('login');
          }).catch(e => this.errorMessage = e.message);     
      }, err => {
        this.errorMessage = err.message; 
    }); 
  }
}

