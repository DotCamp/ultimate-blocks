import { ProsConsContext } from '../ProsCons';
import blockContextHOCGenerator from '@Base/js/inc/blockContextHOCGenerator.js';

/**
 * HOC for using pros/cons context data.
 *
 * @param {Function | JSX.Element} Component   component
 * @param {Function | Array}       mapFunction mapping function, if an array with context key ids are supplied, created context data will use its own key values
 * @return {JSX.Element | Function} HOC component
 */
const withContext = (Component, mapFunction) => (props) => {
	return blockContextHOCGenerator(ProsConsContext)(Component, mapFunction)(
		props
	);
};

/**
 * @module withContext
 */
export default withContext;
