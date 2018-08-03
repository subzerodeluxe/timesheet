import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from 'firebase/app';
import { first, map, mergeMap, take } from 'rxjs/operators';
import { Employee } from '../../models/employee.interface';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../auth/auth.service';

@Injectable()
export class UserProvider {

  private profileDoc: AngularFirestoreDocument<Employee>;

  constructor(public afs: AngularFirestore, public authProvider: AuthProvider) {
  }

  getAuthenticatedUser(): Observable<Employee> {
    return this.authProvider.getAuthenticatedUser().pipe(
      map(user => user.uid),
      mergeMap(authId => this.afs.collection('users').doc(authId).valueChanges()),
      first()
    );
  }


  // getCurrentUserInfo(user: User): Observable<Employee> {
  //   this.profileDoc = this.afs.collection('users').doc(user.uid);
  //   return this.profileDoc.valueChanges().pipe(first());   // pak allleen de eerste value 
  // }

  async saveProfile(user: User, incomingProfile: Employee) { 
    this.profileDoc = this.afs.collection('users').doc(user.uid);
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
