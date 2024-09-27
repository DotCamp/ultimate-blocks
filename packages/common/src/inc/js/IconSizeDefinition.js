/**
 * Generate icon size definition.
 *
 * @param {string} name   size label
 * @param {string} slug   slug
 * @param {number} sizePx size in px
 * @function Object() { [native code] }
 *
 * @return {Object} icon size definition object
 */
function IconSizeDefinition(name, slug, sizePx) {
	return {
		name,
		slug,
		size: sizePx,
	};
}

/**
 * @module IconSizeDefinition
 */
export default IconSizeDefinition;
