import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from 'firebase/app';
import { first, map, mergeMap, take } from 'rxjs/operators';
import { Employee } from '../../models/employee.interface';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../auth/auth.service';
import * as firebase from 'firebase/app';

@Injectable()
export class UserProvider {

  private profileDoc: AngularFirestoreDocument<Employee>;
  private currentUser: User;

  constructor(public afs: AngularFirestore, public authProvider: AuthProvider) {
    this.currentUser = firebase.auth().currentUser;
  }

  getAuthenticatedUser(): Observable<Employee> {
    return this.authProvider.getAuthenticatedUser().pipe(
      map(user => user.uid),
      mergeMap(authId => this.afs.collection('users').doc(authId).valueChanges()),
      first()
    );
  }

  async saveProfile(incomingProfile: Employee) { 
    console.log('Current user: ', this.currentUser.uid);
    this.profileDoc = this.afs.collection('users').doc(this.currentUser.uid);
    try {
      const uploadedProfile = incomingProfile;
      await this.profileDoc.update({...uploadedProfile});
      return true;
    } 
    catch(e) {
      console.log(e);
      return false;
    }
   
  }

}
