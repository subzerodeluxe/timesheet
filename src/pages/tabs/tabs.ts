import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';

@IonicPage({
  name: 'tabs'
})
@Component({
  templateUrl: 'tabs.html'
})
export class TabsNavigationPage {

  tab1Root = 'timesheet';
  tab2Root = 'account';
  tab3Root = 'archive';
  tab4Root = 'settings';

  constructor(public authProvider: AuthProvider) {
    this.tab1Root = 'timesheet';
    this.tab2Root = 'account';
    this.tab3Root = 'archive';
    this.tab4Root = 'settings';
  }

  ionViewCanEnter() {
    return this.authProvider.authenticated();
  }
}
