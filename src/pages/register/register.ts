import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { UserProvider } from '../../providers/user/user.service';
import { Employee } from '../../models/employee.interface';

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

