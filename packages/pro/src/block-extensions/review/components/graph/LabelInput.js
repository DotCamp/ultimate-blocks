import React from 'react';
import { RichText } from '@wordpress/block-editor';

/**
 * Label input component.
 *
 * @param {Object}   props          component properties
 * @param {string}   props.value    input value
 * @param {Function} props.onChange input changed handler
 * @function Object() { [native code] }
 */
function LabelInput({ value, onChange }) {
	return (
		<div className={'graph-label-input-wrapper'}>
			<RichText
				value={value}
				disableLineBreaks={true}
				onChange={onChange}
			/>
		</div>
	);
}

/**
 * @module LabelInput
 */
export default LabelInput;
