import React, { useEffect, useRef, useState } from 'react';
import { RichText } from '@wordpress/block-editor';

/**
 * Number input component for content updates.
 *
 * @param {Object}   props             component properties
 * @param {number}   props.value       value
 * @param {Function} props.onChange    onChange callback function
 * @param {number}   [props.minVal=1]  minimum value
 * @param {number}   [props.maxVal=10] maximum value
 * @function Object() { [native code] }
 */
function NumberInput({ value, onChange, minVal = 1, maxVal = 10 }) {
	const [innerValue, setInnerValue] = useState(value);
	const [inputKey, setInputKey] = useState(0);

	const inputRef = useRef(null);

	/**
	 * Handle change event.
	 *
	 * @param {string} newVal updated value
	 */
	const handleChange = (newVal) => {
		if (newVal === '') {
			setInnerValue('0');
			reRenderInput();
		} else if (isNaN(newVal)) {
			reRenderInput();
		} else {
			setInnerValue(newVal);
		}
	};

	/**
	 * Force render input.
	 */
	const reRenderInput = () => {
		setInputKey(inputKey + 1);
		inputRef.current.focus();
	};

	/**
	 * Keep given value between min/max range.
	 *
	 * @param {number} val value
	 * @return {number} value
	 */
	const keepInRange = (val) => {
		let innerVal = val;

		if (val < minVal) {
			innerVal = minVal;
		}
		if (val > maxVal) {
			innerVal = maxVal;
		}

		return innerVal;
	};

	// useEffect hook
	useEffect(() => {
		const parsedInnerValue = Number.parseInt(innerValue, 10);
		const rangedValue = keepInRange(parsedInnerValue);

		if (rangedValue !== parsedInnerValue) {
			setInnerValue(rangedValue);
		}

		onChange(rangedValue);
	}, [innerValue]);

	return (
		<RichText
			ref={inputRef}
			key={inputKey}
			value={innerValue.toString()}
			disableLineBreaks={true}
			onChange={handleChange}
		/>
	);
}

/**
 * @module NumberInput
 */
export default NumberInput;
