<?php
/**
 * Content toggle panel extension.
 *
 * @package ultimate-blocks-pro
 */

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Content_Toggle\Inc;

use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_Base;

/**
 * Content toggle panel extension.
 *
 * This extension is targeted for content toggle panel block.
 * It is not a dynamic block, so we will make changes to its render through this extension.
 */
class Content_Toggle_Panel_Extension extends Block_Extension_Base {

	/**
	 * Get render view for block extension.
	 *
	 * @return string | null view class or null to use base component render
	 */
	public function get_view() {
		return Content_Toggle_Panel_Extension_View::class;
	}

	/**
	 * Block type of extension.
	 *
	 * @return string block type
	 */
	public function get_block_type() {
		return 'ub/content-toggle-panel';
	}

	/**
	 * Extension attributes.
	 *
	 * These are extra block attributes required for extension functionality.
	 *
	 * @return array|null extension attributes, null if no attribute will be supplied
	 */
	public function extension_attributes() {
		return null;
	}
}
