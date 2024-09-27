import React, { Fragment } from 'react';
import { PanelColorSettings } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import withInspectorContext from './hoc/withInspectorContext';
import withContext from './hoc/withContext';
import { COLUMN_TYPES } from './ProsConsColumn';

/**
 * Color related editor controls.
 *
 * @param {Object}        props                    component properties
 * @param {Object}        props.attributes         component attributes, will be supplied via HOC
 * @param {Function}      props.setSingleAttribute update an attribute value, will be supplied via HOC
 * @param {string | null} props.selectedColumn     selected column type, will be supplied via HOC
 * @function Object() { [native code] }
 */
function ColorEditorControls({
	attributes,
	setSingleAttribute,
	selectedColumn,
}) {
	/**
	 * Create color attribute object compatible with panel color settings inspector control.
	 *
	 * @param {string} attrId target attribute id related to that color object
	 * @param {string} label  color label
	 */
	const createColorAttribute = (attrId, label) => {
		return {
			value: attributes[attrId],
			label,
			onChange: (colorVal) => setSingleAttribute(attrId, colorVal),
		};
	};

	return (
		<Fragment>
			<PanelColorSettings
				title={__('Pros', 'ultimate-blocks-pro')}
				initialOpen={selectedColumn === COLUMN_TYPES.PROS}
				colorSettings={[
					createColorAttribute(
						'prosTitleBg',
						__('Main', 'ultimate-blocks-pro')
					),
					createColorAttribute(
						'prosContentBg',
						__('Accent', 'ultimate-blocks-pro')
					),
				]}
			/>
			<PanelColorSettings
				title={__('Cons', 'ultimate-blocks-pro')}
				initialOpen={selectedColumn === COLUMN_TYPES.CONS}
				colorSettings={[
					createColorAttribute(
						'consTitleBg',
						__('Main', 'ultimate-blocks-pro')
					),
					createColorAttribute(
						'consContentBg',
						__('Accent', 'ultimate-blocks-pro')
					),
				]}
			/>
		</Fragment>
	);
}

/**
 * @module ColorEditorControls
 */
export default withContext(withInspectorContext(ColorEditorControls), [
	'selectedColumn',
]);
