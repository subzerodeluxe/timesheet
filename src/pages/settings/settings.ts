import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { LocalNotificationService } from '../../providers/local-notification-service/local-notification.service';

@IonicPage({
  name: 'settings'
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  notifyTime: any;
  notifications: any[] = [];
  days: any[];
  chosenHours: number;
  chosenMinutes: number;

  constructor(public navCtrl: NavController, public layout: LayoutProvider, public localNot: LocalNotificationService,
    public authProvider: AuthProvider) {

        this.notifyTime = '17:00';
 
        this.chosenHours = new Date().getHours();
        this.chosenMinutes = new Date().getMinutes();
 
        this.days = this.localNot.initDays();
  }

  setupNotifications() {
    this.localNot.addNotifications();
  }

  timeChange() {

  }

  logOut(): void {
    this.authProvider.logOut()
      .then(res => {
        this.navCtrl.setRoot('walkthrough');
      }).catch(_  => this.layout.showAlertMessage('Oeps!', 'Er ging iets mis.', 'Ok'));
  }

}
