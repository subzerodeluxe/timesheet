import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { PreloadImage } from '../components/preload-image/preload-image';
import { TabsNavigationPage } from '../pages/tabs/tabs';
import { TimesheetProvider } from '../providers/timesheet/timesheet';
import { TimesheetPage } from '../pages/timesheet/timesheet';
import { HttpClientModule } from '@angular/common/http';
import { AccountPage } from '../pages/account/account';
import { BackgroundImage } from '../components/background-image/background-image';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    MyApp,
    ContactPage,
    AccountPage,
    HomePage,
    TabsNavigationPage,
    WalkthroughPage,
    PreloadImage,
    BackgroundImage,
    TimesheetPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TextMaskModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContactPage,
    AccountPage,
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
