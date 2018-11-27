import { Injectable } from '@angular/core';
import { LayoutProvider } from '../layout/layout.service';
import { TimesheetProvider } from '../timesheet/timesheet.service';
import { Employee } from '../../models/employee.interface';

import { FileOpener } from '@ionic-native/file-opener';
import { Platform } from 'ionic-angular';
import { File, FileEntry } from '@ionic-native/file';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { firebaseActivity } from '../../models/activityLine.interface';
import { Vehicle } from '../../models/vehicle.interface';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PdfProvider {

  correctDates: any;
  userObject: Employee; 
  weekActivities: Array<firebaseActivity>;
  carObject: Vehicle;
  carInputArray: any; 

  constructor(public layout: LayoutProvider, 
     public time: TimesheetProvider, private plt: Platform, private file: File, private fileOpener: FileOpener) { }

  async generatePDF(weekActivities: Array<firebaseActivity>, userObject: Employee, carObject: Vehicle) {
    if (weekActivities === null || weekActivities.length === 0 || weekActivities === null) {
      this.layout.presentBottomToast('Niet mogelijk om werkbriefje te genereren. Reden: er zijn geen klussen om de werkbrief te vullen.');
    } else {

      this.weekActivities = weekActivities;
      this.userObject = userObject;
      this.carObject = carObject;
      this.correctDates = this.time.calculateDatesForPDF(this.weekActivities);

      const loading = this.layout.showCreatePDFLoading();
      loading.present();

      const pdf = { 
        content: this.generatePDFHeaderAndBody(),
        styles: this.generatePDFStyles()
      }; 

      const generatedPDF = this.createLocalPDF(pdf);

      try {
        await this.time.addTimesheet(this.carObject, this.userObject);
        setTimeout(() => {
          this.layout.presentBottomToast('Het werkbriefje is succesvol samengesteld. Je download start dadelijk.');
          this.downloadLocalPDF(generatedPDF);
          loading.dismiss();
        }, 3000);
      } catch (error) {
        loading.dismiss();
        this.layout.presentBottomToast('Er ging iets mis met het maken van een werkbriefje. Probeer het opnieuw.');
      }
    }
  }


  generatePDFHeaderAndBody() {
    const totalMinutes= this.weekActivities.reduce((acc, activity) => acc + activity.minutesDifference, 0);
    const formattedTotalHours = this.time.transformMinutesToHours(totalMinutes);
    const table = this.generatePDFTable(this.weekActivities);
    
    if (this.carObject.type === 'noCar') {
      this.carInputArray = [`Totaal: ${formattedTotalHours}`, {text: 'Geen (bedrijfs)auto gebruikt.', style: 'block'}]; 
    } 

    if (this.carObject.type === 'private') {
      this.carInputArray =  [
        `Totaal: ${formattedTotalHours}`,
        {text: 'Eigen auto gebruikt', style: 'block'},
        {text: `Aantal gereden kilometers: ${this.carObject.mileage}`, style: 'small'}
      ];
    }

    if (this.carObject.type === 'company') {
      this.carInputArray = [
        `Totaal: ${formattedTotalHours}`,
        {text: `Kenteken bedrijfsauto: ${this.carObject.licenseplate}`, style: 'block'},    
        {text: `Kilometerstand: ${this.carObject.mileage}`, style: 'small'}
      ]; 
    }
   
    const pdfContent =  [  
        {text: 'WEEK-WERKBRIEFJE', style: 'header'},
        {text: `Week nr. ${this.correctDates.weekNumber}`, style: 'subheader'},
        {text: `Ingevuld door ${this.userObject.firstName} ${this.userObject.lastName}`, bold: true},
        {text: `Van ${this.correctDates.earliestDate} t/m ${this.correctDates.latestDate} ${this.correctDates.year}`, bold: true},
        {
          style: 'tableExample',
          margin: [0, 25],
          table
        },
        {
          stack: this.carInputArray,
          style: 'totalHeader'
        }
      ];  
      
    return pdfContent; 
  }

  generatePDFTable(weekActivities: any): any {
    let rows = weekActivities.map(activity => ([
      this.time.formatRowDateForPDF(activity.isoDateString), 
      this.time.transformMinutesToHours(activity.minutesDifference), 
      [{text: activity.clientName}, {text: activity.location, color: 'gray'}],
      {
        ul: activity.activities.map(single => ([
          single.name
       ]))
      }
    ]));

    const headers = [{text: 'Datum', style: 'tableHeader'}, {text: 'Aantal uren', style: 'tableHeader'}, {text: 'Aannemer/klant', style: 'tableHeader'}, {text: 'Werkzaamheden', style: 'tableHeader'}];
    rows = [headers, ...rows];

    return {
        headerRows: 2,
        heights: [30, 40, 40, 40, 40],
        widths: [100, 50, '*', 190],
        body: rows
    };
  }

  createLocalPDF(docDefinition: any) {
    try {
      const generatedPDF = pdfMake.createPdf(docDefinition);
      return generatedPDF;
    } catch (err) {
      console.log('Error van PDF: ', err);
      return err;
    }
  }

  downloadLocalPDF(pdfObj: any) {
    const file = `werkurenbriefje-week-${this.correctDates.weekNumber}-${this.correctDates.year}-${this.userObject.firstName}-${this.userObject.lastName}`;

    // if (this.plt.is('cordova')) {
    //  pdfObj.getBuffer((buffer) => {
    //     let blob = new Blob([buffer], { type: 'application/pdf' });
    //     this.file.writeFile(this.file.dataDirectory, file, blob, { replace: true })
    //     .then((fileEntry: FileEntry) => {
    //       this.fileOpener.open(fileEntry.toURL(), 'application/pdf')
    //         .catch((err) => this.layout.presentBottomToast(JSON.stringify(err)));
    //     }).catch(e => this.layout.presentBottomToast('Er ging iets mis met het ophalen van het werkbriefje. Probeer het opnieuw.')); 
    //   });
    // } else {
      try {
        pdfObj.download(file);
      } catch (error) {
        this.layout.presentBottomToast('Er ging iets mis met het ophalen van het werkbriefje. Probeer het opnieuw.');
      }
    
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

}
