/**
 * Store selectors.
 *
 * @type {Object}
 */
const selectors = {
	/**
	 * Get extension attributes for block extension.
	 *
	 * @param {Object} state     store state
	 * @param {string} blockName block name
	 *
	 * @return {Object} extension attributes
	 */
	getExtensionAttribute(state, blockName) {
		return state.extensions.attributes[blockName] ?? {};
	},

	/**
	 * Get extra data for block extension.
	 *
	 * @param {Object}        state          store state
	 * @param {string}        blockName      block name
	 * @param {string | null} [dataKey=null] data key or null to get all block related data
	 *
	 * @return {Object | any} extra extension data or specific value if data key is supplied
	 */
	getExtensionExtraData(state, blockName, dataKey = null) {
		const allBlockData = state.extensions.extra[blockName] ?? {};

		if (dataKey !== null) {
			return allBlockData[dataKey] ?? undefined;
		}

		return allBlockData;
	},
	/**
	 * Get translation.
	 *
	 * @param {Object} state         store state
	 * @param {string} translationId translation id
	 *
	 * @return {Object} translated string
	 */
	getTranslation(state, translationId) {
		return state.translations[translationId];
	},
	/**
	 * Get active status data of all pro blocks.
	 *
	 * @param {Object} state store state
	 *
	 * @return {Array} block status data
	 */
	getBlockStatusData(state) {
		return state.block.statusData;
	},
};

/**
 * @module selectors
 */
export default selectors;
