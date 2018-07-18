import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { PreloadImage } from '../components/preload-image/preload-image';
import { TabsNavigationPage } from '../pages/tabs/tabs';
import { TimesheetProvider } from '../providers/timesheet/timesheet';
import { TimesheetPage } from '../pages/timesheet/timesheet';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsNavigationPage,
    WalkthroughPage,
    PreloadImage,
    TimesheetPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsNavigationPage,
    WalkthroughPage,
    TimesheetPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TimesheetProvider
  ]
})
export class AppModule {}
