import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, IonicPage } from 'ionic-angular';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { slideOptions } from '../../app/app.config';
import { walkthrough } from '../../app/animations';

@IonicPage({
  name: 'walkthrough'
})
@Component({
  selector: 'walkthrough-page',
  templateUrl: 'walkthrough.html',
  animations: [
    walkthrough
  ]
})
export class WalkthroughPage {

  @ViewChild(Slides) slides: Slides;
  skipMsg: string = "Overslaan";
  state: string = 'x';
  

  constructor(public navCtrl: NavController, private pageTransition: NativePageTransitions) {

  }

  skip() {
    this.pageTransition.slide(slideOptions);
    this.navCtrl.setRoot('login');
  }
 

  slideChanged() {
    if (this.slides.isEnd())
      this.skipMsg = "Naar inloggen";
  }

  slideMoved() {
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex())
      this.state = 'rightSwipe';
    else
      this.state = 'leftSwipe';
  }

  animationDone() {
    this.state = 'x';
  }
}
