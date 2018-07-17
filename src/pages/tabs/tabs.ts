import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsNavigationPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {
    this.tab1Root = HomePage;
    this.tab2Root = AboutPage;
    this.tab3Root = ContactPage;
  }
}
