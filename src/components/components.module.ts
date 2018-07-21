import { NgModule } from '@angular/core';
import { BackgroundImage } from './background-image/background-image';
import { ExpandableComponent } from './expandable/expandable';
import { PreloadImage } from './preload-image/preload-image';
import { ShowHideContainer } from './show-hide-password/show-hide-container';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [BackgroundImage, ExpandableComponent, PreloadImage, ShowHideContainer],
	imports: [IonicModule, CommonModule],
	exports: [BackgroundImage, ExpandableComponent, PreloadImage, ShowHideContainer]
})
export class ComponentsModule {}
