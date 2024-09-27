import { connectWithStore } from '@Stores/StoreHelpers.js';

/**
 * HOC for connecting to pro main store
 *
 * @param {Function|null} [selectMapping=null] selection mapping
 * @param {Function|null} [actionMapping=null] action mapping
 * @return {Function} HOC function
 */
function withProMainStore(selectMapping = null, actionMapping = null) {
	return connectWithStore('ub-pro/main', selectMapping, actionMapping);
}

/**
 * @module withProMainStore
 */
export default withProMainStore;
