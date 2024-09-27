<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Expand\Inc;

use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_Base;
use Ultimate_Blocks_Pro\Src\Block_Extensions\Expand\Inc\Views\Expand_Portion_Extension_View;

/**
 * Pro extension for expand portion block.
 */
class Expand_Portion_Extension extends Block_Extension_Base {

	/**
	 * Get render view for block extension.
	 *
	 * @return string | null view class or null to use base component render
	 */
	public function get_view() {
		return Expand_Portion_Extension_View::class;
	}

	/**
	 * Block type of extension.
	 *
	 * @return string block type
	 */
	public function get_block_type() {
		return 'ub/expand-portion';
	}

	/**
	 * Extension attributes.
	 *
	 * These are extra block attributes required for extension functionality.
	 *
	 * @return array|null extension attributes, null if no attribute will be supplied
	 */
	public function extension_attributes() {
		return [
			'fade' => [ false, 'boolean' ],
			'isFaded' => [ false, 'boolean' ],
		];
	}
}
