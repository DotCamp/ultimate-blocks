<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Divider\Inc;

use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_Base;

/**
 * Pro extension for divider block.
 */
class Divider_Extension extends Block_Extension_Base {

	/**
	 * Get render view for block extension.
	 *
	 * @return string | null view class or null to use base component render
	 */
	public function get_view() {
		// return Divider_Extension_View::class;
	}

	/**
	 * Block type of extension.
	 *
	 * @return string block type
	 */
	public function get_block_type() {
		return 'ub/divider';
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
			'icon'                => [ '', 'string' ],
			'iconBackgroundColor' => [ '', 'string' ],
			'iconSize'            => [ 30, 'number' ],
			'iconAlignment'       => [ 'center', 'string' ]
		];
	}
}
