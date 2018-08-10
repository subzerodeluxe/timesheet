import { NgModule } from '@angular/core';
import { BackgroundImage } from './background-image/background-image';
import { ExpandableComponent } from './expandable/expandable';
import { PreloadImage } from './preload-image/preload-image';
import { ShowHideContainer } from './show-hide-password/show-hide-container';
import { ShowHideInput } from './show-hide-password/show-hide-input';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { NoActivitiesComponent } from './no-activities/no-activities';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
	declarations: [BackgroundImage, ExpandableComponent, PreloadImage, ShowHideContainer, ShowHideInput,
    NoActivitiesComponent
    ],
	imports: [IonicModule, PipesModule, CommonModule, ReactiveFormsModule],
	exports: [BackgroundImage, ExpandableComponent, PreloadImage, ShowHideContainer, ShowHideInput,
    NoActivitiesComponent
    ]
})
export class ComponentsModule {}
