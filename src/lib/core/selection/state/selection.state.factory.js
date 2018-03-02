import {AppError} from '../../infrastructure';
import {SingleSelectionState} from './single.selection.state';
import {MultipleSelectionState} from './multiple.selection.state';
import {RangeSelectionState} from './range.selection.state';

export function selectionStateFactory(model, service) {
	const mode = model.selection().mode;
	switch (mode) {
		case 'single':
			return new SingleSelectionState(model, service);
		case 'multiple':
			return new MultipleSelectionState(model, service);
		case 'range':
			return new RangeSelectionState(model, service);
		default:
			throw new AppError('selection.state.factory', `Invalid selection mode "${mode}"`);
	}
}