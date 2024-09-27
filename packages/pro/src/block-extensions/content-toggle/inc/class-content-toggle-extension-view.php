<?php
/**
 * Content toggle block extension view.
 *
 * @package ultimate-blocks-pro
 */

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Content_Toggle\Inc;

use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Block_Extension_View;
use Ultimate_Blocks_Pro\Src\Block_Extensions\Content_Toggle\Inc\Search\Content_Toggle_Search_View;

/**
 * Extension view for content toggle block.
 */
class Content_Toggle_Extension_View implements I_Block_Extension_View {
	/**
	 * Render block extension.
	 *
	 * @param String $block_content the block content about to be appended.
	 * @param array  $attributes block attributed including both base and extension.
	 * @param $block
	 *
	 * @return string | null HTML string of render
	 */
	public static function render( $block_content, $attributes, $block ) {
		return Content_Toggle_Search_View::render( $block_content, $attributes, $block );
	}
}
