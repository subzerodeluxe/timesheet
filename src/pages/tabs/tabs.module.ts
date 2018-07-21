import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsNavigationPage } from './tabs';

@NgModule({
  declarations: [
    TabsNavigationPage
  ],
  imports: [
    IonicPageModule.forChild(TabsNavigationPage),
  ]
})
export class TabsNavigationPageModule {}
