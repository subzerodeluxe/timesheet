import { Component } from '@angular/core';
import { NavController, IonicPage, Platform, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { LocalNotificationService } from '../../providers/local-notification-service/local-notification.service';
import * as moment from 'moment';
import 'moment-duration-format';
import 'moment/locale/nl'
import { LocalNotifications } from '@ionic-native/local-notifications';
moment.locale('nl');

@IonicPage({
  name: 'settings'
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  notifyTime: any;
  notifications: any[] = [];
  days: any[];
  chosenHours: number;
  chosenMinutes: number;
  notificationsOff: boolean;
  defaultNotifications: boolean;

  constructor(public navCtrl: NavController, public layout: LayoutProvider,  public app: App,
    public platform: Platform, public localNotService: LocalNotificationService,
    private localNot: LocalNotifications, public authProvider: AuthProvider) {

        // this.notifyTime = "17:00";
        this.notifyTime = moment(new Date()).format();
        // this.chosenHours = 17;
        // this.chosenMinutes = 0;

        this.chosenHours = new Date().getHours();
        this.chosenMinutes = new Date().getMinutes();
 
        this.notificationsOff = false;
        this.defaultNotifications = true;
        this.days = this.localNotService.initDays();
  }

  setupNotifications() {
    let currentDate = new Date();
    let currentDay = currentDate.getDay(); // Sunday = 0, Monday = 1, etc.
   
    let firstNotificationTime = new Date();

    firstNotificationTime.setHours(this.chosenHours);
    firstNotificationTime.setMinutes(this.chosenMinutes);
   
    let notification = {
      id: 1,
      title: `Herinnering: vul je uren in!`,
      text: 'Hallo Willem. Het is tijd om je werkbriefje bij te werken.',
      data: { mydata: 'Hoe komen we hier.' },
      at: firstNotificationTime,
      every: 'week'
    };

    this.notifications.push(notification);
  

    // for (let day of this.days) {
 
    //     if (day.checked) {
 
    //         let firstNotificationTime = new Date();
    //         let dayDifference = day.dayCode - currentDay;
    //         console.log('Day differnce: ', dayDifference);
    //         // if (dayDifference < 0) {
    //         //     dayDifference = dayDifference + 7; // for cases where the day is in the following week
    //         // }
 
    //         firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference)));
    //         console.log('MAGIC STUFF: ', firstNotificationTime.setHours(firstNotificationTime.getHours() + (24 * (dayDifference))));
    //         firstNotificationTime.setHours(this.chosenHours);
    //         console.log('EN TOEN???: ', firstNotificationTime.setHours(this.chosenHours));
    //         firstNotificationTime.setMinutes(this.chosenMinutes);
    //         console.log('CRAZY: ', firstNotificationTime.setMinutes(this.chosenMinutes));

 
    //         let notification = {
    //             id: day.dayCode,
    //             title: `Herinnering: vul je uren in!`,
    //             text: 'Hallo Willem. Het is tijd om je werkbriefje bij te werken.',
    //             data: { mydata: 'Hoe komen we hier.' },
    //             at: firstNotificationTime,
    //             every: 'week'
    //         };

    //         console.log('This gets set: ', firstNotificationTime);
 
    //         this.notifications.push(notification);
    //     }
    // }
 

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

  notify(ev) {
    if (ev.checked === true) {
      this.notificationsOff = false;
    }
    if (ev.checked === false) {
      this.notificationsOff = true;
      this.cancelAll();
    }
  }

  timeChange(time) {
    this.chosenHours = time.hour;
    this.chosenMinutes = time.minute;
  }

  logOut(): void {
    this.authProvider.logOut()
      .then(_ => {
        this.app.getRootNav().setRoot('login');
      }).catch(_  => this.layout.showAlertMessage('Oeps!', 'Er ging iets mis. Probeer het opnieuw!', 'Ok'));
  }


  cancelAll() {
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
