import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/nl'
moment.locale('nl');
import { Platform } from 'ionic-angular';
import { LayoutProvider } from '../layout/layout.service';
import { LocalNotifications } from '@ionic-native/local-notifications';


@Injectable()
export class LocalNotificationService {

  notifyTime: any;
  notifications: any[] = [];
  setupStartHours: string;

  constructor(public http: HttpClient, private layout: LayoutProvider, private localNot: LocalNotifications,
     private platform: Platform) {
  }

  initDays(): any[] {
    const days = [
      {title: 'Maandag', dayCode: 1, checked: true},
      {title: 'Dinsdag', dayCode: 2, checked: true},
      {title: 'Woensdag', dayCode: 3, checked: true},
      {title: 'Donderdag', dayCode: 4, checked: true},
      {title: 'Vrijdag', dayCode: 5, checked: true}
    ];

    return days;
  }

  addNotifications(days, chosenHours, chosenMinutes) {
 
    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.
    
    console.log('Incoming days: ', days);
    console.log('ChoosenHours: ', chosenHours);
    for(let day of days){
 
        if (day.checked){
 
            let firstNotificationTime = new Date();
            let dayDifference = day.dayCode - currentDay;
 
            if(dayDifference < 0) {
                dayDifference = dayDifference + 7; // for cases where the day is in the following week
            }
 
            firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
            firstNotificationTime.setHours(chosenHours);
            firstNotificationTime.setMinutes(chosenMinutes);
 
            let notification = {
                id: day.dayCode,
                title: `Herinnering: vul je uren in!`,
                text: 'Hallo Willem. Het is tijd om je werkbriefje bij te werken.',
                data: { mydata: 'Hoe komen we hier.' },
                at: firstNotificationTime,
                every: 'week'
            };
 
            this.notifications.push(notification);
        }
    }
 
    console.log("Notifications to be scheduled: ", this.notifications);

    
 
        if (this.platform.is('cordova')) {
            // Cancel any existing notifications
            this.localNot.cancelAll().then(() => {

                this.layout.presentBottomToast(`Local notifications getriggerd om ${this.notifications[0].at}`);
                // Schedule the new notifications
                this.localNot.schedule(this.notifications); 

                this.notifications = [];

                let alert = this.layout.alertCtrl.create({
                    title: 'Gelukt!',
                    message: 'Notificaties zijn ingesteld.',
                    buttons: ['Ok']
                });
                alert.present();
            })   
        }
  }

  cancelAll(){
 
    this.localNot.cancelAll().then(() => {
        this.notifications = [];
    })
 
    let alert = this.layout.alertCtrl.create({
        title: 'Gelukt!',
        message: 'Alle notificaties zijn uitgeschakeld',
        buttons: ['Ok']
    });
 
    alert.present();
  }
}
