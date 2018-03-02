import {ColumnView} from '../scene/view';
import {DataColumnModel} from './data.column.model';
import {TemplatePath} from '../template';

TemplatePath.register('currency-cell', (template, column) => {
	return {
		model: template.for,
		resource: column.key
	};
});

TemplatePath.register('currency-cell-edit', (template, column) => {
	return {
		model: 'edit',
		resource: column.key
	};
});


export class CurrencyColumnModel extends DataColumnModel {
	constructor() {
		super('text');

		this.maxLength = 20;
		this.symbol = '$';
		this.code = 'USD';
	}
}

export class CurrencyColumn extends ColumnView {
	constructor(model) {
		super(model);
	}

	static model(model) {
		return model ? CurrencyColumn.assign(model) : new CurrencyColumnModel();
	}
}