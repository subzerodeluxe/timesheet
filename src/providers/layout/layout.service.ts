import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController, PopoverController, Platform } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfig } from '../../app/app.config';
@Injectable()
export class LayoutProvider {

  constructor(public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController, public platform: Platform, public toastCtrl: ToastController, 
    public sanitizer: DomSanitizer, public popOver: PopoverController) {
  }

  public checkBrowser(): boolean {
    let browser;
    if (this.platform.is('cordova') === false) {
      browser = true; 
    } else {
      browser = false; 
    }
    return browser;
  }

  public checkScreenWidth(): any {
    this.platform.ready().then(_ => {
      const dimensions = {
        height: this.platform.height(),
        width: this.platform.width()
      };

      return dimensions;
    });
  }

  showLoading() {
    const customSpinner: any = this.sanitizer.bypassSecurityTrustHtml(AppConfig.customSpinner);
   
    let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: customSpinner
      });
    return loading; 
  }

  showCreatePDFLoading() {
    const pdfSpinner: any = this.sanitizer.bypassSecurityTrustHtml(AppConfig.createPDFSpinner);
   
    let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: pdfSpinner
      });
    return loading; 
  }


  presentLoadingDefault() {
    const customSpinner: any = this.sanitizer.bypassSecurityTrustHtml(AppConfig.customSpinner);
  
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: customSpinner
    });

    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 1500);
  }

  presentLoadingLoggin() {
    const customSpinner: any = this.sanitizer.bypassSecurityTrustHtml(AppConfig.customSpinner);
  
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: customSpinner
    });

    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 2500);
  }

  showAlertMessage(title, message, buttonText) {
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
