import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

@Injectable()
export class LayoutProvider {

  constructor(public alertCtrl: AlertController, public toastCtrl: ToastController) {
   
  }

  showAlertMessage(title, message, buttonText) {
    console.log(message);
    let alert = this.alertCtrl.create({
        title: title,
        subTitle: message,
        buttons: [buttonText]
    });
    return alert; 
  }

  presentBottomToast(text) {
      let toast = this.toastCtrl.create({
          message: text,
          duration: 3000,
          position: 'bottom'
          });
      toast.present();
  }

    presentTopToast(text) {
      let toast = this.toastCtrl.create({
          message: text,
          duration: 3000,
          position: 'top'
          });
      toast.present();
  }

}
