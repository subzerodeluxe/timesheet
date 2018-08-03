import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from 'firebase/app';
import { first, map, mergeMap, take } from 'rxjs/operators';
import { Employee } from '../../models/employee.interface';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../auth/auth.service';
import { LayoutProvider } from '../layout/layout.service';

@Injectable()
export class UserProvider {

  private profileDoc: AngularFirestoreDocument<Employee>;
  loading: any;

  constructor(public afs: AngularFirestore, public authProvider: AuthProvider, public layout: LayoutProvider) {
    this.loading = this.layout.showLoading();
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
    this.loading.present();
    this.profileDoc = this.afs.collection('users').doc(user.uid);
    try {
      const uploadedProfile = incomingProfile;
      await this.profileDoc.update({...uploadedProfile});
      this.loading.dismiss();
      return true;
    } 
    catch(e) {
      console.log(e);
      this.loading.dismiss();
      return false;
    }
   
  }

}
