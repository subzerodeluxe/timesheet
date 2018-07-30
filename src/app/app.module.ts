import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler, Scroll } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { TextMaskModule } from 'angular2-text-mask';
import { Keyboard } from '@ionic-native/keyboard';

// Providers
import { TimesheetProvider } from '../providers/timesheet/timesheet.service';
import { AuthProvider } from '../providers/auth/auth.service';
import { LayoutProvider } from '../providers/layout/layout.service';
import { UserProvider } from '../providers/user/user.service';


// Angular Fire
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environment/environment';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';
import { CommonModule } from '@angular/common';
import { GooglePlus } from '@ionic-native/google-plus';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
			modalEnter: 'modal-slide-in',
			modalLeave: 'modal-slide-out',
			pageTransition: 'ios-transition',
      swipeBackEnabled: false,
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    ComponentsModule,
    DirectivesModule,
    TextMaskModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TimesheetProvider,
    Keyboard,
    GooglePlus,
    AuthProvider,
    LayoutProvider,
    UserProvider
  ]
})
export class AppModule {}
