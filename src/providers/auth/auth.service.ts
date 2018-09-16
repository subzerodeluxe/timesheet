import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Employee } from '../../models/employee.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from 'firebase';


@Injectable()
export class AuthProvider {

  errorMessage: string;

  constructor(public afAuth: AngularFireAuth, public platform: Platform, private afs: AngularFirestore) {
  
  }

  /* CURRENT USER MOET EENMALIG WORDEN OPGEHAALD: DAARNA DOORGESTUURD VIA SUBJECT */

  
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
      console.log('Valid string? ', value.matching_passwords.password);
      const user = await this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.matching_passwords.password);
      await this.createUserProfileOnRegister(user);
      return 'success';
    } catch(err) {
      console.log(err);
      const authError = err.code.startsWith('auth');
      if (authError == true) {
        console.log('Error vanuit authenticatie method');
        this.errorMessage = this.handleFirebaseError(err.code);
      } else {
        console.log('Error creating user profile');
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

  createUserProfileOnRegister(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`employees/${user.uid}`);
  
    const data: Employee = {
      uid: user.uid,
      email: user.email,
      creationTime: user.metadata.creationTime,
      vehicleInformation: {
        licensePlate: '',
        vehicleNotPresent: true
      }
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
        errorMessage = 'Het emailadres is niet correct geformateerd.';
      break; 
      case ('auth/email-already-in-use'):
      errorMessage = 'Er bestaat al een account met dit emailadres.';
    break; 
      case ('auth/wrong-password'):
        errorMessage = 'Het wachtwoord is niet juist.';
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
