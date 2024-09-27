/**
 * Store reducer function.
 *
 * @param {Object} initialState initial store state
 * @return {Function} reducer function
 */
const reducer = (initialState) => {
	const DEFAULT_STORE_STATE = initialState;

	// eslint-disable-next-line no-unused-vars
	return (storeState = DEFAULT_STORE_STATE, action) => {
		return storeState;
	};
};

/**
 * @module reducer
 */
export default reducer;
