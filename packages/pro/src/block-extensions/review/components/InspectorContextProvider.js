import React, { createContext, useState, useRef } from 'react';
import withProMainStore from '@Stores/proStore/hoc/withProMainStore.js';

/**
 * Inspector context.
 *
 * @type {React.Context<{}>}
 */
export const InspectorContext = createContext({});

/**
 *
 * @param {Object}              props               component properties
 * @param {Object}              props.attributes    block attributes
 * @param {Function}            props.setAttributes set block attributes function
 * @param {Object}              props.layoutTypes   layout types, will be supplied via HOC
 * @param {JSX.Element | Array} props.children      component children
 * @function Object() { [native code] }
 */
function InspectorContextProvider({
	attributes,
	setAttributes,
	layoutTypes,
	children,
}) {
	const [colorControlsPortalRef, setColorControlsPortalRef] = useState({
		current: null,
	});

	const inspectorContextData = {
		attributes,
		setAttributes,
		setSingleAttribute: (attrKey, attrVal) => {
			setAttributes({ [attrKey]: attrVal });
		},
		commonSizes: {
			small: 15,
			medium: 20,
			large: 30,
		},
		layoutTypes,
		colorControlsPortalRef,
		setColorControlsPortalRef,
	};

	return (
		<InspectorContext.Provider value={inspectorContextData}>
			{children}
		</InspectorContext.Provider>
	);
}

// pro main store selection mapping
const proMainStoreSelectMapping = ({ getExtensionExtraData }) => {
	return {
		layoutTypes: getExtensionExtraData('ub/review', 'prosConsLayoutTypes'),
	};
};

/**
 * @module InspectorContextProvider
 */
export default withProMainStore(proMainStoreSelectMapping)(
	InspectorContextProvider
);
