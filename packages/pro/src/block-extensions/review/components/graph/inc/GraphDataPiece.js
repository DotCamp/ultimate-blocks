import { v4 as uuidv4 } from 'uuid';

/**
 * Individual graph data.
 *
 * @param {string | null} id    data id, if null is supplied, an automatic id will be assigned to data piece
 * @param {string}        label label text
 * @param {number}        value value
 * @function Object() { [native code] }
 */
function GraphDataPiece(id, label, value) {
	const _id = id === null ? uuidv4() : id;
	let _label = label;
	let _value = value;

	/**
	 * Get data as object.
	 *
	 * @return {Object} data object
	 */
	this.getDataObject = () => {
		return {
			id: _id,
			label: _label,
			value: _value,
		};
	};

	/**
	 * Update label.
	 *
	 * @param {string} newLabel new label
	 */
	this.updateLabel = (newLabel) => {
		_label = newLabel;
	};

	/**
	 * Update value.
	 *
	 * @param {string} newValue new value
	 */
	this.updateValue = (newValue) => {
		_value = newValue;
	};

	/**
	 * Get id of data piece
	 *
	 * @return {string} id
	 */
	this.getId = () => {
		return _id;
	};
}

/**
 * @module GraphDataPiece
 */
export default GraphDataPiece;
