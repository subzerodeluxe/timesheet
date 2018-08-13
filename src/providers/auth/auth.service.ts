import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Platform } from 'ionic-angular';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from 'firebase/app';

@Injectable()
export class AuthProvider {

  user: BehaviorSubject<User>;

  constructor(public afAuth: AngularFireAuth, public platform: Platform) {
      this.user = new BehaviorSubject<User>(null);
      this.afAuth.authState.subscribe(user => {
        if (user) { 
          this.user.next(user);
        } else {
          this.user.next(null);
        }
      });
    }

  
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
