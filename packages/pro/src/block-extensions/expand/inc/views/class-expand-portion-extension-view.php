<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Expand\Inc\Views;

use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Block_Extension_View;

/**
 * Extension view for expand portion block.
 */
class Expand_Portion_Extension_View implements I_Block_Extension_View {
	/**
	 * Render block extension.
	 *
	 * @param String $block_content the block content about to be appended
	 * @param array $attributes block attributed including both base and extension
	 * @param $block
	 *
	 * @return string | null HTML string of render
	 */
	public static function render( $block_content, $attributes, $block ) {
		extract( $attributes );

		if ( $displayType === 'partial' && $attributes['fade'] ) {
			$block_content = preg_replace( '/(<a class="ub-expand-toggle-button" role="button".+<\/a>)<\/div>$/',
				'</div>${1}</div>',
				preg_replace( '/^<div class="ub-expand-portion ub-expand-partial"\s*([^>]*)>/',
					'<div class="ub-expand-portion ub-expand-partial"><div class="ub-fade">', $block_content ) );
			
			return $block_content;
		} else {
			return $block_content;
		}
	}
}
