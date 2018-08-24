import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { first, map, mergeMap } from 'rxjs/operators';
import { Employee } from '../../models/employee.interface';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../auth/auth.service';
import { User } from '@firebase/auth-types';

@Injectable()
export class UserProvider {

  private profileDoc: AngularFirestoreDocument<Employee>;
  private profileCollection: AngularFirestoreCollection<any>;
  currentUser: User;

  constructor(public afs: AngularFirestore, public authProvider: AuthProvider) {
    this.authProvider.getAuthenticatedUser().subscribe(user => {
      if (user) {
        this.currentUser = user;
        return;
      }
    });
    this.profileCollection = this.afs.collection('users');
  }

  getAuthenticatedUserProfile(): Observable<Employee> {
    return this.authProvider.getAuthenticatedUser().pipe(
      map(user => user.uid),
      mergeMap(authId => this.profileCollection.doc(authId).valueChanges()), 
      first()
    )
  }

  async saveProfile(incomingProfile: Employee): Promise<boolean> { 
    console.log('Current user: ', this.currentUser.uid);
    this.profileDoc = this.profileCollection.doc(this.currentUser.uid);
    try {
      const uploadedProfile = incomingProfile;
      await this.profileDoc.update({...uploadedProfile});
      return true;
    } 
    catch(e) {
      console.log('Er gaat iets niet goed. ', e);
      return false;
    } 
  }
}