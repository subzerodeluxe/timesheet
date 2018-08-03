import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { first } from 'rxjs/operators';
import { Platform } from 'ionic-angular';


@Injectable()
export class AuthProvider {

  constructor(public afAuth: AngularFireAuth, 
    public platform: Platform
  ) { }

  // getCurrentUser(): firebase.User {
  //   return this.afAuth.auth.currentUser;
  // }

  getAuthenticatedUser() {
    return this.afAuth.authState.pipe(first());
  }  

  regularLogin(value): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
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

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.afAuth.auth.currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      } else {
        reject();
      }
    });
  }
}
