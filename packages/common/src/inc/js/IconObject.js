/**
 * Icon object class.
 *
 * @param {string} iconKeyId unique key id for icon
 * @param {Object} iconAttrs icon object attributes
 * @function Object() { [native code] }
 */
function IconObject(iconKeyId, iconAttrs) {
	const { iconName: name } = iconAttrs;

	/**
	 * Get all icon attributes.
	 *
	 * @return {Object} object attributes
	 */
	this.getAttributes = () => {
		return iconAttrs;
	};

	/**
	 * Get name of the icon.
	 *
	 * @return {string} icon name
	 */
	this.getName = () => {
		return name;
	};
}

/**
 * @module IconObject
 */
export default IconObject;
