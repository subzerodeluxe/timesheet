import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

@Component({
  selector: 'car-input',
  templateUrl: 'car-input.html'
})
export class CarInputComponent {

  carChoice: string;

  constructor(public params: NavParams, private navCtrl: NavController) {
    this.carChoice = params.get('carChoice');

   console.log("Dit is meegekomen " + this.carChoice);
  }

  closeModal() {
    //this.viewCtrl.dismiss();
    this.navCtrl.setRoot('tabs'); 
  }

}
