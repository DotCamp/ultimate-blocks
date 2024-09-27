import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIconPrefix } from './inc/iconOperations';

/**
 * Ub icon editor component.
 *
 * @param {Object}  props          component properties
 * @param {string}  props.iconName icon name
 * @param {number}  props.size     icon size in px
 * @param {boolean} props.isActive whether use active status of component
 * @function Object() { [native code] }
 */
function UbIconComponent({ iconName, size, isActive = false }) {
	const prefix = getIconPrefix(iconName);

	/**
	 * Whether component is empty or not.
	 *
	 * @return {boolean} empty status
	 */
	const isEmpty = () => {
		return !prefix || !iconName || iconName === '';
	};

	const wrapperStyles = () => {
		return {
			width: `${size}px`,
			height: `${size}px`,
		};
	};

	return (
		<div
			style={wrapperStyles()}
			data-empty={isEmpty()}
			data-ub-active={isActive}
			className={'ultimate-blocks-icon-component'}
		>
			{!isEmpty() && (
				<FontAwesomeIcon
					className={'ultimate-blocks-icon-component-svg-base'}
					icon={[prefix, iconName]}
				/>
			)}
		</div>
	);
}

/**
 * @module UbIconEditor
 */
export default UbIconComponent;
