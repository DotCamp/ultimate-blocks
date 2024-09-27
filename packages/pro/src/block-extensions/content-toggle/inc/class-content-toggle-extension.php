<?php
/**
 * Content toggle extension.
 *
 * @package ultimate-blocks-pro
 */

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Content_Toggle\Inc;

use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_Base;

/**
 * Pro extension for content toggle block.
 */
class Content_Toggle_Extension extends Block_Extension_Base {

	/**
	 * Get render view for block extension.
	 *
	 * @return string | null view class or null to use base component render
	 */
	public function get_view() {
		return Content_Toggle_Extension_View::class;
	}

	/**
	 * Block type of extension.
	 *
	 * @return string block type
	 */
	public function get_block_type() {
		return 'ub/content-toggle-block';
	}

	/**
	 * Extension attributes.
	 *
	 * These are extra block attributes required for extension functionality.
	 *
	 * @return array|null extension attributes, null if no attribute will be supplied
	 */
	public function extension_attributes() {
		return array(
			'searchStatus'           => array( false, 'boolean' ),
			'searchAdvancedControls' => array( false, 'boolean' ),
			'searchMatchedColor'     => array( '#FACC15', 'string' ),
			'searchInputFilters'     => array( array(), 'array' ),
			'searchShowSummary'      => array( true, 'array' ),
		);
	}

	/**
	 * Relative path to plugin source root for frontend scripts.
	 *
	 * @return null | string script path
	 */
	public function frontend_script_path() {
		return 'inc/extra/js/dist/ContentToggleSearch.js';
	}
}
