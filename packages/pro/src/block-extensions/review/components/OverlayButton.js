import React from 'react';

/**
 * Overlay button types.
 *
 * @type {Object}
 */
export const OVERLAY_BUTTON_TYPES = {
	POSITIVE: 'positive',
	NEGATIVE: 'negative',
};

/**
 * Button component for overlay controls.
 *
 * @param {Object}            props              component properties
 * @param {Array|JSX.Element} props.children     component children
 *
 * @param {Function}          props.clickHandler click handler
 * @param {string}            props.type         button type, use OVERLAY_BUTTON_TYPES object for available types
 * @function Object() { [native code] }
 */
function OverlayButton({
	children,
	clickHandler,
	type = OVERLAY_BUTTON_TYPES.POSITIVE,
}) {
	/**
	 * Main callback for button click.
	 *
	 * @param {Event} e event object
	 */
	const handleClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		clickHandler();
	};

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/interactive-supports-focus
		<div
			data-button-type={type}
			role={'button'}
			onClick={handleClick}
			className={'overlay-button'}
		>
			{children}
		</div>
	);
}

/**
 * @module OverlayButton
 */
export default OverlayButton;
