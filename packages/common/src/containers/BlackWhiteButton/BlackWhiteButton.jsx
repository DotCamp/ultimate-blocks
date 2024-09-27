import React from 'react';
import { Button } from '@wordpress/components';

/**
 * Inspector button styles as black&white.
 *
 * @param {Object}               props          component properties
 * @param {JSX.Element | string} props.children button text content
 * @param {boolean}              props.isActive is button active, this will be an indicator that functionality related to that button is active
 * @param {Function}             props.onClick  button click callback
 * @function Object() { [native code] }
 */
function BlackWhiteButton({ isActive, onClick, children }) {
	return (
		<Button
			className={`block-editor-block-styles__item ${
				isActive ? 'is-active' : ''
			}`}
			variant={'secondary'}
			isActiveStyle={true}
			onClick={onClick}
		>
			<span className={'block-editor-block-styles__item-text'}>
				{children}
			</span>
		</Button>
	);
}

/**
 * @module BlackWhiteButton
 */
export default BlackWhiteButton;
