import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, SegmentButton, IonicPage, Platform, ModalController } from 'ionic-angular';
import { TimesheetProvider } from '../../providers/timesheet/timesheet.service';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs-compat/Subscription';
import { Employee } from '../../models/employee.interface';
import { infinitePulse, staggerAnimation } from '../../app/animations';
import { sampleTable } from '../../assets/example-data/sample-pdf-table';
import { CarInputComponent } from '../../components/car-input/car-input';

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
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
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

  generatePDF(noCar?: boolean) {

    if (this.noWeekActivities === true) {
      this.layout.presentBottomToast('Niet mogelijk om werkbriefje te genereren. Reden: er zijn geen klussen om de werkbrief te vullen.');
    } else {
      const loading = this.layout.showCreatePDFLoading();
      loading.present();

      const pdf = { 
        content: this.generatePDFHeaderAndBody(noCar),
        styles: this.generatePDFStyles()
      }; 
  
      this.pdfObj = this.time.createLocalPDF(pdf);

      setTimeout(() => {
        this.downloadPDF();
        loading.dismiss();
      }, 3000);
    }
  }

  presentPDFAlert() {
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
            const noCar = true;
            this.generatePDF(noCar);
            break;
          }
          case 'companyCar': {
            this.openCarInputModal('companyCar');
            console.log('Gekozen voor company car');
            break;
          }
          case 'ownCar': {
            this.openCarInputModal('ownCar');
            console.log('Gekozen voor own car');
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
  }

  openCarInputModal(choice: string) {
    let modal = this.modalCtrl.create(CarInputComponent, { carChoice: choice });
    modal.present();
  }

  generateTable(): any {
    let rows = this.weekActivities.map(activity => ([
      this.time.formatRowDateForPDF(activity.isoDateString), 
      this.time.transformMinutesToHours(activity.minutesDifference), 
      activity.clientName,
      {
        ul: activity.activities.map(single => ([
          single.name
       ]))
      }
    ]));

    const headers = [{text: 'Datum', style: 'tableHeader'}, {text: 'Aantal uren', style: 'tableHeader'}, {text: 'Aannemer/klant', style: 'tableHeader'}, {text: 'Werkzaamheden', style: 'tableHeader'}];
    rows = [headers, ...rows];

    console.log('Wat  zijn de rows? ', rows);

    return {
        headerRows: 2,
        heights: [30, 40, 40, 40, 40],
        widths: ['*', 50, '*', 200],
        body: rows
    };
  }

  generatePDFHeaderAndBody(noCar?: boolean) {

      const weekNumber = this.time.getCurrentWeekNumber().toString();
      const correctDates = this.time.calculateDatesForPDF(this.weekActivities);
      const totalMinutes= this.weekActivities.reduce((acc, activity) => acc + activity.minutesDifference, 0);
      const formattedTotalHours = this.time.transformMinutesToHours(totalMinutes);
      const table = this.generateTable();
      let carInput;
      if (noCar === true) {
        carInput = 'Geen auto gebruikt.'
      }

      const pdfContent =  [  
          {text: 'WEEK-WERKBRIEFJE', style: 'header'},
          {text: `Week nr. ${weekNumber}`, style: 'subheader'},
          {text: `Ingevuld door ${this.userObject.firstName} ${this.userObject.lastName}`, bold: true},
          {text: `Van ${correctDates.earliestDate} t/m ${correctDates.latestDate} ${correctDates.year}`, bold: true},
          {
            style: 'tableExample',
            margin: [0, 25],
            table
          },
          {
            stack: [
                `Totaal: ${formattedTotalHours}`,
                {text: carInput, style: 'block'},
               // {text: 'Kilometerstand: 125.034', style: 'small'}
            ],
            style: 'totalHeader'
          }
        ];  
      
    return pdfContent; 
  }

  generatePDFStyles() {
    const pdfStyles =  {
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
      }
    };

    return pdfStyles.styles;
  }

  downloadPDF() {
    this.time.downloadLocalPDF(this.pdfObj, this.userObject);
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
