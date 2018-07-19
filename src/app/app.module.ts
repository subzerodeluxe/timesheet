import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, Scroll } from 'ionic-angular';
import { MyApp } from './app.component';
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
import { AddActivityPage } from '../pages/add-activity/add-activity';
import { ActivityDetailPage } from '../pages/activity-detail/activity-detail';
import { ExpandableComponent } from '../components/expandable/expandable';
import { ArchivePage } from '../pages/archive/archive';
import { SettingsPage } from '../pages/settings/settings';
import { BlurOnScrollDirective } from '../directives/blur-on-scroll/blur-on-scroll';

@NgModule({
  declarations: [
    MyApp,
    AccountPage,
    TabsNavigationPage,
    WalkthroughPage,
    PreloadImage,
    BackgroundImage,
    ExpandableComponent,
    TimesheetPage,
    ActivityDetailPage,
    AddActivityPage,
    ArchivePage,
    SettingsPage,
    BlurOnScrollDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TextMaskModule,
    IonicModule.forRoot(MyApp, {
			modalEnter: 'modal-slide-in',
			modalLeave: 'modal-slide-out',
			pageTransition: 'ios-transition',
			swipeBackEnabled: false
		})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AccountPage,
    TabsNavigationPage,
    WalkthroughPage,
    TimesheetPage,
    ActivityDetailPage,
    AddActivityPage,
    ArchivePage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TimesheetProvider
  ]
})
export class AppModule {}
