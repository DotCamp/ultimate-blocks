import { useContext } from 'react';
import { GraphDataContext } from '../GraphData';
import { COLUMN_TYPES } from '../../ProsConsColumn';

/**
 * HOC for graph related data.
 *
 * @param {JSX.Element | Function} Component target component
 * @return {Function} component function
 */
const withGraphData = (Component) => (props) => {
	const graphContextData = useContext(GraphDataContext);
	const { columnType } = props;
	const { prosData, consData, updateDataValue, updateDataLabel, ...rest } =
		graphContextData;

	const updateFunctions = {
		updateDataValue: (dataId, value) =>
			updateDataValue(columnType, dataId, value),
		updateDataLabel: (dataId, label) =>
			updateDataLabel(columnType, dataId, label),
	};

	return (
		<Component
			{...props}
			contentData={columnType === COLUMN_TYPES.PROS ? prosData : consData}
			{...rest}
			{...updateFunctions}
		/>
	);
};

/**
 * @module withGraphData
 */
export default withGraphData;
