// eslint-disable-next-line no-unused-vars
import React, {
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
} from 'react';

/**
 * Overlay control.
 *
 * @param {Object}              props                      component properties
 * @param {Node | null }        [props.targetElement=null] target element
 * @param {Array | JSX.Element} props.children             component children
 * @param { JSX.Element }       props.relativeElement      element that calculations will be made relative to
 * @function Object() { [native code] }
 */
function OverlayControl({ targetElement, children, relativeElement = null }) {
	const [visibilityStatus, setVisibilityStatus] = useState(false);
	const [posSizeData, setPosSizeData] = useState({
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	});
	const [observer, setObserver] = useState(null);

	// default padding values
	const defaultPadding = {
		x: 10,
		y: 3,
	};

	/**
	 * Calculate position and size values based on target element.
	 */
	const calculatePositionAndSize = () => {
		if (targetElement && relativeElement) {
			const { x, y, width, height } =
				targetElement.getBoundingClientRect();
			const { x: relativeX, y: relativeY } =
				relativeElement.getBoundingClientRect();

			setPosSizeData({
				left: x - relativeX - defaultPadding.x,
				top: y - relativeY - defaultPadding.y,
				width: width + 2 * defaultPadding.x,
				height: height + 2 * defaultPadding.y,
			});
		}
	};

	/**
	 * Add px suffix to given value.
	 *
	 * @param {number} val value
	 * @return {string} suffixed value
	 */
	const toPx = (val) => {
		return `${val}px`;
	};

	/**
	 * Format position and size to into style.
	 *
	 * @return {Object} style data
	 */
	const posSizeDataToStyle = () => {
		const { top, left, width, height } = posSizeData;
		return {
			left: toPx(left),
			top: toPx(top),
			width: toPx(width),
			height: toPx(height),
		};
	};

	// calculate position and size data
	useEffect(() => {
		if (targetElement) {
			calculatePositionAndSize();
		}

		setVisibilityStatus(targetElement !== null);
	}, [targetElement]);

	// set up an observer for new target
	useEffect(() => {
		if (targetElement) {
			observer?.disconnect();

			const tempObserver = new MutationObserver(calculatePositionAndSize);
			tempObserver.observe(targetElement, {
				attributes: true,
				subtree: true,
				childList: true,
				characterData: true,
			});

			setObserver(tempObserver);
		}
	}, [targetElement]);

	return (
		<div
			style={posSizeDataToStyle()}
			data-visibility={visibilityStatus}
			className={'overlay-control'}
		>
			<div className={'inner-wrapper'}>{children}</div>
		</div>
	);
}

/**
 * @module OverlayControl
 */
export default forwardRef(OverlayControl);
