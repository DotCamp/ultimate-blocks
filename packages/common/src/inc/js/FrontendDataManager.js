import ManagerBase from '@Inc/js/base/ManagerBase';

/**
 * Frontend data manager.
 */
class FrontendDataManager extends ManagerBase {
	/**
	 * Server sent data for frontend operations.
	 *
	 * @private
	 * @type {null}
	 */
	#frontendData = null;

	/**
	 * Initialization logic for manager
	 *
	 * @param {string} globalObjectKey name of the key where server sent data is stored at global context
	 */
	_initLogic(globalObjectKey) {
		const context = self || global;
		this.#frontendData = context[globalObjectKey] || {};
		context[globalObjectKey] = undefined;
	}

	/**
	 * Get data value of high level key.
	 *
	 * @param {string} key        key
	 * @param {any}    defaultVal default value
	 * @return {any} value
	 */
	getDataProperty(key, defaultVal = null) {
		return this.#frontendData[key] || defaultVal;
	}
}

/**
 * @module FrontendDataManager
 */
export default new FrontendDataManager();
