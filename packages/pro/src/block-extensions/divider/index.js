import BlockExtensionBase from '@Base/BlockExtensionBase';
import NewDividerBlock from './block';

/**
 * Divider block extension.
 */
class DividerBlockExtension extends BlockExtensionBase {
	blockName() {
		return 'ub/divider';
	}

	blockComponent() {
		return NewDividerBlock;
	}
}

/**
 * @module DividerBlockExtension
 */
export default DividerBlockExtension;
