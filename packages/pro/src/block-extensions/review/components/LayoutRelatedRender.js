import React from 'react';
import ConditionalRenderer from './ConditionalRenderer';

/**
 * Conditional renderer depending on current layout type.
 *
 * @param {Object}              props            component properties
 * @param {string | Array}      props.layoutType layout type
 * @param {JSX.Element | Array} props.children   component children
 * @function Object() { [native code] }
 */
function LayoutRelatedRender({ layoutType, children }) {
	return (
		<ConditionalRenderer
			attributeKey={'prosConsLayout'}
			targetValue={layoutType}
		>
			{children}
		</ConditionalRenderer>
	);
}

/**
 * @module LayoutRelatedRender
 */
export default LayoutRelatedRender;
