/**
 * A class that contains properties about scroll status.
 *
 * ### Suggested Links
 *
 * * [Scroll View](/doc/api/scroll-view.html)
 */
export declare class ScrollModel {
	constructor();

	/**
	 * Scroll mode.
	 *
	 * * `'default'` mode without virtualization.
	 * * `'virtual'` turn on virtual mode.
	 */
	mode: string;

	/**
	 * Top scroll position.
	 */
	top: number;

	/**
	 * Left scroll position.
	 */
	left: number;

	/**
	 * Row index on top of the q-grid client area.
	 */
	cursor: number;
}
