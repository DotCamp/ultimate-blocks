/**
 * Block extension base.
 */
class BlockExtensionBase {
	/**
	 * Target block name.
	 *
	 * @abstract
	 *
	 * @return {string} block name
	 */
	blockName() {
		throw new Error(`no block name is defined for block extension`);
	}

	/**
	 * Block extension component.
	 *
	 * This is the React component which will handle editor and inspector operations.
	 *
	 * @abstract
	 *
	 * @return {JSX.Element | Function} block component
	 */
	blockComponent() {
		throw new Error(
			`no block component is defined for ${this.blockName} extension`
		);
	}
}

/**
 * @module BlockExtensionBase
 */
export default BlockExtensionBase;
