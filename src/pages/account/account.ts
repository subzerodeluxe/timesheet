import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { User } from '@firebase/auth-types';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { Employee } from '../../models/employee.interface';
import { FormGroup, FormControl } from '@angular/forms';

@IonicPage({
  name: 'account'
})
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage implements OnInit, OnDestroy {
  loading: any;
  profileImage: string;
  profileForm: FormGroup;
  employee = {} as Employee;
  private authenticatedEmployee$: Subscription;
  private loggedInEmployee: User;
  
  constructor(public navCtrl: NavController, 
    public userProvider: UserProvider, public navParams: NavParams, 
    public layout: LayoutProvider, public authProvider: AuthProvider) {
      this.loading = this.layout.showLoading();
    this.authenticatedEmployee$ = this.authProvider.getAuthenticatedUser().subscribe((user: User) => {
      this.loggedInEmployee = user;
    });

    this.profileForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      licensePlate: new FormControl()
    //  mileage: new FormControl()
    });
  }

  ngOnInit() {
    // this.loading.present();
    this.profileImage = './assets/images/amerongen-schilderwerken.jpg';
    this.userProvider.getAuthenticatedUser().subscribe(employeeProfile => {
      this.employee = employeeProfile;
     // this.loading.dismiss();
    });
  }

  async saveProfile(employeeObject) {
    this.loading.present();
    const result = await this.userProvider.saveProfile(this.loggedInEmployee, employeeObject);
    if (result) {
      this.loading.dismiss();
    } else {
      this.loading.dismiss();
    }
  }


  logOut(): void {
    this.loading.present();
    this.authProvider.logOut()
    .then(res => {
      this.navCtrl.setRoot('walkthrough');
      this.loading.dismiss();
      }, err => {
      this.loading.dismiss()
        .then(() => {
          console.log(err);
          this.layout.showAlertMessage('Oeps!', 'Er ging iets mis.', 'Ok');
        });
    });
  }

  ngOnDestroy(): void {
    this.authenticatedEmployee$.unsubscribe();
  }
}

