import React from 'react';
import { FontSizePicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import withInspectorContext from './hoc/withInspectorContext';
import EditorPanelBody from './EditorPanelBody';

/**
 * Icon related editor controls.
 *
 * @param {Object}   props                    component properties
 * @param {Object}   props.attributes         block attributes, will be supplied via HOC
 * @param {Function} props.setSingleAttribute single attribute setter function, will be supplied via HOC
 * @param {Object}   props.commonSizes        common size values for controls, will be supplied via HOC
 * @function Object() { [native code] }
 */
function IconEditorControls({ attributes, setSingleAttribute, commonSizes }) {
	const { iconSize } = attributes;
	const { small, medium, large } = commonSizes;

	const iconSizes = [
		{
			name: __('Small', 'ultimate-blocks-pro'),
			slug: 'small',
			size: small,
		},
		{
			name: __('Medium', 'ultimate-blocks-pro'),
			slug: 'medium',
			size: medium,
		},
		{
			name: __('Large', 'ultimate-blocks-pro'),
			slug: 'large',
			size: large,
		},
	];

	return (
		<EditorPanelBody title={__('Icon', 'ultimate-blocks-pro')}>
			<FontSizePicker
				fontSizes={iconSizes}
				value={iconSize}
				fallbackFontSize={20}
				onChange={(val) => setSingleAttribute('iconSize', val)}
			/>
		</EditorPanelBody>
	);
}

/**
 * @module IconEditorControls
 */
export default withInspectorContext(IconEditorControls);
