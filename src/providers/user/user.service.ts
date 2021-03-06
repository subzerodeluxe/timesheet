import { Injectable } from '@angular/core';
import { first, map, mergeMap } from 'rxjs/operators';
import { Employee } from '../../models/employee.interface';
import { Observable } from 'rxjs-compat';
import { AuthProvider } from '../auth/auth.service';
import { User } from '@firebase/auth-types';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable()
export class UserProvider {

  private profileDoc: AngularFirestoreDocument<Employee>;
  private profileCollection: AngularFirestoreCollection<any>;
  currentUser: User;

  constructor(public afs: AngularFirestore, public authProvider: AuthProvider) {
    this.profileCollection = this.afs.collection('employees');
  }

  getAuthenticatedUserProfile(): Observable<Employee> {
    return this.authProvider.getAuthenticatedUser().pipe(
      map(user => user.uid),
      mergeMap(authId => this.profileCollection.doc(authId).valueChanges()), 
      first()
    );
  }

  async saveProfile(incomingProfile: Employee, uid: string): Promise<boolean> { 
    this.profileDoc = this.profileCollection.doc(uid);
    try {
      const uploadedProfile = incomingProfile;
      await this.profileDoc.update({...uploadedProfile});
      return true;
    } 
    catch(e) {
      return false;
    } 
  }
}