import { NgModule } from '@angular/core';
import { MomentPipe } from './moment/moment';
import { WorkingHoursPipe } from './working-hours/working-hours';

@NgModule({
	declarations: [MomentPipe,
    WorkingHoursPipe],
	imports: [],
	exports: [MomentPipe,
    WorkingHoursPipe]
})
export class PipesModule {}
