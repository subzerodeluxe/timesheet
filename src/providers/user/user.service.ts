import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from 'firebase/app';
import { Profile } from '../../models/profile.interface';

@Injectable()
export class UserProvider {

  private profileDoc: AngularFirestoreDocument<Profile>;

  constructor(public afs: AngularFirestore) {
  }

  getCurrentUserInfo(user: User) {
    this.profileDoc = this.afs.collection('users').doc(user.uid);
    return this.profileDoc.valueChanges();
  }

  async saveProfile(user: User, incomingProfile: Profile) {
    console.log('Current userID: ', user.uid, '. Profile: ', incomingProfile);

    this.profileDoc = this.afs.collection('users').doc(user.uid);

    try {
      await this.profileDoc.set(Object.assign({}, incomingProfile));
      return true;
    } 
    catch(e) {
      console.log(e);
      return false;
    }
   
  }

}
