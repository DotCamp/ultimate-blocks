import React from 'react';

/**
 * Overlay component.
 *
 * Make sure parent container of this component has `relative` value for its position CSS property
 *
 * @param {Object} props          component properties
 * @param {Object} props.children children
 * @class
 */
function Overlay({ children }) {
	return <div className="ub-overlay">{children}</div>;
}

/**
 * @module Overlay
 */
export default Overlay;
