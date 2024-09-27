import React from 'react';
import { generateIcon } from '../../../../global';

/**
 * Search toolbox component.
 *
 * @function Object() { [native code] }
 */
function SearchToolbox() {
	return (
		<div className={'ub-content-toggle-search-toolbox'}>
			<div className={'toolbox-item'}>
				{generateIcon('magnifying-glass', 16)}
			</div>
		</div>
	);
}

/**
 * @module SearchToolbox
 */
export default SearchToolbox;
