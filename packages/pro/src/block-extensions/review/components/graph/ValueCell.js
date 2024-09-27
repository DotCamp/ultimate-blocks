import React from 'react';
import BaseCell from './BaseCell';

/**
 * Label related cell component.
 *
 * @param {Object}                                props                           component properties
 * @param {JSX.Element | string | Array | number} props.children                  component children
 * @param {Object}                                [props.style={}]                styles
 * @param {string | null}                         props.className                 component extra classname
 * @param {string | null}                         [props.baseId=null]             base id related to graph content this cell is assigned to
 * @param {Function}                              [props.onClickHandler=() => {}] cell click event handler
 * @function Object() { [native code] }
 */
function ValueCell({
	children,
	style = {},
	className = null,
	baseId = null,
	onClickHandler = () => {},
}) {
	const valueCellId = () => {
		if (baseId) {
			return `${baseId}_value`;
		}

		return null;
	};

	return (
		<BaseCell
			style={style}
			className={`ub-graph-value-cell ${className ?? ''}`}
			cellId={valueCellId()}
			clickHandler={onClickHandler}
		>
			{children}
		</BaseCell>
	);
}

/**
 * @module  LabelCell
 */
export default ValueCell;
