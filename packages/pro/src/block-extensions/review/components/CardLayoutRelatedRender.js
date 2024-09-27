import React from 'react';
import LayoutRelatedRender from './LayoutRelatedRender';
import withInspectorContext from './hoc/withInspectorContext';

/**
 * Conditional renderer related to card layout type.
 *
 * @param {Object}              props             component properties
 * @param {Object}              props.layoutTypes available layout types
 * @param {JSX.Element | Array} props.children    component children
 *
 * @function Object() { [native code] }
 */
function CardLayoutRelatedRender({ layoutTypes, children }) {
	return (
		<LayoutRelatedRender layoutType={layoutTypes.CARD}>
			{children}
		</LayoutRelatedRender>
	);
}

/**
 * @module CardLayoutRelatedRender
 */
export default withInspectorContext(CardLayoutRelatedRender);
