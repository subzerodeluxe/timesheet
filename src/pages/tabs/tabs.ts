import { Component } from '@angular/core';

import { TimesheetPage } from '../timesheet/timesheet';
import { AccountPage } from '../account/account';
import { ArchivePage } from '../archive/archive';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsNavigationPage {

  tab1Root = TimesheetPage;
  tab2Root = AccountPage;
  tab3Root = ArchivePage;
  tab4Root = SettingsPage;

  constructor() {
    this.tab1Root = TimesheetPage;
    this.tab2Root = AccountPage;
    this.tab3Root = ArchivePage;
    this.tab4Root = SettingsPage;

  }
}
