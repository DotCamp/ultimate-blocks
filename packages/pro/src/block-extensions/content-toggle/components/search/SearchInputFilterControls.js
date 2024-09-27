import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { CheckboxControl, PanelBody } from '@wordpress/components';

/**
 * Generate search filter object.
 *
 * @param {string}        filterId        filter if
 * @param {string}        label           filter label
 * @param {string | null} [helpText=null] help text
 * @return {Object} filter object
 */
function generateFilterObject(filterId, label, helpText = null) {
	return {
		id: filterId,
		label,
		helpText,
	};
}

/**
 * Filter controls for search input of content toggle.
 *
 * @param {Object}   props                     component properties
 * @param {Array}    props.currentFilters      currently enabled filters
 * @param {Function} props.onFilterListChanged callback for filter status changes
 * @function Object() { [native code] }
 */
function SearchInputFilterControls({ currentFilters, onFilterListChanged }) {
	const [enabledFilters, setEnabledFilters] = useState(
		Array.isArray(currentFilters) ? currentFilters : [currentFilters]
	);

	// useEffect hook
	useEffect(() => {
		onFilterListChanged(enabledFilters);
	}, [enabledFilters]);

	/**
	 * Checkbox change callback.
	 *
	 * @param {string} filterId filter id
	 */
	const onCheckChangedHandler = (filterId) => (status) => {
		switch (status) {
			case true:
				const newFilters = [...enabledFilters];
				newFilters.push(filterId);
				setEnabledFilters(newFilters);
				break;
			case false:
				const targetIndex = enabledFilters.indexOf(filterId);
				if (targetIndex >= 0) {
					const newFilters = [...enabledFilters];
					newFilters.splice(targetIndex, 1);
					setEnabledFilters(newFilters);
				}
				break;
		}
	};

	/**
	 * Available filters that can be used.
	 *
	 * - matchCase
	 */
	const availableFilters = [
		generateFilterObject(
			'matchCase',
			__('Match case', 'ultimate-blocks-pro')
		),
	];

	return (
		<PanelBody title={__('Search input filters', 'ultimate-blocks-pro')}>
			{availableFilters.map(({ id, label, helpText }) => (
				<CheckboxControl
					key={id}
					checked={enabledFilters.includes(id)}
					label={label}
					help={helpText}
					onChange={onCheckChangedHandler(id)}
				/>
			))}
		</PanelBody>
	);
}

/**
 * @module SearchInputFilterControls
 */
export default SearchInputFilterControls;
