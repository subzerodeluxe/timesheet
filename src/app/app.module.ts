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
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

// Providers
import { TimesheetProvider } from '../providers/timesheet/timesheet.service';
import { AuthProvider } from '../providers/auth/auth.service';
import { LayoutProvider } from '../providers/layout/layout.service';
import { UserProvider } from '../providers/user/user.service';

// Angular Fire imports 
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
import { environment } from '../environment/environment';

// Other modules
import { ComponentsModule } from '../components/components.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { LocalNotificationService } from '../providers/local-notification-service/local-notification.service';

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
    PipesModule,
    TextMaskModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: FunctionsRegionToken, useValue: 'us-central1' },
    TimesheetProvider,
    Keyboard,,
    NativePageTransitions,
    AuthProvider,
    LayoutProvider,
    UserProvider,
    LocalNotifications,
    LocalNotificationService
  ]
})
export class AppModule {}
