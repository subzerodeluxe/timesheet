import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { first, map, mergeMap } from 'rxjs/operators';
import { Employee } from '../../models/employee.interface';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase/app';
import { AuthProvider } from '../auth/auth.service';

@Injectable()
export class UserProvider {

  private profileDoc: AngularFirestoreDocument<Employee>;
  private profileCollection: AngularFirestoreCollection<any>;
  private currentUser: User;

  constructor(public afs: AngularFirestore, public authProvider: AuthProvider) {
    
    this.profileCollection = this.afs.collection('users');
    this.authProvider.user.subscribe(user => {
      this.currentUser = user;
      this.profileDoc = this.profileCollection.doc(this.currentUser.uid);
    })
  }

  getAuthenticatedUserProfile(): Observable<Employee> {
    return this.authProvider.getAuthenticatedUser().pipe(
      map(user => user.uid),
      mergeMap(authId => this.profileCollection.doc(authId).valueChanges()),
      first()
    );
  }

  createUserProfile() {
    return new Promise<any>((resolve, reject) => {
      let basicUser: Employee = {
        uid: this.currentUser.uid,
        email: this.currentUser.email,
        creationTime: this.currentUser.metadata.creationTime,
        emailVerified: this.currentUser.emailVerified
      };
     
      this.profileDoc.set({...basicUser})
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  async saveProfile(incomingProfile: Employee) { 
    // console.log('Current user: ', this.currentUser.uid);
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