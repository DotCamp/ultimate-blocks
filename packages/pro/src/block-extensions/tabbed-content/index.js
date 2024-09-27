import BlockExtensionBase from '@Base/BlockExtensionBase.js';
import TabbedContentPro from './block';

/**
 * Tabbed content block pro extension.
 */
class TabbedContentExtension extends BlockExtensionBase {
	blockComponent() {
		return TabbedContentPro;
	}

	blockName() {
		return 'ub/tabbed-content-block';
	}
}

/**
 * @module TabbedContentExtension
 */
export default TabbedContentExtension;
