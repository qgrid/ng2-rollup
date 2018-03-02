import {ColumnView} from '../scene/view';
import {ColumnModel} from './column.model';
import {TemplatePath} from '../template';

TemplatePath.register('pivot-cell', (template) => {
	return {
		model: 'pivot',
		resource: template.for
	};
});

export class PivotColumnModel extends ColumnModel {
	constructor() {
		super('pivot');

		this.key = '$pivot';
		this.title = 'Pivot';

		this.source = 'generation';
		this.class = 'pivot';
		this.canEdit = false;
		this.canSort = false;
		this.canResize = false;
		this.width = 60;
		this.rowIndex = 0;
	}
}

export class PivotColumn extends ColumnView {
	constructor(model) {
		super(model);
	}

	static model(model) {
		return model ? PivotColumn.assign(model) : new PivotColumnModel();
	}
}