import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, SegmentButton, IonicPage, Platform } from 'ionic-angular';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs-compat/Subscription';
import { Employee } from '../../models/employee.interface';
import { infinitePulse, staggerAnimation } from '../../app/animations';
import { sampleTable } from '../../assets/example-data/sample-pdf-table';

@IonicPage({
  name: 'timesheet'
})
@Component({
  selector: 'page-timesheet',
  templateUrl: 'timesheet.html',
  animations: [
    infinitePulse,
    staggerAnimation
  ]
})
export class TimesheetPage implements OnDestroy {
  
  segment: string;
  subscription: Subscription;
  showWeekHours: boolean = false;
  dailyActivitiesExist: boolean = false;
  noActivities: boolean = true;
  noWeekActivities: boolean = true;
  isoString: string;
  userObject: Employee;
  state = 'small';
  activities: any;
  weekActivities: any;
  whichNoActivities: string;
  pdfObj = null;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authProvider: AuthProvider, public userProvider: UserProvider, public layout: LayoutProvider, public time: TimesheetProvider) {
      this.segment = "today";
      this.isoString = this.time.getCurrentIsoString();

      this.subscription = this.userProvider.getAuthenticatedUserProfile()
      .subscribe(user => {
        this.userObject = user;
        this.time.findAllWeekActivitiesByUser(this.userObject).subscribe(weekActivities => {
          if (weekActivities.length === 0) {
            this.noWeekActivities = true; 
          } else {
            this.noWeekActivities = false;
            this.weekActivities = weekActivities;
            this.time.calculateWeekMinutes(this.weekActivities);
            console.log('De activiteiten van de week: ', this.weekActivities);
          }
      })

      this.time.findAllDailyActivitiesByUser(this.userObject).subscribe(activities => {
        if (activities.length === 0) {
          this.noActivities = true;
        } else { 
          this.noActivities = false;
          this.activities = activities;
          this.time.calculateDailyMinutes(this.activities);
          console.log('De activiteiten van de dag: ', this.activities);
        } 
      });
    }); 
  }

  generatePDF() {
    console.log('Starting to create local PDF');
    const docDefinition = sampleTable;
    const weekNumber = this.time.getCurrentWeekNumber().toString();
    const startDay = this.time.getStartDay(this.weekActivities);

    const test = { content: [
      {text: 'WEEK-WERKBRIEFJE', style: 'header'},
      {text: `Week nr. ${weekNumber}`, style: 'subheader'},
      
      {text: [`Ingevuld door ${this.userObject.firstName} ${this.userObject.lastName}`], bold: true},
      {text: [`Van ${startDay} tot ergens in 2018`], bold: true}
    ],
    styles: {
      header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
      },
      totalHeader: {
          fontSize: 18,
          bold: true,
          alignment: 'left',
          margin: [0, 0, 0, 0]
      },
       block: {
          fontSize: 13,
          bold: true,
          alignment: 'left',
          margin: [0, 20, 0, 0]
      },
      small: {
          fontSize: 13,
          bold: true,
          alignment: 'left',
          margin: [0, 0, 0, 0]
      },
      subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
      },
      tableExample: {
          margin: [0, 5, 0, 15]
      },
      tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
      }
    }};


    this.pdfObj = this.time.createLocalPDF(sampleTable);
  }

  downloadPDF() {
    this.time.downloadLocalPDF(this.pdfObj, this.userObject);
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
    this.layout.presentLoadingDefault();
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

  onSegmentChanged(segmentButton: SegmentButton) {
    if (segmentButton.value === "overview") {
      this.showWeekHours = true;
    } else {
      this.showWeekHours = false;
    }
  }

  onSegmentSelected(segmentButton: SegmentButton) { }

  addNewActivity() {
    this.navCtrl.push('add-activity', { userObject: this.userObject });
  }

  openActivity(activity) {
    let loading = this.layout.showLoading();
    loading.present();

    setTimeout(() => {
      console.log('Being pushed: ', activity); 
      this.navCtrl.push('activity-detail', { activity: activity })
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 1500);
  }

  ngOnDestroy() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }
}
