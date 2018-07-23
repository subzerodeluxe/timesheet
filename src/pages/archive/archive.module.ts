import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArchivePage } from './archive';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ArchivePage
  ],
  imports: [
    IonicPageModule.forChild(ArchivePage),
    ComponentsModule
  ]
})
export class ArchivePageModule {}
