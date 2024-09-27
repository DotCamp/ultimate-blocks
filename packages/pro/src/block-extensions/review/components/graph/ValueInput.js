import React from 'react';
import NumberInput from '@Base/js/components/NumberInput.js';

/**
 * Value input component.
 *
 * @param {Object}   props          component properties
 * @param {number}   props.value    value
 * @param {Function} props.onChange onChange callback function
 * @function Object() { [native code] }
 */
function ValueInput({ value, onChange }) {
	return (
		<div className={'graph-value-input-wrapper'}>
			<NumberInput value={value} onChange={onChange} />
		</div>
	);
}

/**
 * @module ValueInput
 */
export default ValueInput;
