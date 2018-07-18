import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { TimesheetPage } from '../timesheet/timesheet';
import { AccountPage } from '../account/account';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsNavigationPage {

  tab1Root = TimesheetPage;
  tab2Root = AccountPage;
  tab3Root = ContactPage;

  constructor() {
    this.tab1Root = TimesheetPage;
    this.tab2Root = AccountPage;
    this.tab3Root = ContactPage;
  }
}
