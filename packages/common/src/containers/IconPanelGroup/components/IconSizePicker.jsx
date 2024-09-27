import React from 'react';
import IconSizeDefinition from '@Inc/js/IconSizeDefinition';
import { __ } from '@wordpress/i18n';
import { FontSizePicker } from '@wordpress/components';

/**
 * Default icon sizes.
 *
 * @type {Array}
 */
export const defaultIconSizes = [
	IconSizeDefinition(__('Small', 'ultimate-blocks-pro'), 'small', 30),
	IconSizeDefinition(__('Medium', 'ultimate-blocks-pro'), 'medium', 50),
	IconSizeDefinition(__('Large', 'ultimate-blocks-pro'), 'large', 70),
];

/**
 *
 * @param {Object}   props                                        component properties
 * @param {number}   props.size                                   icon size
 * @param {number}   [props.fallbackSize=30]                      icon fallback size
 * @param {Array}    [props.iconSizeDefinitions=defaultIconSizes] size definitions
 * @param {Function} props.sizeChangeCallback                     size change callback
 * @function Object() { [native code] }
 */
function IconSizePicker({
	size,
	fallbackSize = 30,
	iconSizeDefinitions = defaultIconSizes,
	sizeChangeCallback,
}) {
	return (
		<FontSizePicker
			fontSizes={iconSizeDefinitions}
			value={size}
			fallbackFontSize={fallbackSize}
			onChange={sizeChangeCallback}
			__nextHasNoMarginBottom={true}
		/>
	);
}

/**
 * @module IconSizePicker
 */
export default IconSizePicker;
