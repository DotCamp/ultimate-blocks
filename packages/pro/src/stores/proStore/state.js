/**
 * Default store state.
 *
 * @type {Object}
 */
import deepmerge from 'deepmerge';

/**
 * Default store state.
 *
 * @type {Object}
 */
const defaultState = {
	extensions: {
		attributes: {},
		extra: {},
	},
	block: {
		statusData: [],
	},
	translations: {},
};

/**
 * Create store state.
 *
 * @param {Object} [preloadedState={}] preloaded state
 */
export const createStoreState = (preloadedState = {}) => {
	return deepmerge(defaultState, preloadedState);
};

/**
 * @module initialState
 */
export default defaultState;
