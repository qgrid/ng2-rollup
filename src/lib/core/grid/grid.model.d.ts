/**
 * A class contains basic grid options like id and title.
 *
 * ## Suggested Links
 *
 * * [grid.ctrl.js](https://github.com/qgrid/ng2/blob/master/core/grid/grid.ctrl.js)
 */
export declare class GridModel {
	/**
	 * Grid identifier that is in sync with element id.
	 * Mostly this id is used in a style generation routine to link concrete grid with appropriate style.
	 * Also is used in data manipulation plugin to identify correct list of pressets.
	 */
	id: string;

	/**
	 * Indicates a state of the model:
	 * * `unbound` model is not connected to a grid element.
	 * * `bound` model connected to a grid element.
	 *
	 * Current version of the grid doesn't allow to use one model on several grids,
	 * so if user will try to do that exception will be thrown.
	 */
	status: string;

	/**
	 * Text that is used by grid title plugin to show header inside top toolbar.
	 */
	title: string;
}
