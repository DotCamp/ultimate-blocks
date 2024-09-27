import React from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Search input component.
 */
function ContentSearchInput() {
	return (
		<div className={'search-input-wrapper'}>
			{__('Search…', 'ultimate-blocks-pro')}
		</div>
	);
}

/**
 * @module SearchInput
 */
export default ContentSearchInput;
