import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  profileForm: FormGroup;
  profileImage: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
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

}
