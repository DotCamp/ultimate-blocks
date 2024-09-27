<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Tabbed_Content\Inc;

use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_Base;
use Ultimate_Blocks_Pro\Src\Block_Extensions\Tabbed_Content\Inc\Views\Tabbed_Content_View;

/**
 * Pro extension for tabbed content block.
 */
class Tabbed_Content_Extension extends Block_Extension_Base {

	/**
	 * Get render view for block extension.
	 *
	 * @return string | null view class or null to use base component render
	 */
	public function get_view() {
		return Tabbed_Content_View::class;
	}

	/**
	 * Block type of extension.
	 *
	 * @return string block type
	 */
	public function get_block_type() {
		return 'ub/tabbed-content-block';
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
			'tabsSubTitleEnabled' => [ false, 'boolean' ],
			'tabsIconStatus'      => [ false, 'boolean' ],
			'tabsImageStatus'     => [ false, 'boolean' ],
			'tabsSubTitle'        => [ [], 'array' ],
			'tabIcons'            => [ [], 'array' ],
			'tabIconSize'         => [ 30, 'number' ],
			'tabImageWidth'         => [ '30px', 'string' ],
			'tabImageHeight'         => [ '30px', 'string' ],
			'tabCallToAction'     => [ [], 'array' ],
			'tabImages'     	  => [ [], 'array' ]
		];
	}
}
