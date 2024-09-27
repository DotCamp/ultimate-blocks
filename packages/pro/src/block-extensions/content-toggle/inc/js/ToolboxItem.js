/**
 * Search component toolbox item.
 *
 * @param {HTMLElement} itemElement             item HTML element
 * @param {Function}    [actionCallback=()=>{}] callback for item click event
 * @function Object() { [native code] }
 */
function ToolboxItem(itemElement, actionCallback = () => {}) {
	/**
	 * Toolbox item type.
	 *
	 * @type {string}
	 */
	this.type = itemElement.dataset.filterType;

	// add listener for toolbox item click event
	itemElement.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		actionCallback(this.type);
	});

	/**
	 * Set toolbox item visibility
	 *
	 * @param {boolean} status status value
	 */
	this.setVisibility = (status) => {
		itemElement.dataset.active = JSON.stringify(status);
	};

	/**
	 * Set item as enabled.
	 *
	 * @param {boolean} status enabled status
	 */
	this.setEnabled = (status) => {
		itemElement.dataset.enabled = JSON.stringify(status);
	};
}

/**
 * @module ToolboxItem
 */
export default ToolboxItem;
