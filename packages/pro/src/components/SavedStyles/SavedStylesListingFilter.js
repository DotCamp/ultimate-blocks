import React from 'react';
import { __ } from '@wordpress/i18n';
import UbProInspectorTextInput from '@Components/Common/UbProInspectorTextInput';
import withBusyStatus from '@Stores/savedStyles/hoc/withBusyStatus';

/**
 * SavedStylesListingFilter component.
 *
 * @param {Object}   props            component properties
 * @param {string}   props.value      filter value
 * @param {Function} props.onInput    onInput event callback
 * @param {boolean}  props.busyStatus busy status, will be supplied via HOC
 * @class
 */
function SavedStylesListingFilter({ value, onInput, busyStatus }) {
	return (
		<div className={'ub-pro-saved-styles-listing-filter'}>
			<UbProInspectorTextInput
				placeholder={__('Filter styles', 'ultimate-blocks-pro')}
				value={value}
				onInput={onInput}
				disabled={busyStatus}
			/>
		</div>
	);
}

/**
 * @module SavedStylesListingFilter
 */
export default withBusyStatus(SavedStylesListingFilter);
