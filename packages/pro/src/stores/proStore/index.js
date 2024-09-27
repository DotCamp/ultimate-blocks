import { createReduxStore, register, select } from '@wordpress/data';
import { createStoreState } from './state';
import reducer from './reducer';
import selectors from './selectors.js';
import ManagerBase from '@Base/ManagerBase.js';

class UbProStore extends ManagerBase {
	#storeName;

	/**
	 * Register store
	 *
	 * @param {Object} preloadedState preloaded store state
	 */
	#registerStore = (preloadedState) => {
		const initialStoreState = createStoreState(preloadedState);

		const storeOptions = {
			reducer: reducer(initialStoreState),
			selectors,
		};

		const generatedReduxStore = createReduxStore(
			this.getStoreName(),
			storeOptions
		);

		register(generatedReduxStore);
	};

	/**
	 * Get name of store.
	 *
	 * return {string} store name
	 */
	getStoreName() {
		return this.#storeName;
	}

	/**
	 * Initialization logic for pro store.
	 *
	 * @param {string} storeName           store name
	 * @param {Object} [preloadedState={}] preloaded store state
	 */
	_initLogic(storeName, preloadedState = {}) {
		this.#storeName = storeName;

		this.#registerStore(preloadedState);
	}

	/**
	 * Store selector.
	 *
	 * @param {string} selectorName selector name
	 */
	select(selectorName) {
		return select(this.getStoreName())[selectorName];
	}
}

/**
 * @module ubProStoreObject
 */
export default new UbProStore();
