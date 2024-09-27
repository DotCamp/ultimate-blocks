import React, { forwardRef } from 'react';
import { generateIcon } from '../../../global';

/**
 * Icon component.
 *
 * @param {Object} props                      component properties
 * @param {string} props.name                 icon name
 * @param {number} props.size                 icon size in px
 * @param {string} [props.color=currentColor] icon color
 * @param {Object} ref                        ref object
 * @function Object() { [native code] }
 */
function IconComponent({ name, size, color = 'currentColor' }, ref) {
	/**
	 * Render icon component.
	 *
	 * @return {JSX.Element} icon component
	 */
	const renderIcon = () => {
		return generateIcon(name, size);
	};

	return (
		<div ref={ref} className={'icon-component'} style={{ color }}>
			{renderIcon()}
		</div>
	);
}

/**
 * @module IconComponent
 */
export default forwardRef(IconComponent);
