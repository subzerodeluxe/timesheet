import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.service';
import { UserProvider } from '../../providers/user/user.service';
import { Subscription } from 'rxjs/Subscription';
import { LayoutProvider } from '../../providers/layout/layout.service';
import { Employee } from '../../models/employee.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validation_messages } from '../../app/app.config';

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
  licensePlate: string;
  public isToggled: boolean;
  checked: boolean;
  private authenticatedEmployee$: Subscription;
  public validation_messages = validation_messages;
 
  constructor(public navCtrl: NavController, public app: App,
    public userProvider: UserProvider, public navParams: NavParams, 
    public layout: LayoutProvider, public authProvider: AuthProvider) {
    
      this.isToggled = false;
      this.checked = false;
      this.profileForm = new FormGroup({
        firstName: new FormControl('', Validators.compose([
          Validators.required
        ])),
        lastName: new FormControl('', Validators.compose([
          Validators.required
        ])),
        licensePlate: new FormControl(),
        vehicleNotPresent: new FormControl()
      });
  }

  vehicleIsToggled() {
    if (this.isToggled === true) {
      this.checked = true;  // No vehicle
      this.profileForm.get('licensePlate').setValue('');
    } else {
      this.checked = false;
    }
  }

  ngOnInit() {
    this.layout.presentLoadingDefault();
    this.profileImage = './assets/images/amerongen-schilderwerken.jpg';
    this.authenticatedEmployee$ = this.userProvider.getAuthenticatedUserProfile().subscribe(employeeProfile => {
      this.employee = employeeProfile;
      if (employeeProfile.vehicleInformation.licenseplate === null) {
        this.licensePlate = '';
      } else {
        this.licensePlate = employeeProfile.vehicleInformation.licenseplate;
      }
      console.log('Opgehaalde account: ', this.employee);
    }, err => {
      console.error('Oops:', err.message);
    });
  }

  async saveProfile(employeeObject: any) {
    let emObject: Employee = { firstName: employeeObject.firstName, lastName: employeeObject.lastName};
    this.layout.presentLoadingDefault(); 
    const result = await this.userProvider.saveProfile(emObject, this.employee.uid);
    if (result) {
      this.layout.presentBottomToast('Profiel succesvol bijgewerkt.');
      this.navCtrl.setRoot('timesheet');
    } else {
      this.layout.presentBottomToast('Profiel niet bijgwerkt. Probeer het opnieuw.');
    }
  }

  logOut(): void {
    this.authProvider.logOut()
      .then(_ => {
        this.app.getRootNav().setRoot('login');
      }).catch(_  => this.layout.showAlertMessage('Oeps!', 'Er ging iets mis. Probeer het opnieuw!', 'Ok'));
  }


  ngOnDestroy(): void {
    if (this.authenticatedEmployee$ != null) {
      this.authenticatedEmployee$.unsubscribe();
    }
  }
}

