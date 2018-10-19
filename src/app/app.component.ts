import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Platform } from 'ionic-angular';
import { LayoutProvider } from '../providers/layout/layout.service';
import { TimesheetProvider } from '../providers/timesheet/timesheet.service';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../providers/user/user.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage: any;
  present: boolean;
  timesheetSub: Subscription;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private afAuth: AngularFireAuth,
    public layoutProvider: LayoutProvider, private userProvider: UserProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      const authObserver = afAuth.authState.subscribe(user => {
        if (user) {
          this.rootPage = 'tabs';
          const o = this.userProvider.getAuthenticatedUserProfile()
            .subscribe(profile => {
              if (profile.firstName != null) {
                this.layoutProvider.presentTopToast(`Welkom terug, ${profile.firstName}`);
                o.unsubscribe();
              } else {
                this.layoutProvider.presentTopToast(`Welkom terug, ${user.email}`);
                o.unsubscribe();
              }
            });
          // this.initTimesheetListener(user);   // Wordt enkel getriggerd wanneer gebruiker is ingelogt
          authObserver.unsubscribe();  
        } else {
          this.rootPage = 'walkthrough';
          authObserver.unsubscribe();
        }
      });
    })
  }
}


  // initTimesheetListener(user):  void {
  //   console.log('Timesheet listener started.');
  //   this.timesheetProvider.createTimesheet(user)
  //     .then(res => {
  //       console.log('De response: ', res);
  //       if (res === undefined) {
  //         console.log('Timesheet succesvol aangemaakt.');
  //         //this.timesheetExists = true;
  //       } else {
  //         const alert = this.layoutProvider.showAlertMessage('TEST: werkbriefje bestaat al.', 'Geen nieuwe aangemaakt', 'Ok');
  //         alert.present();
  //       }
  //     })
  //     .catch(err => {
  //       console.log('Errors: ', err);
  //       const alert = this.layoutProvider.showAlertMessage('ERROR', err, 'Ok');
  //       alert.present();
  //     });
  // }
