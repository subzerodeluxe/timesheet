import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, IonicPage } from 'ionic-angular';
import { trigger, style, state, transition, animate, keyframes } from '@angular/animations';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { slideOptions } from '../../app/app.config';

@IonicPage({
  name: 'walkthrough'
})
@Component({
  selector: 'walkthrough-page',
  templateUrl: 'walkthrough.html',
  animations: [
    trigger('bounce', [
      state('*', style({
          transform: 'translateX(0)'
      })),
      transition('* => rightSwipe', animate('700ms ease-out', keyframes([
        style({transform: 'translateX(0)', offset: 0}),
        style({transform: 'translateX(-65px)',  offset: 0.3}),
        style({transform: 'translateX(0)',     offset: 1.0})
      ]))),
      transition('* => leftSwipe', animate('700ms ease-out', keyframes([
        style({transform: 'translateX(0)', offset: 0}),
        style({transform: 'translateX(65px)',  offset: 0.3}),
        style({transform: 'translateX(0)',     offset: 1.0})
      ])))
    ])
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
