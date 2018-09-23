import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Platform } from 'ionic-angular';
import { LayoutProvider } from '../providers/layout/layout.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { TimesheetProvider } from '../providers/timesheet/timesheet.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage: any;
  timesheetExists: boolean;
  timesheetSub: Subscription;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, 
    public afAuth: AngularFireAuth, public layoutProvider: LayoutProvider, private timesheetProvider: TimesheetProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      const authObserver = afAuth.authState.subscribe(user => {
        if (user) {
          this.rootPage = 'tabs';
          this.layoutProvider.presentTopToast(`Welkom terug ${user.email}`);
          this.initTimesheetListener(user);   // Wordt enkel getriggerd wanneer gebruiker is ingelogt
          authObserver.unsubscribe();  
        } else {
          this.rootPage = 'walkthrough';
          authObserver.unsubscribe();
        }
      });
    });
  }

  initTimesheetListener(user):  void {
    console.log('Timesheet listener started.');
    this.timesheetExists = false; 
    if (this.timesheetExists === false) {
      this.timesheetProvider.createTimesheet(user)
        .then(res => {
          console.log('De response: ', res);
          if (res === undefined) {
            console.log('Timesheet succesvol aangemaakt.');
            this.timesheetExists = true;
          } else {
            const alert = this.layoutProvider.showAlertMessage('TEST: werkbriefje bestaat al.', 'Geen nieuwe aangemaakt', 'Ok');
            alert.present();
          }
        })
        .catch(err => {
          console.log('Errors: ', err);
          const alert = this.layoutProvider.showAlertMessage('ERROR', err, 'Ok');
          alert.present();
        });
    } else {
      console.log('Timesheet boolean staat op true');
    }
  }
}
