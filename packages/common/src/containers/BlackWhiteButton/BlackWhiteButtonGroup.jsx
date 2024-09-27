import React from 'react';

/**
 * Button group for black&white buttons.
 *
 * @param {Object}              props          component properties
 * @param {JSX.Element | Array} props.children component children
 * @function Object() { [native code] }
 */
function BlackWhiteButtonGroup({ children }) {
	return (
		<div className={'block-editor-block-styles__variants'}>{children}</div>
	);
}

/**
 * @module BlackWhiteButtonGroup
 */
export default BlackWhiteButtonGroup;
