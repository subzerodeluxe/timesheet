import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/nl'
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform } from 'ionic-angular';
import { LayoutProvider } from '../layout/layout.service';
moment.locale('nl');


@Injectable()
export class LocalNotificationService {

  notifyTime: any;
  notifications: any[] = [];
  chosenHours: number;
  chosenMinutes: number;

  constructor(public http: HttpClient, private layout: LayoutProvider, 
    private localNotifications: LocalNotifications, private platform: Platform) {
    
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

  addNotifications(){
 
    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.
 
    for(let day of this.days){
 
        if (day.checked){
 
            let firstNotificationTime = new Date();
            let dayDifference = day.dayCode - currentDay;
 
            if(dayDifference < 0){
                dayDifference = dayDifference + 7; // for cases where the day is in the following week
            }
 
            firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
            firstNotificationTime.setHours(this.chosenHours);
            firstNotificationTime.setMinutes(this.chosenMinutes);
 
            let notification = {
                id: day.dayCode,
                title: 'Hey!',
                text: 'You just got notified :)',
                at: firstNotificationTime,
                every: 'week'
            };
 
            this.notifications.push(notification);
 
        }
 
    }
 
    console.log("Notifications to be scheduled: ", this.notifications);
 
    if(this.platform.is('cordova')){
 
        // Cancel any existing notifications
        this.localNotifications.cancelAll().then(() => {
 
            // Schedule the new notifications
            this.localNotifications.schedule(this.notifications);
 
            this.notifications = [];
 
            let alert = this.layout.alertCtrl.create({
                title: 'Notifications set',
                buttons: ['Ok']
            });
 
            alert.present();
 
        });
 
    }
 
}

  timeChange(time){
    this.chosenHours = time.hour.value;
    this.chosenMinutes = time.minute.value;
  }

}
