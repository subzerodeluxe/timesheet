import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LayoutProvider } from '../providers/layout/layout.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, 
    public afAuth: AngularFireAuth, public layoutService: LayoutProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      const authObserver = afAuth.authState.subscribe( user => {
        if (user) {
          this.rootPage = 'tabs';
          this.layoutService.presentTopToast(`Welkom terug ${user.email}`);
          authObserver.unsubscribe();  
        } else {
          this.rootPage = 'login';
          authObserver.unsubscribe();
        }
      });
    });
  }
}
