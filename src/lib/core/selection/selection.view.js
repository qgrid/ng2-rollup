import { View } from '../view';
import { AppError } from '../infrastructure';
import { Command } from '../command';
import { selectionStateFactory as stateFactory } from './state';
import { SelectionRange } from './selection.range';
import { SelectionService } from './selection.service';
import { GRID_PREFIX } from '../definition';
import { noop, isUndefined } from '../utility';
import { SelectionCommandManager } from './selection.command.manager';

export class SelectionView extends View {
	constructor(model, table, commandManager) {
		super(model);

		this.table = table;

		this.selectionService = new SelectionService(model);
		this.selectionState = stateFactory(model, this.selectionService);
		this.selectionRange = new SelectionRange(model);

		const selectionCommandManager = new SelectionCommandManager(model, commandManager);
		const shortcut = model.action().shortcut;
		const commands = this.commands;

		this.using(shortcut.register(selectionCommandManager, commands));

		this.toggleRow = commands.get('toggleRow');
		this.toggleColumn = commands.get('toggleColumn');
		this.toggleCell = commands.get('toggleCell');
		this.reset = commands.get('reset');

		this.using(model.navigationChanged.watch(e => {
			if (e.tag.source === 'selection.view') {
				return;
			}

			if (e.hasChanges('cell')) {
				if (this.toggleCell.canExecute(e.state.cell)) {
					this.toggleCell.execute(e.state.cell);
				}
			}
		}));

		const modeClass = `${GRID_PREFIX}-select-${model.selection().mode}`;
		const unitClass = `${GRID_PREFIX}-select-${model.selection().unit}`;
		const view = table.view;
		view.addClass(modeClass);
		view.addClass(unitClass);

		this.using(model.selectionChanged.watch(e => {
			if (e.hasChanges('mode')) {
				const newModeClass = `${GRID_PREFIX}-select-${e.state.mode}`;
				const oldModeClass = `${GRID_PREFIX}-select-${e.changes.mode.oldValue}`;

				view.removeClass(oldModeClass);
				view.addClass(newModeClass);
			}

			if (e.hasChanges('unit')) {
				const newUnitClass = `${GRID_PREFIX}-select-${e.state.unit}`;
				const oldUnitClass = `${GRID_PREFIX}-select-${e.changes.unit.oldValue}`;

				view.removeClass(oldUnitClass);
				view.addClass(newUnitClass);
			}

			if (e.hasChanges('unit') || e.hasChanges('mode')) {
				if (!e.hasChanges('items')) {
					this.selectionState.clear();
					model.selection({ items: [] }, {
						source: 'selection.view'
					});

					this.selectionState = stateFactory(model, this.selectionService);
				}
			}

			if (e.hasChanges('items') && e.tag.source !== 'selection.view') {
				// Don't use commit it came outside already

				const oldEntries = this.selectionService.lookup(e.changes.items.oldValue);
				this.select(oldEntries, false);

				const newEntries = this.selectionService.lookup(e.state.items);
				this.select(newEntries, true);
			}
		}));
	}

	get commands() {
		const model = this.model;
		const shortcut = model.selection().shortcut;

		const toggleActiveRow = new Command({
			source: 'selection.view',
			canExecute: () => model.selection().unit === 'row' && this.rows.length > 0,
			execute: () => {
				const navState = model.navigation();
				const rowIndex = navState.rowIndex;

				const row = this.rows[rowIndex >= 0 ? rowIndex : rowIndex + 1];
				const commit = this.toggle(row);
				commit();
			},
			shortcut: shortcut.toggleRow
		});

		const commands = {
			toggleCell: new Command({
				source: 'selection.view',
				canExecute: item => {
					const selectionState = model.selection();
					return item && selectionState.mode !== 'range' && (selectionState.unit === 'cell' || selectionState.unit === 'mix');
				},
				execute: (item, source) => {
					const selectionState = model.selection();
					switch (selectionState.unit) {
						case 'cell': {
							const commit = this.toggle(item, source);
							commit();
							break;
						}
						case 'mix': {
							if (item.column.type === 'row-indicator') {
								const commit = this.toggle({ item: item.row, unit: 'row' }, source);
								commit();
								break;
							}
							else {
								const commit = this.toggle({ item: item, unit: 'cell' }, source);
								commit();
								break;
							}
						}
					}
				}
			}),
			toggleRow: new Command({
				source: 'selection.view',
				execute: (item, source) => {
					const commit = this.toggle(item, source);
					commit();
				}
			}),
			toggleColumn: new Command({
				source: 'selection.view',
				execute: (item, source) => {
					const commit = this.toggle(item, source);
					commit();
				}
			}),
			commitRow: new Command({
				source: 'selection.view',
				canExecute: () => {
					const column = model.navigation().column;
					return column && column.type === 'select';
				},
				execute: () => {
					if (toggleActiveRow.canExecute()) {
						toggleActiveRow.execute();
					}
				},
				shortcut: model.edit().commitShortcuts['select'] || ''
			}),
			toggleActiveRow: toggleActiveRow,
			togglePrevRow: new Command({
				source: 'selection.view',
				canExecute: () => model.selection().unit === 'row' && model.navigation().rowIndex > 0,
				execute: () => {
					const navState = model.navigation();
					const rowIndex = navState.rowIndex;
					const row = this.rows[rowIndex];
					const commit = this.toggle(row);
					commit();

					this.navigateTo(rowIndex - 1, navState.columnIndex);
				},
				shortcut: shortcut.togglePreviousRow
			}),
			toggleNextRow: new Command({
				source: 'selection.view',
				canExecute: () => model.selection().unit === 'row' && model.navigation().rowIndex < this.rows.length - 1,
				execute: () => {
					const navState = model.navigation();
					const rowIndex = navState.rowIndex;
					const row = this.rows[rowIndex];
					const commit = this.toggle(row);
					commit();

					this.navigateTo(rowIndex + 1, navState.columnIndex);
				},
				shortcut: shortcut.toggleNextRow
			}),
			toggleActiveColumn: new Command({
				source: 'selection.view',
				canExecute: () => model.selection().unit === 'column' && model.navigation().columnIndex >= 0,
				execute: () => {
					const columnIndex = model.navigation().columnIndex;
					const column = this.columns[columnIndex];
					const commit = this.toggle(column);
					commit();
				},
				shortcut: shortcut.toggleColumn
			}),
			toggleNextColumn: new Command({
				source: 'selection.view',
				canExecute: () => model.selection().unit === 'column' && model.navigation().columnIndex < this.columns.length - 1,
				execute: () => {
					const navState = model.navigation();
					const columnIndex = navState.columnIndex;
					const column = this.columns[columnIndex];
					const commit = this.toggle(column);
					commit();

					this.navigateTo(navState.rowIndex, columnIndex + 1);
				},
				shortcut: shortcut.toggleNextColumn
			}),
			togglePrevColumn: new Command({
				source: 'selection.view',
				canExecute: () => model.selection().unit === 'column' && model.navigation().columnIndex > 0,
				execute: () => {
					const navState = model.navigation();
					const columnIndex = navState.columnIndex;
					const column = this.columns[columnIndex];
					const commit = this.toggle(column);
					commit();

					this.navigateTo(navState.rowIndex, columnIndex - 1);
				},
				shortcut: shortcut.togglePreviousColumn
			}),
			selectAll: new Command({
				source: 'selection.view',
				canExecute: () => model.selection().mode === 'multiple',
				execute: () => {
					let entries = [];
					switch (model.selection().unit) {
						case 'row': {
							entries = model.data().rows;
							break;
						}
						case 'column': {
							entries = model.data().columns;
							break;
						}
						case 'cell':
						case 'mix': {
							const buildRange = this.selectionRange.build();
							const body = this.table.body;
							const startCell = body.cell(0, 0);
							const endCell = body.cell(body.rowCount() - 1, body.columnCount() - 1);
							entries = buildRange(startCell, endCell);
							break;
						}
						default:
							throw new AppError('selection.view', `Invalid unit ${model.selection().unit}`);
					}

					const commit = this.select(entries, true);
					commit();
				},
				shortcut: shortcut.selectAll
			})
		};

		return new Map(
			Object.entries(commands)
		);
	}

	selectRange(startCell, endCell, source) {
		const buildRange = this.selectionRange.build();
		const range = buildRange(startCell, endCell);
		const commit = this.select(range, true, source);
		commit();
	}

	toggle(items, source = 'custom') {
		const toggle = this.model.selection().toggle;
		const e = {
			items,
			source,
			kind: 'toggle'
		};

		if (toggle.canExecute(e)) {
			toggle.execute(e);

			const selectionState = this.selectionState;
			if (!arguments.length || isUndefined(items)) {
				items = this.model.view().rows;
			}

			selectionState.toggle(items);

			return () => {
				const items = this.selectionService.map(selectionState.entries());
				this.model.selection({ items }, {
					source: 'selection.view'
				});
			};
		} else {
			return noop;
		}
	}

	select(items, state, source = 'custom') {
		const toggle = this.model.selection().toggle;
		const e = {
			items,
			state,
			source,
			kind: 'select'
		};

		if (toggle.canExecute(e)) {
			toggle.execute(e);
			const selectionState = this.selectionState;
			selectionState.select(items, state);

			return () => {
				const items = this.selectionService.map(selectionState.entries());
				this.model.selection({ items }, {
					source: 'selection.view'
				});
			};
		} else {
			return noop;
		}
	}

	state(item) {
		if (!arguments.length) {
			return !!this.selectionState.stateAll(this.rows);
		}

		return this.selectionState.state(item) === true;
	}

	isIndeterminate(item) {
		if (!arguments.length) {
			return this.selectionState.stateAll(this.rows) === null;
		}

		return this.selectionState.state(item) === null;
	}

	get selection() {
		return this.model.selection();
	}

	get mode() {
		return this.selection.mode;
	}

	get items() {
		return this.selection.items;
	}

	get rows() {
		return this.table.data.rows();
	}

	get columns() {
		return this.table.data.columns();
	}

	navigateTo(rowIndex, columnIndex) {
		const cell = this.table.body.cell(rowIndex, columnIndex);
		this.model.navigation({ cell: cell.model() }, { source: 'selection.view' });
	}
}