import React from 'react';

/**
 * Graph column cell component
 *
 * @param {Object}                                props                         component properties
 * @param {JSX.Element | Array | string | number} props.children                component children
 * @param {string | null}                         [props.className=null]        component classnames
 * @param {Object}                                [props.style={}]              styles
 * @param {string | null}                         [props.cellId=null]           cell id
 * @param {Function}                              [props.clickHandler=() => {}] click event handler
 * @function Object() { [native code] }
 */
function BaseCell({
	children,
	className = null,
	style = {},
	cellId = null,
	clickHandler = () => {},
}) {
	/**
	 * Handle cell click.
	 *
	 * @param {Event} e click event object
	 */
	const handleCellClick = (e) => {
		if (cellId !== null) {
			e.preventDefault();
			e.stopPropagation();
			clickHandler(cellId);
		}
	};

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<div
			id={cellId}
			className={`ub-base-cell ${className ?? ''}`.trim()}
			style={style}
			onClick={handleCellClick}
		>
			{children}
		</div>
	);
}

/**
 * @module GraphCell
 */
export default BaseCell;
