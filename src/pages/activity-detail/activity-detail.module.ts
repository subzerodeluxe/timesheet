import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityDetailPage } from './activity-detail';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ActivityDetailPage
  ],
  imports: [
    IonicPageModule.forChild(ActivityDetailPage),
    ComponentsModule,
    ReactiveFormsModule,
    PipesModule
  ]
})
export class ActivityDetailPageModule {}
