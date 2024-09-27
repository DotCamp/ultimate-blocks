import React from 'react';
import { applyFilters, addFilter } from '@wordpress/hooks';

/**
 * Common hooks used throughout plugin.
 *
 * @type {Object}
 */
export const hookTypes = {
	filters: {
		ADD_SUB_COMPONENT: 'subComponentAdd',
	},
};

/**
 * Manager responsible for plugin wide messaging and filtering operations.
 */
function HookManager() {
	/**
	 * Hook namespace
	 *
	 * @type {string}
	 */
	const hookNamespace = 'ub';

	/**
	 * Hook types.
	 *
	 * @type {Object}
	 */
	const types = {
		FILTER: 'filter',
		ACTION: 'action',
	};

	/**
	 * Common hooks used throughout plugin.
	 *
	 * @type {Object}
	 */
	this.hookTypes = hookTypes;

	/**
	 * Prepare compatible hook name
	 *
	 * @param {string} name name
	 * @param {string} type hook type, available types are at types variable
	 * @return {string} hook name
	 */
	const prepareHookName = (name, type) => {
		return `${hookNamespace}.${type}.${name}`;
	};

	/**
	 * Apply filter.
	 *
	 * It is a wrapper for @wordpress/hooks applyFilter function.
	 *
	 * @param {string} filterName filter name
	 * @param {any}    data       filter data
	 * @return {any} filtered data
	 */
	this.applyFilters = (filterName, data) => {
		return applyFilters(prepareHookName(filterName, types.FILTER), data);
	};

	/**
	 * Add filter.
	 *
	 * It is a wrapper for @wordpress/hooks addFilter function.
	 *
	 * @param {string}   filterName       filter name
	 * @param {string}   uniqueIdentifier identifier for callback function
	 * @param {Function} callback         callback function
	 */
	this.addFilter = (filterName, uniqueIdentifier, callback) => {
		addFilter(
			prepareHookName(filterName, types.FILTER),
			uniqueIdentifier,
			callback
		);
	};
}

// singleton manager instance
const managerInstance = new HookManager();

/**
 * HOC for connection to hook manager.
 *
 * @param {JSX.Element} Component component
 * @return {Function} HOC component
 */
export const withHookManager = (Component) => (props) => {
	return <Component {...props} {...managerInstance} />;
};

/**
 * @module HookManager singleton instance
 */
export default managerInstance;
