import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';

@IonicPage({
  name: 'settings'
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public layout: LayoutProvider, public authProvider: AuthProvider) {
  }

  logOut(): void {
    this.authProvider.logOut()
      .then(res => {
        this.navCtrl.setRoot('walkthrough');
      }).catch(_  => this.layout.showAlertMessage('Oeps!', 'Er ging iets mis.', 'Ok'));
  }

}
