import React from 'react';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Inspector controls for styles tab.
 *
 * @param {Object}              props          component properties
 * @param {Array | JSX.Element} props.children component children
 * @class
 */
function InspectorControlsStylesTab({ children }) {
	return <InspectorControls group={'styles'}>{children}</InspectorControls>;
}

/**
 * @module InspectorControlsStylesTab
 */
export default InspectorControlsStylesTab;
