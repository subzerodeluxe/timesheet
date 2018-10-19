import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddActivityPage } from './add-activity';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    AddActivityPage
  ],
  imports: [
    IonicPageModule.forChild(AddActivityPage),
    PipesModule
  ]
})
export class AddActivityPageModule {}
