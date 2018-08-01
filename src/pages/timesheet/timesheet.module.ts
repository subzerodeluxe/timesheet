import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimesheetPage } from './timesheet';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    TimesheetPage
  ],
  imports: [
    IonicPageModule.forChild(TimesheetPage),
    ComponentsModule
  ]
})
export class TimesheetPageModule {}
