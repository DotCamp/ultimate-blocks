import BlockExtensionBase from '@Base/BlockExtensionBase.js';
import NewContentToggle from './block';
import NewContentTogglePanel from './components/panel';

/**
 * Content toggle block extension.
 */
class ContentToggleExtension extends BlockExtensionBase {
	blockName() {
		return 'ub/content-toggle-block';
	}

	blockComponent() {
		return NewContentToggle;
	}
}

/**
 * Content toggle panel block extension.
 */
export class ContentTogglePanelExtension extends BlockExtensionBase {
	blockName() {
		return 'ub/content-toggle-panel';
	}

	blockComponent() {
		return NewContentTogglePanel;
	}
}

/**
 * Content toggle panel block extension.
 */
export class ContentTogglePanelBlockExtension extends BlockExtensionBase {
	blockName() {
		return 'ub/content-toggle-panel-block';
	}

	blockComponent() {
		return NewContentTogglePanel;
	}
}

/**
 * @module ContentToggleExtension
 */
export default ContentToggleExtension;
