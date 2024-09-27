import React from 'react';
import ConditionalRenderer from '@Base/js/components/ConditionalRenderer.js';
import withContentToggleContext from '../hoc/withContentToggleContext';

/**
 * Content toggle search related control.
 * This control will be rendered based on the enable/disable status of content toggle search functionality
 *
 * @param {Object}              props            component properties
 * @param {JSX.Element | Array} props.children   component children
 * @param {Object}              props.attributes component attributes, will be supplied via HOC
 * @function Object() { [native code] }
 */
function SearchControl({ children, attributes }) {
	return (
		<ConditionalRenderer
			targetValue={true}
			attributes={attributes}
			attributeKey={'searchStatus'}
		>
			{children}
		</ConditionalRenderer>
	);
}

/**
 * @module SearchControl
 */
export default withContentToggleContext(SearchControl);
