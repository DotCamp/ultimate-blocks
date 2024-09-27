import { InspectorContext } from '../InspectorContextProvider';
import blockContextHOCGenerator from '@Base/js/inc/blockContextHOCGenerator.js';

/**
 * Inspector context HOC.
 *
 * @param {JSX.Element | Function}  Component          target component
 *
 * @param {Function | Array | null} [mapFunction=null] context data mapping function
 * @return {Function} HOC function
 */
const withInspectorContext =
	(Component, mapFunction = null) =>
	(props) => {
		return blockContextHOCGenerator(InspectorContext)(
			Component,
			mapFunction
		)(props);
	};

/**
 * @module withInspectorContext
 */
export default withInspectorContext;
