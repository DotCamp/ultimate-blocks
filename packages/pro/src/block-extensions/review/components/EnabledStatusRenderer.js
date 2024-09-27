// eslint-disable-next-line no-unused-vars
import React from 'react';
import ConditionalRenderer from './ConditionalRenderer';

/**
 * Conditional renderer for enabled status.
 *
 * @param {Object}              props          component properties
 * @param {JSX.Element | Array} props.children component children
 * @function Object() { [native code] }
 */
function EnabledStatusRenderer({ children }) {
	return (
		<ConditionalRenderer attributeKey={'prosConsEnabled'}>
			{children}
		</ConditionalRenderer>
	);
}

/**
 * @module EnabledStatusRenderer
 */
export default EnabledStatusRenderer;
