/**
 * Data registry for values whose index matters on plugin functionality.
 *
 * @function Object() { [native code] }
 */
function IndexDataRegistry() {
	/**
	 * Fill empty spaces of target array to keep the offset index within range.
	 *
	 * @param {number} offset            index offset
	 * @param {Array}  targetArray       target array
	 * @param {string} [defaultValue=''] default value to fill empty spaces
	 * @return {Array} filled array
	 */
	const fillEmptySpaces = (offset, targetArray, defaultValue = '') => {
		const { length } = targetArray;
		const arrayToUse = [...targetArray];

		if (length < offset + 1) {
			const fillCount = offset + 1 - length;

			for (let i = 0; i < fillCount; i++) {
				arrayToUse.push(defaultValue);
			}
		}

		return arrayToUse;
	};

	/**
	 * Add value to index data.
	 *
	 * @param {any}    val                   value to add
	 * @param {number} targetIndex           target index
	 * @param {Array}  targetDataArray       target data array
	 *
	 * @param {any}    [defaultFillValue=''] default fill value for inner operations
	 * @return {Array} updated data array
	 */
	this.addToIndexData = (
		val,
		targetIndex,
		targetDataArray,
		defaultFillValue = ''
	) => {
		const dataArrayToUse = fillEmptySpaces(
			targetIndex,
			targetDataArray,
			defaultFillValue
		);
		dataArrayToUse.splice(targetIndex, 1, val);

		return dataArrayToUse;
	};

	/**
	 * Remove data.
	 *
	 * @param {number} index                 index to delete
	 * @param {Array}  targetDataArray       data array
	 * @param {any}    [defaultFillValue=''] default fill value
	 * @return {Array} updated data array
	 */
	this.removeData = (index, targetDataArray, defaultFillValue = '') => {
		const dataArrayToUse = fillEmptySpaces(
			index,
			targetDataArray,
			defaultFillValue
		);
		dataArrayToUse.splice(index, 1);

		return dataArrayToUse;
	};

	/**
	 * Move data from one index to another.
	 *
	 * @param {number} currentIndex          current index of data to be moved
	 * @param {number} targetIndex           target index to move data
	 * @param {Array}  targetDataArray       data array
	 *
	 * @param {any}    [defaultFillValue=''] default fill value
	 * @return {Array} updated data array
	 */
	this.moveData = (
		currentIndex,
		targetIndex,
		targetDataArray,
		defaultFillValue = ''
	) => {
		const dataArrayToUse = fillEmptySpaces(
			Math.max(currentIndex, targetIndex),
			targetDataArray,
			defaultFillValue
		);

		const cachedTargetDataValue = dataArrayToUse[targetIndex];
		dataArrayToUse[targetIndex] = dataArrayToUse[currentIndex];
		dataArrayToUse[currentIndex] = cachedTargetDataValue;

		return dataArrayToUse;
	};
}

/**
 * @module IndexDataRegistry
 */
export default new IndexDataRegistry();
