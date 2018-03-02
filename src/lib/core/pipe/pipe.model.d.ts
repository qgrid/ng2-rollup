import { PipeUnit } from './pipe.unit';
import { Model } from '../infrastructure/model';

/**
 * A class that contains setting to control when and how q-grid should be updated.
 *
 * ### Default Triggers
 * ```javascript
 *  {
 *	   'data': {
 *	      'rows': PU.default,
 *		  'columns': PU.column
 *	   'pagination': {
 *		  'current': PU.default,
 *		  'size': PU.default
 *		},
 *		'fetch': {
 *		   'skip': PU.default,
 *		   'round': PU.default
 *		},
 *		'sort': {
 *		   'by': PU.default
 *		},
 *		'filter': {
 *		   'by': PU.default,
 *		   'unit': PU.column
 *		},
 *		'group': {
 *		   'by': PU.default
 *		},
 *		'pivot': {
 *		   'by': PU.default
 *		},
 *		'columnList': {
 *		   'index': PU.column
 *		},
 *		'row': {
 *		   'status': PU.rowDetails,
 *         'canDrag': PU.column,
 *         'canResize': PU.column
 *		},
 *		'selection': {
 *		   'mode': PU.column,
 *		   'unit': PU.column
 *		}
 *  };
 * ```
 */
export declare class PipeModel {
	constructor();

	/**
	 * A function that allows to shrink a number of pipe units that should be invoked on referch request.
	 */
	reduce: (xs: PipeUnit[], Model) => PipeUnit[];

	/**
	 * A schema that shows how and when q-grid should be updated.
	 *
	 * `{col}`
	 */
	triggers: object;
}
