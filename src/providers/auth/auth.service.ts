import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Platform } from 'ionic-angular';
import { first, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Employee } from '../../models/employee.interface';
import { of } from 'rxjs/observable/of';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';


@Injectable()
export class AuthProvider {

  user: Observable<Employee>;

  constructor(public afAuth: AngularFireAuth, public platform: Platform, private afs: AngularFirestore,) {
    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<Employee>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })
    )

  }

  
  getAuthenticatedUser() {
    return this.afAuth.authState.pipe(first());
  }  

  async regularLogin(value: any): Promise<string> {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(value.email, value.password);
      return 'success';
    } catch (err) {
      const errorMessage = this.handleFirebaseError(err.code);
      return errorMessage;
    }
  }

  async registerAccount(value: any): Promise<string> {
    try {
      const user = await this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password);
      await this.updateUserData(user);
      return 'success';
    } catch(err) {
      console.log(err);
      const errorMessage = this.handleFirebaseError(err.code);
      return errorMessage;
    }
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

  private updateUserData(user) {
    
    return new Promise((resolve, reject) => {
      reject('Er ging iets niet goed bij het updaten van de user data')
    });
   
    // const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    // const data: Employee = {
    //   uid: user.uid,
    //   email: user.email,
    //   emailVerified: user.emailVerified,
    //   creationTime: user.metadata.creationTime 
    // };

    // return userRef.set(data, { merge: true })

  }

  private handleFirebaseError(errorCode: string): string {
    let errorMessage = '';

    switch (errorCode) {
      case ('auth/internal-error'):
        errorMessage = 'Er is een intern probleem ontstaan.';
      break;
      case ('auth/invalid-user-token'):
        errorMessage = 'Inloggegevens zijn niet langer geldig. Probeer opnieuw in te loggen.';
      break; 
      case ('auth/invalid-email'):
        errorMessage = 'Het emailadres is niet correct geformateerd.';
      break; 
      case ('auth/email-already-in-use'):
      errorMessage = 'Er bestaat al een account met dit emailadres.';
    break; 
      case ('auth/wrong-password'):
        errorMessage = 'Het wachtwoord is niet geldig.';
      break; 
      case ('auth/user-not-found'):
        errorMessage = 'De gebruiker bestaat niet. Wellicht is het profiel verwijderd.';
      break;  
      case ('auth/user-disabled'):
        errorMessage = 'Het gebruikersaccount is uitgeschakeld.';
      break;    
      case ('auth/weak-password'):
        errorMessage = 'Het wachtwoord moet minimaal 6 tekens bevatten.';
      break;    
      default:
        errorMessage = 'Er ging iets niet goed. Probeer het opnieuw.';
      break;
    }

    return errorMessage;
  }
}
