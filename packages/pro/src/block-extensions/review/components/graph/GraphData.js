import React, { createContext, useEffect, useState } from 'react';
import GraphDataPiece from './inc/GraphDataPiece';
import { COLUMN_TYPES } from '../ProsConsColumn';
import withContext from '../hoc/withContext';

export const GraphDataContext = createContext({});

/**
 * Graph data provider.
 *
 * @param {Object}              props                 component properties
 * @param {Array}               props.prosTuplesData  pros related data
 * @param {Array}               props.consTuplesData  cons related data
 * @param {JSX.Element | Array} props.children        component children
 * @param {Function}            props.changeCallback  callback functions for changes on data
 * @param {Function}            props.setActiveLineId set active line id
 * @param {string | null}       props.activeLineId    active line id
 * @function Object() { [native code] }
 */
function GraphData({
	prosTuplesData,
	consTuplesData,
	children,
	changeCallback,
	activeLineId,
	setActiveLineId,
}) {
	// state GraphDataPieces holders
	const [prosData, setProsData] = useState(undefined);
	const [consData, setConsData] = useState(undefined);

	// update tuples data on data pieces updates
	useEffect(() => {
		if (prosData?.length === 0) {
			setProsData([generateEmptyDataPiece()]);
		}
		changeCallback(COLUMN_TYPES.PROS, piecesToTuples(prosData));
	}, [prosData]);

	// update tuples data on data pieces updates
	useEffect(() => {
		if (consData?.length === 0) {
			setConsData([generateEmptyDataPiece()]);
		}

		changeCallback(COLUMN_TYPES.CONS, piecesToTuples(consData));
	}, [consData]);

	/**
	 * Change pieces data array into tuples.
	 *
	 * @param {Array<GraphDataPiece>} piecesData
	 * @return {Array} tuples data array
	 */
	const piecesToTuples = (piecesData) => {
		return piecesData?.map((pD) => {
			const { id, label, value } = pD.getDataObject();

			// return compatible tuples value
			return [id, label, value];
		});
	};

	/**
	 * Find column type and index of data piece with the given id.
	 *
	 * @param {string } dataId
	 * @return {Object | null} an object containing column type and index of data piece, null if no data piece is found
	 */
	const findColumnTypeAndIndex = (dataId) => {
		if (dataId) {
			const resultObj = {};

			const isPros = prosData.some((dataPiece, index) => {
				// eslint-disable-next-line eqeqeq
				const match = dataPiece.getId() === dataId;

				if (match) {
					resultObj.index = index;
				}
				return match;
			});

			if (isPros) {
				resultObj.columnType = COLUMN_TYPES.PROS;
				return resultObj;
			}
			const isCons = consData.some((dataPiece, index) => {
				// eslint-disable-next-line eqeqeq
				const match = dataPiece.getId() === dataId;

				if (match) {
					resultObj.index = index;
				}
				return match;
			});

			if (isCons) {
				resultObj.columnType = COLUMN_TYPES.CONS;
				return resultObj;
			}
		}

		return null;
	};

	/**
	 * Generate label component related id for its assigned data piece.
	 *
	 * @param {string} baseId base id
	 * @return {string} label id
	 */
	const generateLabelId = (baseId) => {
		return `${baseId}_label`;
	};

	/**
	 * Get data piece id from active line id.
	 *
	 * @return {string | null} data piece id, null if no valid id is found
	 */
	const getDataIdFromLineId = () => {
		const regexp = new RegExp(/^(.+)_.+$/);
		const match = regexp.exec(activeLineId);

		if (match && match[1]) {
			return match[1];
		}

		return null;
	};

	/**
	 * Add new empty data piece.
	 */
	const addNewData = () => {
		const targetContentId = getDataIdFromLineId();

		if (targetContentId) {
			const searchResult = findColumnTypeAndIndex(targetContentId);
			if (searchResult) {
				const { columnType, index } = searchResult;
				const targetDataArray = getTargetDataArray(columnType);

				const emptyDataPiece = generateEmptyDataPiece();

				targetDataArray.splice(index + 1, 0, emptyDataPiece);

				updateDataArray(targetDataArray, columnType);
				setActiveLineId(generateLabelId(emptyDataPiece.getId()));
			}
		}
	};

	/**
	 * Remove graph data piece.
	 * This method will remove currently active graph data piece.
	 */
	const removeData = () => {
		const targetDataId = getDataIdFromLineId();

		if (targetDataId) {
			const searchResults = findColumnTypeAndIndex(targetDataId);

			if (searchResults) {
				const { columnType, index } = searchResults;
				const targetDataArray = getTargetDataArray(columnType);

				targetDataArray.splice(index, 1);
				updateDataArray(targetDataArray, columnType);

				// reset active line id
				setActiveLineId(null);
			}
		}
	};

	/**
	 * Update data array based on column type
	 *
	 * @param {Array<GraphDataPiece>} newDataArray new data array
	 * @param {string}                columnType   column type
	 */
	const updateDataArray = (newDataArray, columnType) => {
		const dataUpdateFunction =
			columnType === COLUMN_TYPES.PROS ? setProsData : setConsData;

		dataUpdateFunction([...newDataArray]);
	};

	/**
	 * Get target data array associated with given column type.
	 *
	 * @param {string} columnType column type
	 * @return {Array | null} data array or null if no data array is associated with given column type
	 */
	const getTargetDataArray = (columnType) => {
		return columnType === COLUMN_TYPES.PROS ? prosData : consData;
	};

	/**
	 * Update an existing data.
	 * If null supplied for any parameter (except columnType and dataId), only supplied parameter property key will be updated
	 *
	 * @param {string}        columnType column type
	 * @param {string}        dataId     data id
	 * @param {string | null} label      label
	 * @param {number | null} value      data value
	 */
	const updateData = (columnType, dataId, label, value) => {
		const targetDataArray = getTargetDataArray(columnType);

		if (targetDataArray) {
			let dataIndex = null;
			const targetDataPiece = targetDataArray.find((tP, cIndex) => {
				if (tP.getId() === dataId) {
					dataIndex = cIndex;
					return true;
				}
				return false;
			});

			if (targetDataPiece) {
				if (label) {
					targetDataArray[dataIndex].updateLabel(label);
				}
				if (value !== null) {
					targetDataArray[dataIndex].updateValue(value);
				}

				updateDataArray(targetDataArray, columnType);
			}
		}
	};

	/**
	 * Update value of graph data.
	 *
	 * @param {string} columnType column type
	 * @param {string} dataId     data id
	 * @param {number} value      data value
	 */
	const updateDataValue = (columnType, dataId, value) => {
		updateData(columnType, dataId, null, value);
	};

	/**
	 * Update label of graph data.
	 *
	 * @param {string} columnType column type
	 * @param {string} dataId     data id
	 * @param {string} label      data label
	 */
	const updateDataLabel = (columnType, dataId, label) => {
		updateData(columnType, dataId, label, null);
	};

	/**
	 * Convert a single tuples data to object format.
	 *
	 * @param {Array} tuplesData tuples data
	 * @return {GraphDataPiece} data piece object
	 */
	const rawDataToObject = (tuplesData) => {
		const [id, label, value] = tuplesData;
		return new GraphDataPiece(id, label, value);
	};

	/**
	 * Generate an empty data piece.
	 *
	 * @return {GraphDataPiece} generated data piece
	 */
	const generateEmptyDataPiece = () => {
		return rawDataToObject([null, 'Label', 10]);
	};

	/**
	 * Convert tuples data in batch to object format.
	 *
	 * @param {Array} dataArray data tuples array
	 * @return {Array<GraphDataPiece>} data object array
	 */
	const batchDataToObject = (dataArray) => {
		const finalBatchArray = [];

		if (!dataArray.length) {
			finalBatchArray.push(generateEmptyDataPiece());
		} else {
			// eslint-disable-next-line array-callback-return
			dataArray.map((dTuple) => {
				finalBatchArray.push(rawDataToObject(dTuple));
			});
		}

		return finalBatchArray;
	};

	/**
	 * useEffect hook.
	 *
	 * Will handle operations that will only take place on component mount.
	 */
	useEffect(() => {
		setProsData(batchDataToObject(prosTuplesData));
		setConsData(batchDataToObject(consTuplesData));
	}, []);

	/**
	 * Context data
	 *
	 * @type {Object}
	 */
	const contextData = {
		consData,
		prosData,
		updateDataLabel,
		updateDataValue,
		setActiveLineId,
		addNewData,
		removeData,
	};

	return (
		<GraphDataContext.Provider value={contextData}>
			{children}
		</GraphDataContext.Provider>
	);
}

// context data select mapping
const contextSelectMapping = ['activeLineId', 'setActiveLineId'];

/**
 * @module GraphData
 */
export default withContext(GraphData, contextSelectMapping);
