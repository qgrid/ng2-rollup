import {View} from '../view';
import {Log} from '../infrastructure';
import {isFunction} from '../utility';

export class ScrollView extends View {
	constructor(model, table, vscroll) {
		super(model);

		this.table = table;

		const scroll = model.scroll;
		const rowHeight = model.row().height;
		const pagination = model.pagination;
		const settings = {
			threshold: model.pagination().size,
			resetTriggers: []
		};

		if (rowHeight > 0 || isFunction(rowHeight)) {
			settings.rowHeight = rowHeight;
		}

		this.y = vscroll.factory(settings);

		this.y.container.drawEvent.on(e => {
			scroll({ cursor: e.position }, {
				source: 'scroll.view',
				behavior: 'core'
			});

			const current = Math.floor(e.position / pagination().size);
			if (current !== pagination().current) {
				pagination({ current }, {
					source: 'scroll.view',
					behavior: 'core'
				});
			}
		});

		switch (scroll().mode) {
			case 'virtual': {
				this.y.settings.fetch = (skip, take, d) => {
					model.fetch({ skip }, {
						source: 'scroll.view'
					});

					model.dataChanged.on((e, off) => {
						if (e.hasChanges('rows')) {
							const count = e.state.rows.length;
							if (pagination().count !== count) {
								pagination({ count }, {
									source: 'scroll.view',
									behavior: 'core'
								});
							}

							d.resolve(count);
							off();
						}
					});
				};

				this.using(model.sceneChanged.watch(e => {
					if (e.tag.source === 'scroll.view') {
						return;
					}

					if (e.hasChanges('status')) {
						const status = e.state.status;
						switch (status) {
							case 'start': {
								this.y.container.reset();
								break;
							}
						}
					}
				}));

				break;
			}
			default:
				this.using(model.paginationChanged.watch(() => {
					this.y.container.reset();
				}));
		}

		this.using(model.scrollChanged.watch(e => {
			if (e.hasChanges('left') || e.hasChanges('top')) {
				this.invalidate();
			}
		}));
	}

	invalidate() {
		Log.info('layout', 'invalidate scroll');

		const table = this.table;
		const scroll = this.model.scroll();

		table.view.scrollLeft(scroll.left);
		table.view.scrollTop(scroll.top);
	}

	get mode() {
		return this.model.scroll().mode;
	}
}