import React from 'react';
import { PanelBody } from '@wordpress/components';

/**
 * Default panel body for editor.
 *
 * @param {Object}              props          component properties
 * @param {string}              props.title    panel title
 * @param {JSX.Element | Array} props.children component children
 * @function Object() { [native code] }
 */
function EditorPanelBody({ title, children }) {
	return (
		<PanelBody title={title} initialOpen={false}>
			{children}
		</PanelBody>
	);
}

/**
 * @module EditorPanelBody
 */
export default EditorPanelBody;
