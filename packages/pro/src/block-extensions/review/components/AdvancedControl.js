import React from 'react';
import ConditionalRenderer from './ConditionalRenderer';
import EnabledStatusRenderer from './EnabledStatusRenderer';

/**
 * Advanced control.
 *
 * @param {Object}              props          component properties
 * @param {JSX.Element | Array} props.children component children
 * @function Object() { [native code] }
 */
function AdvancedControl({ children }) {
	return (
		<EnabledStatusRenderer>
			<ConditionalRenderer attributeKey={'prosConsAdvancedControls'}>
				{children}
			</ConditionalRenderer>
		</EnabledStatusRenderer>
	);
}

/**
 * @module AdvancedControl
 */
export default AdvancedControl;
