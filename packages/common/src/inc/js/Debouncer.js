/**
 * Debounce registry item.
 *
 * @param {string} itemId    item id
 * @param {number} timeoutId timeout id
 * @function Object() { [native code] }
 */
function DebounceRegistryItem(itemId, timeoutId) {
	/**
	 * Item id.
	 *
	 * @type {string}
	 * @private
	 */
	const _itemId = itemId;

	/**
	 * Timeout operation id
	 *
	 * @type {number}
	 * @private
	 */
	let _timeoutId = timeoutId;

	/**
	 * Item id.
	 *
	 * @return {string} id
	 */
	this.getId = () => _itemId;

	/**
	 * Timeout operation id.
	 *
	 * @return {number} id
	 */
	this.getTimeoutId = () => _timeoutId;

	/**
	 * Update timeout id.
	 *
	 * @param {number} tId timeout id
	 */
	this.updateTimeoutId = (tId) => {
		_timeoutId = tId;
	};
}

/**
 * Debounce registry.
 *
 * @function Object() { [native code] }
 */
function DebounceRegistry() {
	/**
	 * Registered items.
	 *
	 * @type {Array<DebounceRegistryItem>}
	 */
	const registeredItems = [];

	/**
	 * Update an item in registry.
	 *
	 * @param {string} id        registry id
	 * @param {number} timeoutId timeout id
	 */
	this.updateRegistry = (id, timeoutId) => {
		const targetRegistryItem = this.getRegistryItem(id);

		targetRegistryItem.updateTimeoutId(timeoutId);
	};

	/**
	 * Get target registry item.
	 *
	 * @param {string} id registry id
	 * @return {DebounceRegistryItem} registry item
	 */
	this.getRegistryItem = (id) => {
		let [targetRegistryItem] = registeredItems.filter((rItem) => {
			return rItem.getId() === id;
		});

		/**
		 * Create new registry item for non-existent ones.
		 */
		if (!targetRegistryItem) {
			targetRegistryItem = new DebounceRegistryItem(id, 0);
			registeredItems.push(targetRegistryItem);
		}

		return targetRegistryItem;
	};
}

/**
 * Debouncer base class.
 *
 * @return {Function} debounce client
 */
function Debouncer() {
	const registry = new DebounceRegistry();

	/**
	 * Debounce client.
	 *
	 * @param {Function} callback       callback function
	 * @param {number}   debounceLength debounce length in ms
	 * @param {string}   debounceId     debounce operation id
	 * @function Object() { [native code] }
	 */
	function DebounceClient(callback, debounceLength, debounceId) {
		const debounceItem = registry.getRegistryItem(debounceId);

		clearTimeout(debounceItem.getTimeoutId());
		const currentTimeoutId = setTimeout(() => {
			callback();
		}, debounceLength);

		debounceItem.updateTimeoutId(currentTimeoutId);
	}

	return DebounceClient;
}

/**
 * @module Debouncer
 */
export default Debouncer();
