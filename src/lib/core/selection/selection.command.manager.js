import {CompositeCommandManager} from '../command';

export class SelectionCommandManager extends CompositeCommandManager {
	constructor(model, manager) {
		super(manager);

		this.model = model;
	}

	filter(commands) {
		if (this.model.edit().state === 'edit') {
			const cell = this.model.navigation().cell;
			if (cell && cell.column.type !== 'select') {
				return [];
			}
		}

		return super.filter(commands);
	}
}
