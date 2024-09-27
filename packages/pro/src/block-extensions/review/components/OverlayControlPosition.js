import React from 'react';

/**
 * Overlay positions.
 *
 * @type {Object}
 */
export const OVERLAY_POSITIONS = {
	BOTTOM_CENTER: 'bottom-center',
	RIGHT_CENTER: 'right-center',
};

/**
 * Layout component for overlay control bottom center space.
 *
 * @param {Object}              props          component properties
 * @param {Array | JSX.Element} props.children component children
 * @param {string}              props.position position type, use OVERLAY_POSITIONS object for available types
 * @function Object() { [native code] }
 */
function OverlayControlPosition({ children, position }) {
	return (
		<div className={'overlay-control-layout-position'} data-pos={position}>
			{children}
		</div>
	);
}

/**
 * @module OverlayControlBottomCenter
 */
export default OverlayControlPosition;
