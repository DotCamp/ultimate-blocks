import React from 'react';
import { COLUMN_TYPES } from '../ProsConsColumn';
import withContext from '../hoc/withContext';
import withProMainStore from '@Stores/proStore/hoc/withProMainStore.js';
import GraphColumn from './GraphColumn';
import GraphData from './GraphData';
import GraphOverlayControls from './hoc/GraphOverlayControls';

/**
 * Pros/Cons graph layout.
 *
 * @param {Object}   props                                          component properties
 * @param {Function} props.attributeValueMapResolver                attribute value mapping resolver, will be supplied via HOC
 * @param {Function} props.getTranslation                           get translation for given string id, will be supplied via HOC
 * @param {Function} props.columnAttributeValueMapResolverGenerator generator function for column type targeted value resolve, will be supplied via HOC
 * @param {Function} props.columnAttributeUpdateResolver            set column type related attributes, will be supplied via HOC
 * @param {Array}    props.prosContent                              pros graph content, will be supplied via HOC
 * @param {Array}    props.consContent                              cons graph content, will be supplied via HOC
 * @function Object() { [native code] }
 */
function GraphLayout({
	prosContent,
	consContent,
	attributeValueMapResolver,
	getTranslation,
	columnAttributeValueMapResolverGenerator,
	columnAttributeUpdateResolver,
}) {
	/**
	 * Render graph columns
	 *
	 * @return {Array} column components
	 */
	const renderColumns = () => {
		const prosConsPositionData = attributeValueMapResolver(
			'prosConsPositionData'
		);

		return Object.keys(prosConsPositionData)
			.filter((key) =>
				Object.prototype.hasOwnProperty.call(prosConsPositionData, key)
			)
			.map((posId) => {
				const columnType = prosConsPositionData[posId];
				const valueResolver =
					columnAttributeValueMapResolverGenerator(columnType);
				return (
					<GraphColumn
						key={posId}
						columnType={columnType}
						title={getTranslation(columnType)}
						mainColor={valueResolver('titleBg')}
						accentColor={valueResolver('contentBg')}
						position={posId}
						updateWrapperStyleAttr={(val) =>
							columnAttributeUpdateResolver(
								columnType,
								'graphWrapperStyle',
								val
							)
						}
					/>
				);
			});
	};

	return (
		<div className={'ub-pros-cons-graph-layout-wrapper'}>
			<GraphData
				prosTuplesData={prosContent}
				consTuplesData={consContent}
				changeCallback={(columnType, tuplesData) =>
					columnAttributeUpdateResolver(
						columnType,
						'graphContent',
						tuplesData
					)
				}
			>
				{renderColumns()}
				<GraphOverlayControls />
			</GraphData>
		</div>
	);
}

// context select mapping
const contextSelectMapping = ({
	attributeValueMapResolver,
	columnAttributeValueMapResolverGenerator,
	columnAttributeUpdateResolver,
}) => {
	return {
		prosContent: columnAttributeValueMapResolverGenerator(
			COLUMN_TYPES.PROS
		)('graphContent'),
		consContent: columnAttributeValueMapResolverGenerator(
			COLUMN_TYPES.CONS
		)('graphContent'),
		attributeValueMapResolver,
		columnAttributeValueMapResolverGenerator,
		columnAttributeUpdateResolver,
	};
};

const proMainStoreSelectMapping = ({ getTranslation }) => ({ getTranslation });

/**
 * @module GraphLayout
 */
export default withProMainStore(proMainStoreSelectMapping)(
	withContext(GraphLayout, contextSelectMapping)
);
