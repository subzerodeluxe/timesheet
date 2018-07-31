import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from 'firebase/app';
import { first } from 'rxjs/operators';
import { Employee } from '../../models/employee.interface';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserProvider {

  private profileDoc: AngularFirestoreDocument<Employee>;

  constructor(public afs: AngularFirestore) {
  }


  getCurrentUserInfo(user: User): Observable<Employee> {
    this.profileDoc = this.afs.collection('users').doc(user.uid);
    return this.profileDoc.valueChanges().pipe(first());   // pak allleen de eerste value 
  }

  async saveProfile(user: User, incomingProfile: Employee) {
    console.log('Current userID: ', user.uid, '. Profile: ', incomingProfile);

    this.profileDoc = this.afs.collection('users').doc(user.uid);

    try {
      const uploadedProfile = { firstName: incomingProfile.firstName, lastName: incomingProfile.lastName, email: 'test@test.nl'};
      await this.profileDoc.set({...uploadedProfile});
      return true;
    } 
    catch(e) {
      console.log(e);
      return false;
    }
   
  }

}
