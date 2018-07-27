import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth.service';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '@firebase/auth-types';

@IonicPage({
  name: 'account'
})
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage implements OnDestroy {

  profileForm: FormGroup;
  profileImage: string;
  private authenticatedUser$: Subscription;
  private loggedInUser: User;
  
  constructor(public navCtrl: NavController, 
    public userProvider: UserProvider, public navParams: NavParams, public authProvider: AuthProvider) {
    
    this.authenticatedUser$ = this.authProvider.getAuthenticatedUser().subscribe((user: User) => {
      this.loggedInUser = user;
    });

    this.profileForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      licensePlate: new FormControl(),
      mileage: new FormControl()
    });
  }

  ionViewDidLoad() {
    this.profileImage = './assets/images/amerongen-schilderwerken.jpg';
    this.userProvider.getCurrentUserInfo(this.loggedInUser)
      .subscribe((userObject) => {
        console.log('Ingeladen user: ', userObject);
      })
  }

  async saveProfile(profileObject) {
    console.log('Gesaved profiel: ', profileObject);
    const result = this.userProvider.saveProfile(this.loggedInUser, profileObject);
    console.log(result);
  }


  // ionViewCanEnter() {
  //   return this.authProvider.authenticated();
  // }

  logOut(): void {
    this.authProvider.logOut()
    .then(res => {
      console.log('Success!');
      this.navCtrl.setRoot('login');
      }, err => {
      console.log(err);
    });
  }

  ngOnDestroy(): void {
    this.authenticatedUser$.unsubscribe();
  }
}

