import { NgModule } from '@angular/core';
import { BlurOnScrollDirective } from './blur-on-scroll/blur-on-scroll';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [BlurOnScrollDirective],
	imports: [CommonModule],
	exports: [BlurOnScrollDirective]
})
export class DirectivesModule {}
