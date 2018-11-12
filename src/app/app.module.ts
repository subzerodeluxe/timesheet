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

// Providers
import { TimesheetProvider } from '../providers/timesheet/timesheet.service';
import { AuthProvider } from '../providers/auth/auth.service';
import { LayoutProvider } from '../providers/layout/layout.service';
import { UserProvider } from '../providers/user/user.service';

// Angular Fire imports 
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environment/environment';

// Other modules
import { ComponentsModule } from '../components/components.module';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';

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
    TimesheetProvider,
    Keyboard,
    NativePageTransitions,
    AuthProvider,
    LayoutProvider,
    UserProvider
  ]
})
export class AppModule {}
