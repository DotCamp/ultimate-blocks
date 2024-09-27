import React from 'react';
import withContentToggleContext from '../hoc/withContentToggleContext';
import SearchControl from './SearchControl';
import ConditionalRenderer from '@Base/js/components/ConditionalRenderer.js';

/**
 * Advanced control for search controls.
 *
 * @param {Object}              props            component properties
 * @param {Object}              props.attributes block attributes, will be supplied via HOC
 * @param {JSX.Element | Array} props.children   component children
 * @function Object() { [native code] }
 */
function SearchAdvancedControl({ attributes, children }) {
	return (
		<SearchControl>
			<ConditionalRenderer
				attributes={attributes}
				attributeKey={'searchAdvancedControls'}
				targetValue={true}
			>
				{children}
			</ConditionalRenderer>
		</SearchControl>
	);
}

/**
 * @module SearchAdvancedControl
 */
export default withContentToggleContext(SearchAdvancedControl);
