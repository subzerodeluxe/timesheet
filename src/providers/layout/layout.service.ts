import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfig } from '../../app/app.config';
@Injectable()
export class LayoutProvider {

  constructor(public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController, public toastCtrl: ToastController, public sanitizer: DomSanitizer) {
  }

  showLoading() {
    const customSpinner: any = this.sanitizer.bypassSecurityTrustHtml(AppConfig.customSpinner);
   
    let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: customSpinner
      });
    return loading; 
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
