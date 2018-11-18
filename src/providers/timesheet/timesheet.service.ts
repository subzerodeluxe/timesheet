import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth.service';
import { UserProvider } from '../user/user.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
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

  createLocalPDF(docDefinition: any) {
    return pdfMake.createPdf(docDefinition);
  }

  downloadLocalPDF(pdfObj: any, userObject: any) {
    let weekNumber = this.getCurrentWeekNumber().toString();
    const file = `werkurenbriefje-week-${weekNumber}-${userObject.firstName}-${userObject.lastName}`;

    if (this.plt.is('cordova')) {
      pdfObj.getBuffer((buffer) => {
        let blob = new Blob([buffer], { type: 'application/pdf' });
        // Save the PDF to the data Directorys of our App
        this.file.writeFile(this.file.dataDirectory, file, blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + file, 'application/pdf');
        }).catch(e => this.layout.presentBottomToast('Er ging iets mis. Probeer het opnieuw.')); 
      });
    } else {
      // On a browser simply use download!
      pdfObj.download(file);
    }
  }

  calculateDailyMinutes(incomingMinutes: any) {
    let totalMinutes = 0;
    
    for (let i = 0; i < incomingMinutes.length; i++) {
      totalMinutes += incomingMinutes[i].minutesDifference;
    }

    this.totalDailyMinutesCounter.next(totalMinutes);
  }

  calculateWeekMinutes(incomingMinutes: any) {
    let totalMinutes = 0;
    
    for (let i = 0; i < incomingMinutes.length; i++) {
      totalMinutes += incomingMinutes[i].minutesDifference;
    }

    this.totalWeekMinutesCounter.next(totalMinutes);
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
 

  testCallFunction(incomingText): Observable<any> {
    console.log('Function gets called as we speak ..');
    const callable = this.fns.httpsCallable('testOnCall');
    return callable(incomingText);
  }

  testPDF(incomingText) {
    const callable = this.fns.httpsCallable('createPDF');
    return callable(incomingText);
  }

  getStartDay(weekActivies: any) {
    console.log(weekActivies);
    return weekActivies.filter(
      activity => activity.isoDateString === "2018-11-14T16:33:48.167+01:00");
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
