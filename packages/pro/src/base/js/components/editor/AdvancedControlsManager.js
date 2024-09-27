import { useEffect } from 'react';
import usePrevious from '@Base/js/inc/usePrevious.js';

/**
 * HOC for handling advanced control operations.
 *
 * Supported operations:
 *  - roll back the advanced control values to default on advanced control option disable
 *
 * @param {Object}              props                               component properties
 * @param {Object}              props.targetAttributes              target attributes
 * @param {Array}               [props.advancedAttributeKeyList=[]] key list of advanced attributes
 * @param {Function}            props.setAttributes                 attribute set function
 * @param {JSX.Element | Array} props.children                      component children
 * @param {string}              props.advancedControlAttributeId    attribute id of the control which is responsible for enable/disable operations of advanced controls
 * @function Object() { [native code] }
 */
function AdvancedControlsManager({
	advancedControlAttributeId,
	targetAttributes,
	advancedAttributeKeyList = [],
	setAttributes,
	children,
}) {
	const previousStatus = usePrevious(
		targetAttributes[advancedControlAttributeId]
	);

	// useEffect hook
	useEffect(() => {
		if (previousStatus && !targetAttributes[advancedControlAttributeId]) {
			const defaultAttributes = targetAttributes.__defaults;

			// eslint-disable-next-line array-callback-return
			advancedAttributeKeyList.map((attrId) => {
				if (
					Object.prototype.hasOwnProperty.call(
						defaultAttributes,
						attrId
					)
				) {
					setAttributes({
						[attrId]: defaultAttributes[attrId].default,
					});
				}
			});
		}
	}, [targetAttributes[advancedControlAttributeId]]);

	return children;
}

/**
 * @module AdvancedControlsManager
 */
export default AdvancedControlsManager;
