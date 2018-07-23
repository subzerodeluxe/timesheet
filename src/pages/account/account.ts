import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage({
  name: 'account'
})
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  profileForm: FormGroup;
  profileImage: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider) {
    
    this.profileForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      licensePlate: new FormControl(),
      mileage: new FormControl()
    });
  }

  ionViewDidLoad() {
    this.profileImage = './assets/images/amerongen-schilderwerken.jpg';
    console.log('ionViewDidLoad AccountPage');
  }

  ionViewCanEnter() {
    return this.authProvider.authenticated();
  }

  logOut(): void {
    this.authProvider.logOut()
    .then(res => {
      console.log('Success!');
      this.navCtrl.setRoot('login');
      }, err => {
      console.log(err);
    });
  }
}

