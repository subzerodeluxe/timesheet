import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth.service';
import { UserProvider } from '../user/user.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Storage } from '@ionic/storage';
import { map, mergeMap, first} from 'rxjs/operators';
import { firebaseActivity } from '../../models/activityLine.interface';
import * as moment from 'moment';
import 'moment-duration-format';
import { AngularFireFunctions } from '@angular/fire/functions';
import { LayoutProvider } from '../layout/layout.service';
import { FileOpener } from '@ionic-native/file-opener';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class TimesheetProvider {

  enrichedActivity: any;
  activitiesRef: AngularFirestoreCollection<any>;
  currentDate: string;
  weekNumber: string;
  year: string;
  uid: string;
  public totalDailyMinutesCounter: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public totalWeekMinutesCounter: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(public afs: AngularFirestore, public userService: UserProvider, public layout: LayoutProvider,
    private fns: AngularFireFunctions, public plt: Platform, 
    private file: File, private fileOpener: FileOpener,
    public authService: AuthProvider, public storage: Storage) {
      this.activitiesRef = this.afs.collection('activities');

      this.currentDate = this.getCurrentDayNumber().toString(); 
      this.weekNumber = this.getCurrentWeekNumber().toString();
      this.year = this.getCurrentYear().toString();
  }

  findAllDailyActivitiesByUser(userObject: any): Observable<any> {
     return this.afs.collection('activities', ref => {
      return ref.where('userDateString', '==', `${this.currentDate}-week-${this.weekNumber}-${this.year}-${userObject.uid}`);
        }).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as firebaseActivity;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      )
  }

  
  findAllWeekActivitiesByUser(userObject: any): Observable<any> {
    return this.afs.collection('activities', ref => {
     return ref.where('timesheetId', '==', `week-${this.weekNumber}-${this.year}-${userObject.uid}`);
        }).snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data() as firebaseActivity;
            const id = a.payload.doc.id;
            return { id, ...data };
          }))
        )
  }




  findTimesheetByUserAndWeekNumber(): Observable<any> {

    const activities = this.afs.collection('activities', ref => {
      return ref.where('timesheetId', '==', `week-47-2018-eFI1cHuXpyS01Yjcj8jWAQavIMN2`);
         }).snapshotChanges().pipe(
           map(actions => actions.map(a => {
             const data = a.payload.doc.data() as firebaseActivity;
             const id = a.payload.doc.id;
             return { id, ...data };
           })
          )
         );
      
    const timesheet = this.afs.collection('timesheets').doc('week-47-2018-eFI1cHuXpyS01Yjcj8jWAQavIMN2').valueChanges();
    const correctTimesheet = combineLatest(activities, timesheet);

    return correctTimesheet;
      
  }


  createLocalPDF(docDefinition: any) {
    try {
      const generatedPDF = pdfMake.createPdf(docDefinition);
      return generatedPDF;
    } catch (err) {
      return err;
    }
  }

  downloadLocalPDF(pdfObj: any, userObject: any) {
    const weekNumber = this.getCurrentWeekNumber().toString();
    const currentYear = this.getCurrentYear();
    const file = `werkurenbriefje-week-${weekNumber}-${currentYear}-${userObject.firstName}-${userObject.lastName}`;

    if (this.plt.is('cordova')) {
      pdfObj.getBuffer((buffer) => {
        let blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directorys of our App
        this.file.writeFile(this.file.dataDirectory, file, blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + file, 'application/pdf');
        }).catch(e => this.layout.presentBottomToast('Er ging iets mis met het ophalen van het werkbriefje. Probeer het opnieuw.')); 
      });
    } else {
      // On a browser simply use download!
      try {
        pdfObj.download(file);
      } catch (error) {
        this.layout.presentBottomToast('Er ging iets mis met het ophalen van het werkbriefje. Probeer het opnieuw.');
      }
    }
  }

  calculateDailyMinutes(incomingMinutes: any) {
    const totalMinutes = incomingMinutes.reduce((acc, activity) => acc + activity.minutesDifference, 0);
    this.totalDailyMinutesCounter.next(totalMinutes);
  }

  calculateWeekMinutes(incomingMinutes: any) {
    const totalMinutes = incomingMinutes.reduce((acc, activity) => acc + activity.minutesDifference, 0);
    this.totalWeekMinutesCounter.next(totalMinutes); 
  }

  calculateDateRange(): any {
    const currentYear = this.getCurrentYear(); 
    const currentWeekNumber = this.getCurrentWeekNumber(); 
    const startDayofWeekNumberAsISOString = moment([currentYear]).isoWeek(currentWeekNumber).startOf('isoWeek').format()    

    let max = moment(startDayofWeekNumberAsISOString).add(5, 'days').format();

     const timeObject = {
        start: startDayofWeekNumberAsISOString,
        min: startDayofWeekNumberAsISOString,
        max: max, 
      };

    return timeObject;
  }

  calculateDatesForPDF(weekActivies: any): any {
    weekActivies.sort((a, b) => {   
          return a.isoDateString > b.isoDateString ? 1 : a.isoDateString < b.isoDateString ? -1 : 0
    });
  
    const earliestDate = weekActivies[0].isoDateString;
    const latestDate   = weekActivies[weekActivies.length - 1].isoDateString;

    const timeObject = {
      earliestDate: moment(earliestDate).format('dddd D MMMM'),
      latestDate: moment(latestDate).format('dddd D MMMM'),
      year: moment(earliestDate).format('YYYY')
    };
    
    return timeObject;
  }

  formatRowDateForPDF(date: string): string {
    const formattedDate = moment(date).format('dddd D MMM');
    return formattedDate;
  }

  async saveActivity(activityObject: any, user: any) {
    console.log('Doorgestuurde user: ', user.uid);
    const weekNumber = this.getCurrentWeekNumber().toString();
    const year = this.getCurrentYear().toString(); 
  
    this.enrichedActivity = {
      timesheetId: `week-${weekNumber}-${year}-${user.uid}`,
      uid: user.uid,
      userDateString: `${this.getCurrentDayNumber().toString()}-week-${weekNumber}-${year}-${user.uid}`,
      ...activityObject
    };
    this.activitiesRef.add(this.enrichedActivity);
  }

  async saveActivityWithCustomDate(activityObject: any, user: any) {
    console.log('Doorgestuurde user: ', user.uid);
    const weekNumber = this.getCurrentWeekNumber().toString();
    const year = this.getCurrentYear().toString(); 
    const dayNumber = this.calculateDayNumber(activityObject.isoDateString);

    this.enrichedActivity = {
      timesheetId: `week-${weekNumber}-${year}-${user.uid}`,
      uid: user.uid,
      userDateString: `${dayNumber.toString()}-week-${weekNumber}-${year}-${user.uid}`,
      ...activityObject
    };
    this.activitiesRef.add(this.enrichedActivity);
  }

  async updateActivity(activityObject: any, id: string): Promise<boolean> { 
    const ref = this.activitiesRef.doc(id)
    try {
      const uploadedActivity = activityObject;
      await ref.update({...uploadedActivity});
      return true;
    } 
    catch(e) {
      console.log('Er gaat iets niet goed. ', e);
      return false;
    } 
  }

  calculateMinutesDifference(startTime, endTime): number {
    const start = moment.utc(startTime, "HH:mm");
    const end = moment.utc(endTime, "HH:mm");

    // account for crossing over to midnight the next day
    if (end.isBefore(start)) end.add(1, 'day');

    // calculate the duration
    let d = moment.duration(end.diff(start));
  
    const correctMinutes = d.asMinutes();
    console.log('Correct minutes?: ', correctMinutes);   
    return correctMinutes;
  }

  transformMinutesToHours(minutes: number): string {
    let finalHours = moment.duration(minutes, "minutes").format("h:mm");
    
    let index = finalHours.indexOf(":"); 
    
    let slicedMinutes = finalHours.slice(index + 1); 
    let slicedHours = finalHours.slice(0, index); 
    
    finalHours = slicedHours + ' uur ' + 'en ' + slicedMinutes + ' minuten';
    return finalHours;
  }

  deleteActivity(activityObject: any): Promise<void> {
    console.log('Dit gaat er af: ', activityObject.minutesDifference);
    return this.activitiesRef.doc(activityObject.id).delete();
  }

  getCurrentWeekNumber(): number {
    const weekNumber = moment().isoWeek(); // Number
    return weekNumber;
  }

  calculateDayNumber(isoDateString: string): number {
    const dayNumber = moment(isoDateString).date();
    return dayNumber;
  }

  getCurrentDayNumber(): number {
    const currentIso = this.getCurrentIsoString();
    const date = moment(currentIso);
    const dayNumber = date.date();
    return dayNumber; 
  }

  getCurrentMonth(): string {
    const month = moment().format('MMM'); 
    return month;
  }

  getCurrentYear(): string {
    const year = moment().format('YYYY');
    return year; 
  }

  getCurrentIsoString(): string {
    const isoString = moment().toISOString(true); 
    return isoString; 
  }
}
