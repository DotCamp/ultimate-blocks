<?php
/**
 * Block extension render HTML interface.
 *
 * @package ultimate-blocks-pro
 */

namespace Ultimate_Blocks_Pro\Inc\Common\Interfaces;

use WP_Block;

/**
 * Block extension render HTML interface.
 */
interface I_Block_Extension_View {

	/**
	 * Render block extension.
	 *
	 * @param String   $block_content the block content about to be appended.
	 * @param array    $attributes block attributed including both base and extension.
	 * @param WP_Block $block block instance.
	 *
	 * @return string | null HTML string of render
	 */
	public static function render( $block_content, $attributes, $block );
}
