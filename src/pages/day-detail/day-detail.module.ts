import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DayDetailPage } from './day-detail';

@NgModule({
  declarations: [
    DayDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DayDetailPage),
  ],
})
export class DayDetailPageModule {}
