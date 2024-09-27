<?php
/**
 * Content toggle panel extension view.
 *
 * @package ultimate-blocks-pro
 */

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Content_Toggle\Inc;

use DOMXPath;
use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_View_Base;
use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Block_Extension_View;
use WP_Block;

/**
 * Content toggle panel extension view.
 */
class Content_Toggle_Panel_Extension_View extends Block_Extension_View_Base implements I_Block_Extension_View {

	/**
	 * Render block extension.
	 *
	 * @param String   $block_content the block content about to be appended.
	 * @param array    $attributes block attributed including both base and extension.
	 * @param WP_Block $block block instance.
	 *
	 * @return string | null HTML string of render
	 */
	public static function render( $block_content, $attributes, $block ) {
		$handler = static::get_dom_document( $block_content );

		if ( ! is_wp_error( $handler ) ) {
			$block_context = $block->context;
			if ( isset( $block_context['parentID'] ) ) {
				$parent_id         = $block_context['parentID'];
				$dom_query_handler = new DOMXPath( $handler );

				$title_wrapper_matches = $dom_query_handler->query( '//div[contains(@class, "wp-block-ub-content-toggle-accordion-title-wrap")]' );

				if ( $title_wrapper_matches->length > 0 ) {
					$title_wrapper = $title_wrapper_matches->item( 0 );
					$aria_controls = $title_wrapper->getAttribute( 'aria-controls' ) . $parent_id;

					$title_wrapper->setAttribute( 'aria-controls', esc_attr( $aria_controls ) );
					$title_matches = $dom_query_handler->query( '//div[contains(@class, "wp-block-ub-content-toggle-accordion-title-wrap")]//*[contains(@class, "wp-block-ub-content-toggle-accordion-title")]' );

					if ( $title_matches->length > 0 ) {
						$title             = $title_matches->item( 0 );
						$prepared_id_class = join(
							' ',
							array( $title->getAttribute( 'class' ), 'ub-content-toggle-title-' . $parent_id )
						);

						$title->setAttribute( 'class', esc_attr( $prepared_id_class ) );
					}

					$block_content = $handler->saveHTML();
				}
			}
		}

		return $block_content;
	}
}
