import React from 'react';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { default as IconControl } from '@Containers/IconControl/IconControlContainer.jsx';
import IconSizePicker, {
	defaultIconSizes,
} from '@Containers/IconPanelGroup/components/IconSizePicker.jsx';

/**
 * Ub icon inspector component.
 *
 * @param {Object}   props                                        component properties
 * @param {string}   props.iconName                               icon name
 * @param {number}   props.size                                   icon size
 * @param {string}   props.panelLabel                             inspector panel label
 * @param {string}   props.iconControlLabel                       icon control label
 * @param {Array}    [props.iconSizeDefinitions=defaultIconSizes] icon size definitions, if not supplied, default definitions will be used
 * @param {Function} props.iconSelectCallback                     callback function for icon selection
 * @param {Function} props.sizeChangeCallback                     callback function for icon size changes
 * @param {number}   props.fallbackSize                           fallback size value
 */
function IconPanelGroup({
	iconName,
	size,
	panelLabel,
	iconControlLabel,
	iconSizeDefinitions = defaultIconSizes,
	iconSelectCallback,
	sizeChangeCallback,
	fallbackSize = 30,
}) {
	return (
		<InspectorControls>
			<PanelBody title={panelLabel}>
				<IconControl
					selectedIcon={iconName}
					label={iconControlLabel}
					onIconSelect={iconSelectCallback}
				/>
				<IconSizePicker
					sizeChangeCallback={sizeChangeCallback}
					size={size}
					fallbackSize={fallbackSize}
					iconSizeDefinitions={iconSizeDefinitions}
				/>
			</PanelBody>
		</InspectorControls>
	);
}

/**
 * @module UbIconEditor
 */
export default IconPanelGroup;
