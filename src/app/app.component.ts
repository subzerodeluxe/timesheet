import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Platform, Nav } from 'ionic-angular';
import { LayoutProvider } from '../providers/layout/layout.service';
import { Subscription } from 'rxjs/Subscription';
import { UserProvider } from '../providers/user/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { timer } from 'rxjs';
import { AuthProvider } from '../providers/auth/auth.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  
  rootPage: any;
  present: boolean;
  timesheetSub: Subscription;
  smallScreen = true;
  showSplash = true; 
  isTimesheet: boolean = false; 
  isAccount: boolean = false;
  isArchive: boolean = false;
  isSettings: boolean = false; 
  authenticated: boolean = false;
  screenSubscription: Subscription;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private afAuth: AngularFireAuth, private authProvider: AuthProvider,
    public layoutProvider: LayoutProvider, private userProvider: UserProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
        this.smallScreen = true;
      }

      this.layoutProvider.setScreenSize();
      timer(3000).subscribe(() => {
        this.showSplash = false;
        this.screenSubscription = this.layoutProvider.smallScreen.subscribe((smallScreen: boolean) => {
          this.smallScreen = smallScreen;
        })
      }) // <-- hide animation after 3s

      const authObserver = this.afAuth.authState.subscribe(user => {
        if (user) {
          this.authenticated = true;
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
            }, error => {
              this.layoutProvider.presentBottomToast(error);
            });
          // this.initTimesheetListener(user);   // Wordt enkel getriggerd wanneer gebruiker is ingelogt
          authObserver.unsubscribe();  
        } else {
            if (platform.is('cordova') === true) {
              this.rootPage = 'walkthrough';
              authObserver.unsubscribe();
            } else {
              this.rootPage = 'login';
            }
          }
      });
    })
  }

  togglePage(whichPage: string): void {
    this.isTimesheet = false;
    this.isAccount = false;
    this.isArchive = false;
    this.isSettings = false; 


    let newTab: string = '';

    switch (whichPage) {
      case 'Timesheet':
        this.isTimesheet = true;
        newTab = 'timesheet';
        break;
      case 'Account':
        this.isAccount = true;
        newTab = 'account';
        break;
      case 'Archive':
        this.isArchive = true;
        newTab = 'archive';
        break;
      case 'Settings':
        this.isSettings = true;
        newTab = 'settings';
        break;
      default: 
        newTab = 'timesheet';
    }

    this.nav.setRoot(newTab);
  }

  ionViewWillUnload() {
    if (this.screenSubscription != null) {
      this.screenSubscription.unsubscribe();
    }
  }

  logOut(): void {
    this.layoutProvider.presentBottomToast('Je wordt nu uitgelogd.');
    this.authProvider.logOut()
      .then(_ => {
        setTimeout(() => {
          this.nav.setRoot('login');
        }, 1000);
      }).catch(_  => this.layoutProvider.showAlertMessage('Oeps!', 'Er ging iets mis. Probeer het opnieuw!', 'Ok'));
  }
}