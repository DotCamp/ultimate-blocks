import { useEffect, useRef } from 'react';

/**
 * Custom hook for using previous value of useEffect hook.
 *
 * @param {any} val value
 * @return {any} previous value
 */
const usePrevious = (val) => {
	const ref = useRef();

	useEffect(() => {
		ref.current = val;
	});

	return ref.current;
};

/**
 * @module usePrevious
 */
export default usePrevious;
