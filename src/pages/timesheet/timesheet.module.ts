import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimesheetPage } from './timesheet';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    TimesheetPage
  ],
  imports: [
    IonicPageModule.forChild(TimesheetPage),
    PipesModule,
    ComponentsModule
  ]
})
export class TimesheetPageModule {}
