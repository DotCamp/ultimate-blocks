/**
 * Component for rendering its child based on conditional values in inspector context attributes data.
 *
 * @param {Object}              props                    component properties
 * @param {string}              props.attributeKey       attribute key
 * @param {any}                 [props.targetValue=true] target value to check against, if an array is supplied, array values will be used
 * @param {Object}              props.attributes         attributes object
 * @param {JSX.Element | Array} props.children           component children
 * @function Object() { [native code] }
 */
function ConditionalRenderer({
	attributeKey,
	targetValue = true,
	attributes,
	children,
}) {
	/**
	 * Compare attribute value to target.
	 *
	 * @return {boolean} compare result
	 */
	const compareAttribute = () => {
		let innerTargetValue = targetValue;

		if (!Array.isArray(innerTargetValue)) {
			innerTargetValue = [innerTargetValue];
		}

		return innerTargetValue.includes(attributes[attributeKey]);
	};

	return compareAttribute() && children;
}

/**
 * @module ConditionalRenderer
 */
export default ConditionalRenderer;
