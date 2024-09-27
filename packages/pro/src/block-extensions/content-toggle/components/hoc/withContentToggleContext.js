import blockContextHOCGenerator from '@Base/js/inc/blockContextHOCGenerator.js';
import ContentToggleContext from './ContentToggleContext';

/**
 * HOC for using content toggle context data.
 *
 * @param {Function | JSX.Element} Component          component
 * @param {Function | Array}       [mapFunction=null] mapping function, if an array with context key ids are supplied, created context data will use its own key values, if null is given, all available attributes will be supplied
 *
 * @return {JSX.Element | Function} HOC component
 */
const withContentToggleContext =
	(Component, mapFunction = null) =>
	(props) => {
		return blockContextHOCGenerator(ContentToggleContext)(
			Component,
			mapFunction
		)(props);
	};

/**
 * @module withContentToggleContext
 */
export default withContentToggleContext;
