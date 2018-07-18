import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { TabsNavigationPage } from '../tabs/tabs';

@Component({
  selector: 'walkthrough-page',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage {

  lastSlide = false;

  @ViewChild('slider') slider: Slides;

  constructor(public nav: NavController) {

  }

  skipIntro() {
    // You can skip to main app
    // this.nav.setRoot(TabsNavigationPage);

    // Or you can skip to last slide (login/signup slide)
    this.lastSlide = true;
    this.slider.slideTo(this.slider.length());
  }

  onSlideChanged() {
    // If it's the last slide, then hide the 'Skip' button on the header
    this.lastSlide = this.slider.isEnd();
  }

  goToLogin() {
    // this.nav.push(LoginPage);
    this.nav.setRoot(TabsNavigationPage);
  }

  goToSignup() {
    // this.nav.push(SignupPage);
  }
}
