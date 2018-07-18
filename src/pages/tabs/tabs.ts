import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { TimesheetPage } from '../timesheet/timesheet';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsNavigationPage {

  tab1Root = TimesheetPage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {
    this.tab1Root = TimesheetPage;
    this.tab2Root = AboutPage;
    this.tab3Root = ContactPage;
  }
}
