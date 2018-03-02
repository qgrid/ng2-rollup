import {columnFactory} from '../column/column.factory';
import {generateFactory} from '../column-list';

export function dataPipe(data, context, next) {
	const model = context.model;
	addDataRows(model, data);
	addDataColumns(model);
	next(data);
}

function addDataRows(model, rows) {
	model.data({rows}, {source: 'data.pipe', behavior: 'core'});
}

function addDataColumns(model) {
	const getColumns = generateFactory(model);
	const createColumn = columnFactory(model);
	const result = getColumns();
	const columns = result.columns.map(columnBody => createColumn(columnBody.type || 'text', columnBody).model);

	if (result.hasChanges) {
		model.data({columns}, {source: 'data.pipe', behavior: 'core'});
	}
}