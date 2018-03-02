import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonModule as GridCommonModule } from 'ng2-qgrid/common/common.module';
import { GridComponent } from './grid/grid.component';
import { GridService } from './grid/grid.service';
import { ColumnComponent } from './column/column.component';
import { ColumnListComponent } from './column/column-list.component';
import { BoxComponent } from './box/box.component';
import { CoreModule } from './core/core.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RowComponent } from './core/row/row.component';
import { LayerComponent } from './core/layer/layer.component';
import { MarkupDirective } from './markup/markup.directive';

@NgModule({
	declarations: [
		GridComponent,
		BoxComponent,
		ColumnListComponent,
		ColumnComponent,
		ToolbarComponent,
		RowComponent,
		LayerComponent,
		MarkupDirective
	],
	exports: [
		GridComponent,
		ColumnListComponent,
		ColumnComponent,
		BoxComponent,
		ToolbarComponent,
		RowComponent,
		LayerComponent,		
		GridCommonModule
	],
	imports: [
		CoreModule,
		CommonModule
	],
	providers: [
		GridService
	]
})
export class MainModule {
	constructor() {
	}
}
