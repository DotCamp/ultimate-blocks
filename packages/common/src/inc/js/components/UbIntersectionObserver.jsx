import { useRef, useEffect } from 'react';

/**
 * Intersection observer component.
 *
 * @param {Object}   props                 component properties
 * @param {number}   [props.threshold=1]   visibility threshold to trigger callback, 1.0 = 100% visibility
 * @param {Function} props.visibleCallback visible callback
 * @param {Object}   props.targetViewpoint target viewpoint ref
 * @function Object() { [native code] }
 */
function UbIntersectionObserver({
	targetViewpoint,
	threshold = 1,
	visibleCallback = () => {},
}) {
	const observerTargetRef = useRef(null);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		const observerOptions = {
			root: targetViewpoint.current,
			threshold,
		};

		const observer = new IntersectionObserver(
			visibleCallback,
			observerOptions
		);

		observer.observe(observerTargetRef.current);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<div
			ref={observerTargetRef}
			className={'ultimate-blocks-intersection-observer'}
		>
			+
		</div>
	);
}

/**
 * @module IntersectionObserver
 */
export default UbIntersectionObserver;
