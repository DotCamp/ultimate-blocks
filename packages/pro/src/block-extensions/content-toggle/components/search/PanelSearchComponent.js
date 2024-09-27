import React from 'react';
import ContentSearchInput from './ContentSearchInput';
import SearchToolbox from './SearchToolbox';

/**
 * Main wrapper component for panel search functionality.
 *
 * @function Object() { [native code] }
 */
function PanelSearchComponent() {
	return (
		<div className={'ub-content-toggle-search'}>
			<div className={'ub-content-toggle-search-component-wrapper'}>
				<ContentSearchInput />
				<SearchToolbox />
			</div>
		</div>
	);
}

/**
 * @module PanelSearchComponent
 */
export default PanelSearchComponent;
