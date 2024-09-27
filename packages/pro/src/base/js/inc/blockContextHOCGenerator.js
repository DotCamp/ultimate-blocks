import { useContext } from 'react';

/**
 * This generator will create a HOC for target context provider.
 *
 * @param {Object} targetContextProvider context data provider
 */
const blockContextHOCGenerator =
	(targetContextProvider) =>
	(Component, mapFunction = null) =>
	(props) => {
		let mappedContextData = {};
		const contextData = useContext(targetContextProvider);

		if (mapFunction === null) {
			mappedContextData = contextData;
		} else if (Array.isArray(mapFunction)) {
			// eslint-disable-next-line array-callback-return
			mapFunction.map((contextKey) => {
				if (
					Object.prototype.hasOwnProperty.call(
						contextData,
						contextKey
					)
				) {
					mappedContextData[contextKey] = contextData[contextKey];
				}
			});
		} else {
			mappedContextData = mapFunction(contextData);
		}

		if (typeof mappedContextData !== 'object') {
			throw new Error(
				'invalid context data is returned from map function'
			);
		}

		return <Component {...props} {...mappedContextData} />;
	};

/**
 * @module blockContextHOCGenerator
 */
export default blockContextHOCGenerator;
