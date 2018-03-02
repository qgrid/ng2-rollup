import { View } from '../view';
import { Command } from '../command';

export class RowView extends View {
	constructor(model, tagName) {
		super(model);

		this.tagName = tagName;

		this.drop = new Command({
			source: 'row.view',
			canExecute: e => {
				if (e.source && e.source.key === tagName) {
					const rows = model.data().rows;
					const index = e.source.value;
					return index >= 0 && rows.length > index;
				}

				return false;
			},
			execute: e => {
				const sourceIndex = e.source.value;
				const targetIndex = e.target.value;
				const data = model.data;
				const rows = Array.from(data().rows);
				const row = rows[sourceIndex];
				rows.splice(sourceIndex, 1);
				rows.splice(targetIndex, 0, row);

				data({ rows });
			}
		});

		this.drag = new Command({
			source: 'row.view',
			canExecute: e => {
				if (e.source && e.source.key === tagName) {
					const rows = model.data().rows;
					const index = e.source.value;
					return index >= 0 && rows.length > index;
				}

				return false;
			}
		});

		this.resize = new Command({
			source: 'row.view',
			canExecute: e => {
				if (e.source && e.source.key === tagName) {
					const rows = model.data().rows;
					const index = rows.indexOf(e.source.value);
					return index >= 0;
				}

				return false;
			}
		});
	}

	transfer(row) {
		return {
			key: this.tagName,
			value: row
		};
	}

	get canDrag() {
		return this.model.row().canDrag;
	}

	get canResize() {
		return this.model.row().canResize;
	}
}