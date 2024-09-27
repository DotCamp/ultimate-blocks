<?php
/**
 * Render view for review block extension.
 *
 * @package Ultimate_Blocks_Pro
 */

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc;

use DOMDocument;
use DOMXPath;
use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_View_Base;
use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Block_Extension_View;
use Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Basic_Card\Pros_Cons_Column;
use function esc_attr;
use function is_wp_error;
use function mb_convert_encoding;

/**
 * Render view for review block extension.
 */
class Review_Block_Extension_View extends Block_Extension_View_Base implements I_Block_Extension_View {

	/**
	 * Generate wrapper styles.
	 *
	 * @param array $attributes block attributed including both base and extension.
	 *
	 * @return string wrapper styles
	 */
	private static function wrapper_styles( $attributes ) {
		return sprintf( 'font-size: %spx', esc_attr( $attributes['fontSize'] ) );
	}

	/**
	 * Render basic/card layout.
	 *
	 * @param array $attributes block attributed including both base and extension.
	 *
	 * @return string columns
	 */
	private static function render_basic_card( $attributes ) {
		$label_translations = array(
			'pros' => isset( $attributes['prosTitle'] ) ? esc_html__( 'pros', 'ultimate-blocks-pro' ) : '',
			'cons' => isset( $attributes['consTitle'] ) ? esc_html__( 'cons', 'ultimate-blocks-pro' ) : '',
		);

		$rendered_html = '';

		foreach ( $attributes['prosConsPositionData'] as $column_position => $column_type ) {
			$column_object  = new Pros_Cons_Column(
				$label_translations[ $column_type ],
				$column_type,
				$column_position,
				$attributes
			);
			$rendered_html .= $column_object->render();
		}

		return $rendered_html;
	}

	/**
	 * Render layout.
	 *
	 * @param string $layout_type layout type.
	 * @param array  $attributes block attributes.
	 *
	 * @return string layout HTML
	 */
	private static function render_layout( $layout_type, $attributes ) {
		switch ( $layout_type ) {
			case Review_Block_Extension::PROS_CONS_LAYOUT_TYPES['BASIC']:
			case Review_Block_Extension::PROS_CONS_LAYOUT_TYPES['CARD']:
				return static::render_basic_card( $attributes );
			case Review_Block_Extension::PROS_CONS_LAYOUT_TYPES['GRAPH']:
				$graph_layout = new Pros_Cons_Graph_Layout( $attributes );

				return $graph_layout->render();
		}

		return '';
	}

	/**
	 * Render pros/cons elements.
	 *
	 * @param array $attributes block attributed including both base and extension.
	 *
	 * @return string
	 */
	private static function render_pros_cons( $attributes ) {
		$block_id                 = esc_attr( $attributes['blockID'] );
		$layout_type              = esc_attr( $attributes['prosConsLayout'] );
		$generated_wrapper_styles = static::wrapper_styles( $attributes );
		$layout_html              = static::render_layout( $layout_type, $attributes );

		return <<<RENDER
            <div id="review_pros_cons_$block_id">
                <div data-layout-type="$layout_type" class="ub-pros-cons-wrapper" style="$generated_wrapper_styles">
					$layout_html
                </div>
            </div>
RENDER;
	}

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
		$dom_handler = static::get_dom_document( $block_content );

		if ( ! is_wp_error( $dom_handler ) ) {
			$dom_query_handler = new DOMXPath( $dom_handler );

			// add wrapper styles.
			$main_block_wrapper_results = $dom_query_handler->query('//*[contains(concat(" ", normalize-space(@class), " "), " wp-block-ub-review ")]');
			if ( 1 === $main_block_wrapper_results->length ) {
				$main_block_wrapper_el = $main_block_wrapper_results->item( 0 );

				$current_styles = explode( ';', $main_block_wrapper_el->getAttribute( 'style' ) );

				if ( ! is_array( $current_styles ) ) {
					$current_styles = array();
				}

				$current_styles = array_filter(
					$current_styles,
					function ( $val ) {
						return ! empty( $val );
					}
				);

				// push style lines to array.
				$current_styles[] = 'background-color: ' . esc_attr( $attributes['bgColor'] );
				$current_styles[] = 'color: ' . esc_attr( $attributes['fontColor'] );

				$main_block_wrapper_el->setAttribute( 'style', implode( ';', $current_styles ) );
			}

			// add pros/cons.
			if ( $attributes['prosConsEnabled'] ) {
				$cta_panel_results      = $dom_query_handler->query( '//div[@class="ub_review_cta_panel"]' );
				$review_summary_results = $dom_query_handler->query( '//div[@class="ub_review_summary"]' );

				if ( 1 === $cta_panel_results->length && 1 === $review_summary_results->length ) {
					$cta_panel_element      = $cta_panel_results->item( 0 );
					$review_summary_element = $review_summary_results->item( 0 );

					$pros_cons_fragment = $dom_handler->createDocumentFragment();

					$pros_cons_html = static::render_pros_cons( $attributes );
					$pros_cons_fragment->appendXML( $pros_cons_html );

					$pros_cons_wrapper = $dom_handler->createElement( 'div' );
					$pros_cons_wrapper->appendChild( $pros_cons_fragment );

					// @codingStandardsIgnoreLine
					$review_summary_element->insertBefore( $pros_cons_wrapper->childNodes[1], $cta_panel_element );
				}
			}

			return $dom_handler->saveHTML();
		}

		return null;
	}
}
