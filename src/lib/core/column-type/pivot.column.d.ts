import {ColumnView} from '../scene/view/column.view';
import {ColumnModel} from './column.model';

export declare class PivotColumnModel extends ColumnModel {
	constructor();

	rowIndex: number;
}

export declare class PivotColumn extends ColumnView {
	constructor(model: ColumnModel);
}
