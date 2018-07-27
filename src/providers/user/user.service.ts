import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from 'firebase/app';
import { Profile } from '../../models/profile.interface';
import { first } from 'rxjs/operators';

@Injectable()
export class UserProvider {

  private profileDoc: AngularFirestoreDocument<Profile>;

  constructor(public afs: AngularFirestore) {
  }


  getCurrentUserInfo(user: User) {
    this.profileDoc = this.afs.collection('users').doc(user.uid);
    return this.profileDoc.valueChanges().pipe(first());   // pak allleen de eerste value 
  }

  async saveProfile(user: User, incomingProfile: Profile) {
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
