import React, { useEffect, useState } from 'react';
import ValueCell from './ValueCell';

/**
 * Cell with graphical representation of assigned value.
 *
 * @param {Object}                     props                           component properties
 * @param {number}                     props.value                     value
 * @param {string}                     props.bgColor                   representation color
 * @param {Object}                     [props.style={}]                styles
 * @param {string | null}              props.className                 component extra classname
 * @param {number}                     [props.minVal=0]                minimum value
 * @param {number}                     [props.maxVal=10]               maximum value
 * @param {JSX.Element | Array | null} props.children                  component children
 * @param {string | null}              [props.baseId=null]             base id of the graph content this graph cell is assigned to
 * @param {Function}                   [props.onClickHandler=() => {}] cell on click handler
 * @function Object() { [native code] }
 */
function GraphCell({
	value,
	bgColor,
	style = {},
	className = null,
	minVal = 0,
	maxVal = 10,
	children,
	baseId = null,
	onClickHandler = () => {},
}) {
	const [widthPercent, setWidthPercent] = useState(0);

	/**
	 * useEffect hook
	 */
	useEffect(() => {
		setWidthPercent(calculateWidth());
	}, [value]);

	/**
	 * Calculate column width based on assigned value.
	 *
	 * @return {number} width in percents
	 */
	const calculateWidth = () => {
		let valueToUse = value;

		if (minVal > value) {
			valueToUse = minVal;
		}
		if (value > maxVal) {
			valueToUse = maxVal;
		}

		return (100 * valueToUse) / maxVal;
	};

	return (
		<ValueCell
			baseId={baseId}
			style={style}
			className={`ub-graph-cell ${className ?? ''}`}
			onClickHandler={onClickHandler}
		>
			<div
				style={{ backgroundColor: bgColor, width: `${widthPercent}%` }}
				className={`ub-graph-line`}
			>
				{children ? children : value}
			</div>
		</ValueCell>
	);
}

/**
 * @module GraphCell
 */
export default GraphCell;
