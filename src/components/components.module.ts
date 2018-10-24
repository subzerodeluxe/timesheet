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
import { SkeletonItemComponent } from './skeleton-item/skeleton-item';

@NgModule({
	declarations: [BackgroundImage, ExpandableComponent, PreloadImage, ShowHideContainer, ShowHideInput,
    NoActivitiesComponent,
    SkeletonItemComponent
    ],
	imports: [IonicModule, PipesModule, CommonModule, ReactiveFormsModule],
	exports: [BackgroundImage, ExpandableComponent, PreloadImage, ShowHideContainer, ShowHideInput,
    NoActivitiesComponent,
    SkeletonItemComponent
    ]
})
export class ComponentsModule {}
