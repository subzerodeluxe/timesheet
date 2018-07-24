import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';

@IonicPage({
  name: 'settings'
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public authProvider: AuthProvider) {
  }

  ionViewCanEnter() {
    return this.authProvider.authenticated();
  }

}
