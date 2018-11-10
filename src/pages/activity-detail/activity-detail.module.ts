import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityDetailPage } from './activity-detail';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ActivityDetailPage
  ],
  imports: [
    IonicPageModule.forChild(ActivityDetailPage),
    ComponentsModule,
    PipesModule
  ]
})
export class ActivityDetailPageModule {}
