import { NgModule } from '@angular/core';
import { BackgroundImage } from './background-image/background-image';
import { ExpandableComponent } from './expandable/expandable';
import { PreloadImage } from './preload-image/preload-image';
import { ShowHideContainer } from './show-hide-password/show-hide-container';
import { ShowHideInput } from './show-hide-password/show-hide-input';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [BackgroundImage, ExpandableComponent, PreloadImage, ShowHideContainer, ShowHideInput
    ],
	imports: [IonicModule, CommonModule, ReactiveFormsModule],
	exports: [BackgroundImage, ExpandableComponent, PreloadImage, ShowHideContainer, ShowHideInput
    ]
})
export class ComponentsModule {}
