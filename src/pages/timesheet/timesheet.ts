import { Component } from '@angular/core';
import { NavController, NavParams, SegmentButton, LoadingController } from 'ionic-angular';
import { TimesheetProvider } from '../../providers/timesheet/timesheet';

@Component({
  selector: 'page-timesheet',
  templateUrl: 'timesheet.html',
})
export class TimesheetPage {

  segment: string;
  loading: any;
  timesheet: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public loadingCtrl: LoadingController, public time: TimesheetProvider) {
    this.segment = "today";
    this.loading = this.loadingCtrl.create();

    this.timesheet = {
      employee: { 
          firstName: 'Willem',
          lastName: 'Waanders' 
      },
      weekNumber: 21,
      dateLines: [{
          dayNumber: 16,
          month: 'Aug',
          fullDate: '16 augustus',
          year: 2018,
          activities: [{
              hours: 4.5,
              startTime: '7:30',
              endTime: '12:00',
              customer: 'Needse molen',
              activity: ['Voorwerk', 'Aflakken']
          }, {
              hours: 3.5,
              startTime: '12:30',
              endTime: '16:00',
              customer: 'Gemeente Berkelland',
              activity: ['Voorwerk', 'Grondverven']
          }],
          totalHours: 7.5
        }, {
          dayNumber: 17,
          month: 'Aug',
          fullDate: '17 augustus',
          year: 2018,
          activities: [{
              hours: 7.5,
              startTime: '7:30',
              endTime: '16:00',
              customer: 'Needse molen',
              activity: ['Voorwerk', 'Aflakken']
          }],
          totalHours: 7.5
          }
      ],
      allDates: 'Maandag 16 augustus t/m dinsdag 17 augustus',
      totalHours: 15,
      vehicleInformation: {
          licensePlate: '44-VD-356',
          mileAge: 120.000
      }
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimesheetsPage');
    setTimeout(() => {  
      this.loading.dismiss();
    }, 3000)
  }

  onSegmentChanged(segmentButton: SegmentButton) {
    console.log('Segment changed to', segmentButton.value);
  }

  onSegmentSelected(segmentButton: SegmentButton) {
    console.log('Segment selected', segmentButton.value);
  }


}
