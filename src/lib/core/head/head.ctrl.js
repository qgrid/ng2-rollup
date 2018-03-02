import { View } from '../view/view';
import { PathService } from '../path';
import { parents } from '../services/dom';

export class HeadCtrl extends View {
	constructor(model, view, bag) {
		super();

		this.model = model;
		this.view = view;
		this.bag = bag;
		this.column = null;
		this.pathFinder = new PathService(this.bag.head);
		this.x = -1;
		this.y = -1;

		this.using(model.sceneChanged.watch(e => {
			if (e.hasChanges('status')) {
				const status = e.state.status;
				switch (status) {
					case 'start': {
						this.highlight(null);
						break;
					}
					case 'stop': {
						if (this.x >= 0 && this.y >= 0) {
							const target = document.elementFromPoint(this.x, this.y);
							if (target) {
								const path = parents(target);
								const cell = this.pathFinder.cell(path);
								if (cell) {
									this.highlight(cell.column);
									return;
								}
							}

							this.highlight(null);
						}

						break;
					}
				}
			}
		}));
	}

	onMouseMove(e) {
		this.x = e.clientX;
		this.y = e.clientY;

		if (this.model.scene().status === 'start') {
			return;
		}

		const cell = this.pathFinder.cell(e.path);
		if (cell) {
			this.highlight(cell.column);
		}
	}

	onMouseLeave() {
		this.x = -1;
		this.y = -1;
		this.highlight(null);
	}

	highlight(column) {
		const highlight = this.view.highlight;
		if (!highlight.column.canExecute()) {
			return;
		}

		if (this.column !== column) {
			if (this.column) {
				highlight.column.execute(this.column, false);
			}

			this.column = column;
			if (column) {
				highlight.column.execute(this.column, true);
			}
		}
	}
}