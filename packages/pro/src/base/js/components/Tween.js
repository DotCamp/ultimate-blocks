/**
 * Tween between two values.
 *
 * @param {number}   from     start value
 * @param {number}   to       end value
 * @param {number}   duration duration in milliseconds
 * @param {Function} callback function to be called at every update
 * @function Object() { [native code] }
 */
function Tween(from, to, duration, callback) {
	/**
	 * Tween direction multiplier.
	 *
	 * @type {number}
	 */
	const directionMultiplier = from < to ? 1 : -1;

	const startTimeStamp = performance.now();
	const targetTimeStamp = startTimeStamp + duration;
	let previousTimeStamp = startTimeStamp;
	let currentTweenVal = from;

	const processLogic = (hTime) => {
		const deltaTime = hTime - previousTimeStamp;

		if (hTime > targetTimeStamp) {
			callback(to, true);
		} else {
			previousTimeStamp = hTime;
			const rate =
				(Math.abs(from - to) / duration) *
				deltaTime *
				directionMultiplier;

			currentTweenVal = currentTweenVal + rate;
			callback(currentTweenVal, false);

			requestAnimationFrame(processLogic);
		}
	};

	requestAnimationFrame(processLogic);
}

/**
 * @module Tween
 */
export default Tween;
