<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Content_Toggle\Inc\Search;

use DOMXPath;
use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_View_Base;
use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Block_Extension_View;

/**
 * View for content toggle block search functionality.
 */
class Content_Toggle_Search_View extends Block_Extension_View_Base implements I_Block_Extension_View {

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
		if ( isset( $attributes['searchStatus'] ) && $attributes['searchStatus'] ) {
			$dom_handler = static::get_dom_document( $block_content );

			if ( ! is_wp_error( $dom_handler ) ) {
				$dom_query_handler = new DOMXPath( $dom_handler );

				$main_wrapper = $dom_query_handler->query( '//div' );
				$main_wrapper = $main_wrapper->item( 0 );

				$content_toggle_panels_matches = $dom_query_handler->query( '//div[contains(@class,"wp-block-ub-content-toggle-panel")]' );
				if($content_toggle_panels_matches->length <= 0){
					$content_toggle_panels_matches = $dom_query_handler->query( '//div[contains(@class,"wp-block-ub-content-toggle-accordion")]' );
				}
				if ( $content_toggle_panels_matches->length > 0 ) {
					$top_content_toggle_panel = $content_toggle_panels_matches->item( 0 );

					if ( ! is_null( $top_content_toggle_panel ) ) {
						$search_component_fragment = $dom_handler->createDocumentFragment();

						// search functionality related block attributes for Search_Component to use
						$search_attributes = [
							'searchInputFilters'     => $attributes['searchInputFilters'],
							'searchAdvancedControls' => $attributes['searchAdvancedControls'],
							'searchMatchedColor'     => $attributes['searchMatchedColor'],
							'searchShowSummary'      => $attributes['searchShowSummary'],
						];

						$search_component = new Search_Component( $search_attributes );

						$search_component_fragment->appendXML( $search_component->render() );

						$search_component_wrapper = $dom_handler->createElement( 'div' );
						$search_component_wrapper->appendChild( $search_component_fragment );

						$main_wrapper->insertBefore( $search_component_wrapper->childNodes[0],
							$top_content_toggle_panel );

						$block_content = $dom_handler->saveHTML();
					}
				}
			}
		}

		return $block_content;
	}
}

