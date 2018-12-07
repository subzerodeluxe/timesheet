import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs-compat';
import { Employee } from '../../models/employee.interface';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '@firebase/auth-types';
import { TimesheetProvider } from '../timesheet/timesheet.service';


@Injectable()
export class AuthProvider {

  errorMessage: string;

  constructor(public afAuth: AngularFireAuth, public time: TimesheetProvider, public platform: Platform, private afs: AngularFirestore) {}


  getAuthenticatedUser(): Observable<User> {
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
      const user = await this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.matching_passwords.password);
      console.log('Wat is de user?', user.user.metadata.creationTime);
      await this.createUserProfileOnRegister(user);
      return 'success';
    } catch(err) {
      console.log(err);
      const authError = err.code.startsWith('auth');
      if (authError == true) {
        this.errorMessage = this.handleFirebaseError(err.code);
      } else {
        this.deleteAuthenticatedUserAccount()
          .then(_ => console.log('AUTHENTICATED USER DELETED!'))
          .catch(_ => this.errorMessage = this.handleFirebaseError(err));
        this.errorMessage = this.handleFirebaseError(err);
      }
      return this.errorMessage;
    }
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  private deleteAuthenticatedUserAccount() {
    return this.afAuth.auth.currentUser.delete();
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

  createUserProfileOnRegister(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`employees/${user.user.uid}`);
  
    const data: Employee = {
      uid: user.user.uid,
      email: user.user.email,
      creationTime: user.user.metadata.creationTime
    };

    return userRef.set(data); 
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
        errorMessage = 'Geen geldig emailadres.';
      break; 
      case ('auth/email-already-in-use'):
      errorMessage = 'Er bestaat al een account met dit emailadres.';
    break; 
      case ('auth/wrong-password'):
        errorMessage = 'Verkeerd wachtwoord. Probeer het opnieuw.';
      break; 
      case ('auth/user-not-found'):
        errorMessage = 'De gebruiker bestaat (nog) niet. Maak een nieuw account aan.';
      break;  
      case ('auth/user-disabled'):
        errorMessage = 'Het gebruikersaccount is (tijdelijk) uitgeschakeld.';
      break;    
      case ('auth/weak-password'):
        errorMessage = 'Het wachtwoord moet minimaal 6 tekens bevatten.';
      break;    
      default:
        errorMessage = 'Kon gebruiker niet registreren. Probeer het nog een keer.';
      break;
    }

    return errorMessage;
  }
}
