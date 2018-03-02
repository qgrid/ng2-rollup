import { View } from '../view';

export class PaginationView extends View {
	constructor(model) {
		super(model);

		const triggers = model.pagination().resetTriggers;
		Object.keys(triggers)
			.forEach(name =>
				this.using(model[name + 'Changed']
					.on(e => {
						if (e.tag.behavior === 'core') {
							return;
						}

						const trigger = triggers[name];
						for (const key of trigger) {
							if (e.hasChanges(key)) {
								model.pagination({ current: 0 }, { source: 'pagination.view' });
							}
						}
					})));
	}

	get current() {
		return this.model.pagination().current;
	}

	get size() {
		return this.model.pagination().size;
	}
}