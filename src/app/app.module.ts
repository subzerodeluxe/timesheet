import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { TextMaskModule } from 'angular2-text-mask';
import { Keyboard } from '@ionic-native/keyboard';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

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
import { CarInputComponent } from '../components/car-input/car-input';
import { PrivacyPolicyComponent } from '../components/privacy-policy/privacy-policy';
import { PdfProvider } from '../providers/pdf/pdf';
 
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
    MyApp,
    CarInputComponent,
    PrivacyPolicyComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: FunctionsRegionToken, useValue: 'us-central1' },
    TimesheetProvider,
    Keyboard,
    NativePageTransitions,
    File,
    FileOpener,
    AuthProvider,
    LayoutProvider,
    UserProvider,
    LocalNotifications,
    LocalNotificationService,
    PdfProvider
  ]
})
export class AppModule {}
