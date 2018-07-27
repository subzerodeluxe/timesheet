import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { first } from 'rxjs/operators';
import { Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';


@Injectable()
export class AuthProvider {

  // private isLoggedIn = false;

  constructor(public afAuth: AngularFireAuth, 
    public platform: Platform, public gPlus: GooglePlus
  ) { }

  getAuthenticatedUser() {
    return this.afAuth.authState.pipe(first());
  }

  regularLogin(value): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
          // this.isLoggedIn = true; 
        }, err => reject(err));
     });
  }

  registerAccount(value): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err)); 
    });
  }

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin(): Promise<void> {
    try {
      const gplusUser = await this.gPlus.login({
        'webClientId': '42673166780-bgc2bmlt67voom4a6ld3gh8m4pt11714.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      });

      return await this.afAuth.auth.signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
      );
    } catch(err) {
      console.log(err);
    }
  }

  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GithubAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
    } catch(err) {
      console.log(err);
    }
  }

  logOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.afAuth.auth.currentUser) {
        this.afAuth.auth.signOut();
        if (this.platform.is('cordova')) {
          this.gPlus.logout();
        }
        resolve();
      } else {
        reject();
      }
    });
  }

  // authenticated(): boolean {
  //   console.log('Auth status' , this.isLoggedIn);
  //   return this.isLoggedIn;
  // }
}
