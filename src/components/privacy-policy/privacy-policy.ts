import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'privacy-policy',
  templateUrl: 'privacy-policy.html'
})
export class PrivacyPolicyComponent {

  constructor(private view: ViewController) {
    
  }

  dismiss() {
    this.view.dismiss();
  }

}
