import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
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
 
  constructor(public navCtrl: NavController, 
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
    console.log("Toggled: "+ this.isToggled); 
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
      if (employeeProfile.vehicleInformation.licensePlate === null) {
        this.licensePlate = '';
      } else {
        this.licensePlate = employeeProfile.vehicleInformation.licensePlate;
      }
      console.log('Opgehaalde account: ', this.employee);
    }, err => {
      console.error('Oops:', err.message);
    });
  }

  async saveProfile(employeeObject: any) {
    let emObject: Employee = { firstName: employeeObject.firstName, lastName: employeeObject.lastName, 
        vehicleInformation: { licensePlate: employeeObject.licensePlate, vehicleNotPresent: employeeObject.vehicleNotPresent }};
    this.layout.presentLoadingDefault(); 
    const result = await this.userProvider.saveProfile(emObject, this.employee.uid);
    if (result) {
      this.layout.presentBottomToast('Profiel succesvol bijgewerkt.');
    } else {
      this.layout.presentBottomToast('Profiel niet bijgwerkt. Probeer het opnieuw.');
    }
  }

  ngOnDestroy(): void {
    if (this.authenticatedEmployee$ != null) {
      this.authenticatedEmployee$.unsubscribe();
    }
  }
}

