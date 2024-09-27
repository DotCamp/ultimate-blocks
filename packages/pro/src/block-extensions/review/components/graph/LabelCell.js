import React from 'react';
import BaseCell from './BaseCell';

/**
 * Label related cell component.
 *
 * @param {Object}                       props                           component properties
 * @param {JSX.Element | string | Array} props.children                  component children
 * @param {Object}                       [props.style={}]                styles
 * @param {string | null}                props.className                 component extra classname
 * @param {string | null}                [props.baseId=null]             base id related to graph content this cell is assigned to
 * @param {Function}                     [props.onClickHandler=() => {}] cell click event handler
 * @function Object() { [native code] }
 */
function LabelCell({
	children,
	style = {},
	className = null,
	baseId = null,
	onClickHandler = () => {},
}) {
	const labelCellId = () => {
		if (baseId) {
			return `${baseId}_label`;
		}

		return null;
	};

	return (
		<BaseCell
			style={style}
			className={`ub-graph-label-cell ${className ?? ''}`}
			cellId={labelCellId()}
			clickHandler={onClickHandler}
		>
			{children}
		</BaseCell>
	);
}

/**
 * @module  LabelCell
 */
export default LabelCell;
