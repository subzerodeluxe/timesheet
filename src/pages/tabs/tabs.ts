import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

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

  constructor() {
    this.tab1Root = 'timesheet';
    this.tab2Root = 'account';
    this.tab3Root = 'archive';
    this.tab4Root = 'settings';

  }
}
