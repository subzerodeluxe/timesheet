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

  profileForm: FormGroup;
  employee = {} as Employee;
  private authenticatedEmployee$: Subscription;
  public validation_messages = validation_messages;
 
  constructor(public navCtrl: NavController,
    public userProvider: UserProvider, public navParams: NavParams, 
    public layout: LayoutProvider, public authProvider: AuthProvider) {
  
      this.profileForm = new FormGroup({
        firstName: new FormControl('', Validators.compose([
          Validators.required
        ])),
        lastName: new FormControl('', Validators.compose([
          Validators.required
        ]))
      });
  }

  ngOnInit() {
    this.layout.presentLoadingDefault();
    this.authenticatedEmployee$ = this.userProvider.getAuthenticatedUserProfile().subscribe(employeeProfile => {
      this.employee = employeeProfile;
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

  ngOnDestroy(): void {
    if (this.authenticatedEmployee$ != null) {
      this.authenticatedEmployee$.unsubscribe();
    }
  }
}

