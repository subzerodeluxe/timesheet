import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs/Subscription';
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

  profileImage: string;
  profileForm: FormGroup;
  employee = {} as Employee;
  private authenticatedEmployee$: Subscription;
 
  constructor(public navCtrl: NavController, 
    public userProvider: UserProvider, public navParams: NavParams, 
    public layout: LayoutProvider, public authProvider: AuthProvider) {
     
    this.profileForm = new FormGroup({
      firstName: new FormControl(),
      lastName: new FormControl(),
      licensePlate: new FormControl()
    });
  }

  ngOnInit() {
    this.layout.presentLoadingDefault();
    this.profileImage = './assets/images/amerongen-schilderwerken.jpg';
    this.authenticatedEmployee$ = this.userProvider.getAuthenticatedUserProfile().subscribe(employeeProfile => {
      this.employee = employeeProfile;
      console.log(this.employee);
    });
  }

  async saveProfile(employeeObject: any) {
    let emObject: Employee = { firstName: employeeObject.firstName, lastName: employeeObject.lastName, vehicleInformation: { licensePlate: employeeObject.licensePlate }};
    this.layout.presentLoadingDefault(); 
    const result = await this.userProvider.saveProfile(emObject);
    if (result) {
      this.layout.presentBottomToast('Profiel succesvol bijgewerkt');
    } else {
      this.layout.presentBottomToast('Profiel niet bijgwerkt. Probeer het opnieuw');
    }
  }


  logOut(): void {
    this.authProvider.logOut()
      .then(res => {
        this.navCtrl.setRoot('walkthrough');
      }).catch(_  => this.layout.showAlertMessage('Oeps!', 'Er ging iets mis.', 'Ok'));
  }

  ngOnDestroy(): void {
    this.authenticatedEmployee$.unsubscribe();
  }
}

