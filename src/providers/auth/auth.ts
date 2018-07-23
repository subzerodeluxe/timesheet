import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthProvider {

  private isLoggedIn = false;

  constructor(public http: HttpClient, public afAuth: AngularFireAuth) { }

  regularLogin(value): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
          this.isLoggedIn = true; 
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

  }

  logOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.afAuth.auth.currentUser){
        this.afAuth.auth.signOut();
        resolve();
      } else {
        reject();
      }
    });
  }

  authenticated(): boolean {
    console.log('Auth status' , this.isLoggedIn);
    return this.isLoggedIn;
  }
}
