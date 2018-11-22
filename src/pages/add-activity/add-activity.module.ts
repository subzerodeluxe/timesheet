import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddActivityPage } from './add-activity';
import { PipesModule } from '../../pipes/pipes.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddActivityPage
  ],
  imports: [
    IonicPageModule.forChild(AddActivityPage),
    ReactiveFormsModule,
    PipesModule
  ]
})
export class AddActivityPageModule {}
