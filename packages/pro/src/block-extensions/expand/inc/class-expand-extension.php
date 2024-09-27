<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Expand\Inc;

use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_Base;

/**
 * Pro extension for expand block.
 */
class Expand_Extension extends Block_Extension_Base {

	/**
	 * Whether to switch base block script with supplied one.
	 * @var bool status
	 */
	public $switch_block_script = true;

	/**
	 * Get render view for block extension.
	 *
	 * @return string | null view class or null to use base component render
	 */
	public function get_view() {
		return null;
	}

	/**
	 * Block type of extension.
	 *
	 * @return string block type
	 */
	public function get_block_type() {
		return 'ub/expand';
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
		];
	}

	/**
	 * Relative path to plugin source root for frontend scripts.
	 * @return null | string script path
	 */
	public function frontend_script_path() {
		return 'src/block-extensions/expand/front.js';
	}

	/**
	 * Frontend script handler name.
	 * @return string | null handler name
	 */
	public function frontend_script_handler() {
		return 'ultimate_blocks-expand-front-script';
	}
}
