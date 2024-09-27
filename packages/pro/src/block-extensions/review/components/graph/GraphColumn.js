import React, { Fragment, useEffect, useRef, useState } from 'react';
import LabelCell from './LabelCell';
import ValueCell from './ValueCell';
import GraphCell from './GraphCell';
import LabelInput from './LabelInput';
import withGraphData from './hoc/withGraphData';
import ValueInput from './ValueInput';

/**
 * Column component of graph layout.
 *
 * @param {Object}                props                        component properties
 * @param {string}                props.columnType             column type
 * @param {Array[GraphDataPiece]} props.contentData            content tuples array, will be supplied via HOC
 * @param {string}                props.title                  column title
 * @param {string}                props.position               column position on x-axis, left/right
 * @param {string}                props.mainColor              main color
 * @param {string}                props.accentColor            accent color
 * @param {Function}              props.updateDataLabel        callback function for updating data label
 * @param {Function}              props.updateDataValue        callback function for updating data value
 * @param {Function}              props.setActiveLineId        set active line id
 * @param {Function}              props.updateWrapperStyleAttr update wrapper style attribute value for block
 * @function Object() { [native code] }
 */
function GraphColumn({
	columnType,
	contentData = [],
	title,
	position,
	mainColor,
	accentColor,
	updateDataLabel,
	updateDataValue,
	setActiveLineId,
	updateWrapperStyleAttr,
}) {
	const [wrapperStyle, setWrapperStyle] = useState({});
	const [totalValue, setTotalValue] = useState(0);

	// wrapper ref
	const wrapperRef = useRef(null);

	/**
	 * useEffect hook
	 */
	useEffect(() => {
		setWrapperStyle(generateWrapperStyle);
		setTotalValue(calculateTotalValue());
	}, [contentData]);

	/**
	 * Update column wrapper style attribute.
	 */
	useEffect(() => {
		if (wrapperRef?.current) {
			const wrapperStyle = wrapperRef.current.getAttribute('style');

			updateWrapperStyleAttr(wrapperStyle);
		}
	}, [wrapperStyle]);

	/**
	 * Handle cell click event.
	 *
	 * @param {string} cellId cell id
	 */
	const handleCellClick = (cellId) => {
		setActiveLineId(cellId);
	};

	/**
	 * Render column content
	 *
	 * @return {Array} content
	 */
	const renderContent = () => {
		return contentData.map((dataPiece, index) => {
			const { id, label, value } = dataPiece.getDataObject();
			return (
				<Fragment key={id}>
					<LabelCell
						style={{ gridArea: `label${index + 1}` }}
						key={`label-${id}`}
						className={index % 2 === 0 ? 'ub-graph-odd-row' : ''}
						baseId={id}
						onClickHandler={handleCellClick}
					>
						<LabelInput
							onChange={(val) => updateDataLabel(id, val)}
							value={label}
						/>
					</LabelCell>
					<GraphCell
						style={{ gridArea: `value${index + 1}` }}
						key={`value-${id}`}
						className={index % 2 === 0 ? 'ub-graph-odd-row' : ''}
						value={value}
						bgColor={mainColor}
						baseId={id}
						onClickHandler={handleCellClick}
					>
						<ValueInput
							value={value}
							onChange={(val) => updateDataValue(id, val)}
						/>
					</GraphCell>
				</Fragment>
			);
		});
	};

	/**
	 * Generate wrapper related styles.
	 *
	 * @return {Object} style object
	 */
	const generateWrapperStyle = () => {
		const styleObj = {};
		if (wrapperRef.current) {
			const gridAreas = getComputedStyle(
				wrapperRef.current
			).gridTemplateAreas;

			const regExp = new RegExp(/(".*?")/);
			const matches = regExp.exec(gridAreas);

			if (matches && matches[1]) {
				styleObj.gridTemplateAreas = new Array(contentData.length + 1)
					.fill(matches[1], 0, contentData.length + 1)
					.map((areaRow, index) => {
						if (index === 0) {
							return areaRow;
						}

						const [first, second] = areaRow
							.replaceAll('"', '')
							.split(' ');

						return `"${first}${index} ${second}${index}"`;
					})
					.join(' ');
			}
		}

		return styleObj;
	};

	/**
	 * Calculate total content value.
	 *
	 * @return {number} total content value
	 */
	const calculateTotalValue = () => {
		// eslint-disable-next-line no-unused-vars
		return contentData.reduce((carry, dataPiece) => {
			const { value } = dataPiece.getDataObject();
			return carry + value;
		}, 0);
	};

	return (
		<div
			className={'ub-pros-cons-graph-column-table'}
			data-column-type={columnType}
			data-column-position={position}
			style={wrapperStyle}
			ref={wrapperRef}
		>
			<LabelCell style={{ backgroundColor: mainColor, color: '#FFF' }}>
				{title}
			</LabelCell>
			<ValueCell style={{ backgroundColor: accentColor }}>
				{totalValue}
			</ValueCell>
			{renderContent()}
		</div>
	);
}

/**
 * @module GraphColumn
 */
export default withGraphData(GraphColumn);
