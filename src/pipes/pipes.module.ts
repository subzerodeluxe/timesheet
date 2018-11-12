import { NgModule } from '@angular/core';
import { MomentPipe } from './moment/moment';
import { WorkingHoursPipe } from './working-hours/working-hours';
import { CounterFormatPipe } from './counter-format/counter-format';
@NgModule({
	declarations: [MomentPipe,
    WorkingHoursPipe,
    CounterFormatPipe],
	imports: [],
	exports: [MomentPipe,
    WorkingHoursPipe,
    CounterFormatPipe]
})
export class PipesModule {}
