import { NgModule } from '@angular/core';
import { TabTrapComponent } from './tab-trap.component';
import { TemplateModule } from 'ng2-qgrid/template/template.module';
import { TabtrapInDirective } from './tab-trap-in.directive';

@NgModule({
	declarations: [
		TabTrapComponent,
		TabtrapInDirective
	],
	exports: [
		TabTrapComponent,
		TabtrapInDirective
	],
	imports: [
		TemplateModule
	]
})
export class TabTrapModule {
}
