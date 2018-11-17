import { Component } from '@angular/core';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { loadHoursAnimation, infinitePulse } from '../../app/animations';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'weekly-footer-counter',
  templateUrl: 'weekly-footer-counter.html',
  animations: [
    loadHoursAnimation,
    infinitePulse,
  ]
})
export class WeeklyFooterCounterComponent {

  totalMinutes: number;
  state = 'small';

  constructor(private time: TimesheetProvider, public navCtrl: NavController, public layout: LayoutProvider) {
    this.time.totalWeekMinutesCounter.subscribe((minutes) => {
      this.totalMinutes = minutes;
    }); 
  }


  addNewActivity() {
    this.navCtrl.push('activity-detail');
  }


  callTestFunction() {
    console.log('Call the function');
    this.layout.presentBottomToast('Functie wordt gecalled');
    const data = { message: 'Dit wordt doorgestuurd als test'};
     this.time.testPDF(data)
      .subscribe(data => {
        this.layout.presentBottomToast(JSON.stringify(data)); 
        console.log(data)
      });
  }
    
  ionViewDidLoad() {
    setTimeout(() => {
      this.state = 'big';
    }, 0);  
  }

  onEnd(event) {
    this.state = 'small';
    if (event.toState === 'small') {
      setTimeout(() => {
        this.state = 'big';
      }, 0);
    }
  }
}
