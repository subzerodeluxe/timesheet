import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, SegmentButton, IonicPage, ModalController } from 'ionic-angular';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs-compat/Subscription';
import { Employee } from '../../models/employee.interface';
import { infinitePulse, staggerAnimation } from '../../app/animations';
import { CarInputComponent } from '../../components/car-input/car-input';
import { PdfProvider } from '../../providers/pdf/pdf';
import { Vehicle } from '../../models/vehicle.interface';
import { firebaseActivity } from '../../models/activityLine.interface';

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
  showWeekHours: boolean = false;
  noActivities: boolean = true;
  noWeekActivities: boolean = true;
  isoString: string;
  userObject: Employee;
  smallScreen: boolean; 
  state = 'small';
  activities: firebaseActivity[];
  weekActivities: firebaseActivity[];
  fbSubs: Subscription[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public pdf: PdfProvider,
    public authProvider: AuthProvider, public userProvider: UserProvider, public layout: LayoutProvider, public time: TimesheetProvider) {
      this.isoString = this.time.getCurrentIsoString();
      this.segment = "today";
      this.fbSubs.push(this.userProvider.getAuthenticatedUserProfile()
      .subscribe(user => {
        this.userObject = user;
        this.fbSubs.push(this.time.findAllWeekActivitiesByUser(this.userObject).subscribe(weekActivities => {
          if (weekActivities.length === 0) {
            this.noWeekActivities = true; 
          } else {
            this.noWeekActivities = false;
            this.weekActivities = weekActivities;
            this.time.calculateWeekMinutes(this.weekActivities);
          } 
      }, error => {
        this.layout.presentBottomToast(error);
      }));

      this.fbSubs.push(this.time.findAllDailyActivitiesByUser(this.userObject)
      .subscribe(activities => {
        if (activities.length === 0) {
          this.noActivities = true;
        } else { 
          this.noActivities = false;
          this.activities = activities;
          this.time.calculateDailyMinutes(this.activities);
        } 
      }, error => {
        this.layout.presentBottomToast(error);
      }));
    }, error => {
      this.layout.presentBottomToast(error);
    }));
  }

  
  ionViewDidLoad() {
    this.layout.presentLoadingDefault();
    setTimeout(() => {
      this.state = 'big';
    }, 0);  

    this.layout.smallScreen.subscribe((smallScreen: boolean) => {
      console.log('Small screen? ', smallScreen);
      this.smallScreen = smallScreen;
    })
  }

  presentPDFAlert() {
    if (this.weekActivities != null) {
      let alert = this.layout.alertCtrl.create({
        cssClass: 'category-prompt'
      });
      alert.setTitle('Welke auto heb je deze week gebruikt?');
  
      alert.addInput({
        type: 'radio',
        label:'Bedrijfsauto',
        value:'companyCar',
        checked: true
      });
  
      alert.addInput({
        type: 'radio',
        label:'Eigen auto',
        value:'ownCar'
      });
  
      alert.addInput({
        type: 'radio',
        label:'Geen auto gebruikt',
        value:'noCar'
      });
  
      alert.addButton('Annuleer');
      alert.addButton({
        text: 'Bevestig keuze',
        handler: choice => {
          switch (choice) {
            case 'noCar': {
              const carObject = { type: 'noCar'} as Vehicle;
              this.pdf.generatePDF(this.weekActivities, this.userObject, carObject);
              break;
            }
            case 'companyCar': {
              const carObject = { type: 'company'} as Vehicle;
              this.openCarInputModal(carObject);
              break;
            }
            case 'ownCar': {
              const carObject = { type: 'private'} as Vehicle;
              this.openCarInputModal(carObject);
              break;
            }
            default: {
              this.layout.presentBottomToast('Er ging iets mis. Probeer het opnieuw.');
              break;
            }
          }
        }
      });
      alert.present();
    } else {
      this.layout.presentBottomToast('Het is niet mogelijk een werkbriefje samen te stellen. Voeg eerst een klus toe.');
    }
   
  }

  openCarInputModal(carObject: Vehicle) {
    let modal = this.modalCtrl.create(CarInputComponent, { carObject: carObject, user: this.userObject, weekActivities: this.weekActivities });
    modal.present();
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
      this.navCtrl.push('activity-detail', { activity: activity })
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 1500);
  }

  ngOnDestroy() {
    if (this.fbSubs != null) {
      this.fbSubs.forEach(sub => sub.unsubscribe());
    }
  }
}
