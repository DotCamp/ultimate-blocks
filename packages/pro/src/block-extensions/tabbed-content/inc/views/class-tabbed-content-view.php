<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Tabbed_Content\Inc\Views;

use DOMXPath;
use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_View_Base;
use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Block_Extension_View;

/**
 * Tabbed content block extension view.
 */
class Tabbed_Content_View extends Block_Extension_View_Base implements I_Block_Extension_View {

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
		$dom_document = static::get_dom_document( $block_content );

		if ( ! is_wp_error( $dom_document ) ) {
			$dom_query_handler  = new DOMXPath( $dom_document );
			$tab_title_wrappers = $dom_query_handler->query( '//div[contains(@class, "wp-block-ub-tabbed-content-tab-title-wrap")]' );
			if( count($tab_title_wrappers) <= 0 ){
				$tab_title_wrappers = $dom_query_handler->query( '//div[contains(@class, "wp-block-ub-tabbed-content-tab-title-vertical-wrap")]' );
			}

			$tabs_sub_status   	= $attributes['tabsSubTitleEnabled'];
			$tabs_icon_status  	= $attributes['tabsIconStatus'];
			$tabs_image_status 	= $attributes['tabsImageStatus'];
			$tab_sub_titles   	= $attributes['tabsSubTitle'];
			$tab_icon_list    	= $attributes['tabIcons'];
			$icon_size        	= $attributes['tabIconSize'];
			$cta_list         	= $attributes['tabCallToAction'];
			$tab_image_width    = $attributes['tabImageWidth'];
			$tab_image_height   = $attributes['tabImageHeight'];
			$tab_images        	= $attributes['tabImages'];


			if ( $tab_title_wrappers->length > 0 ) {
				foreach ( $tab_title_wrappers as $index => $tab_title ) {
					$temp_title_wrapper = new Tab_Title_Wrap( $tab_title, $dom_document );
					// add tab Image
					if ( $tabs_image_status ) {
						if ( isset( $tab_images[ $index ] ) ) {
							$temp_title_wrapper->add_image( $tab_images[ $index ], $tab_image_width, $tab_image_height , $dom_document );
						}
					}
					
					// add tab icon
					if ( $tabs_icon_status ) {
						if ( isset( $tab_icon_list[ $index ] ) ) {
							$temp_title_wrapper->add_icon( $tab_icon_list[ $index ], $icon_size, $dom_document );
						}
					}

					// add tab subtitle
					if ( $tabs_sub_status ) {
						if ( isset( $tab_sub_titles[ $index ] ) ) {
							$temp_title_wrapper->add_sub_text( $tab_sub_titles[ $index ] );
						}
					}

					// convert current tab into call-to-action
					if ( isset( $cta_list[ $index ] ) ) {
						$link = $cta_list[ $index ];

						if ( gettype( $link ) === 'string' ) {
							$temp_title_wrapper->change_to_cta( $cta_list[ $index ] );
						}
					}
				}
			}

			// query tab titles after operations again since they might be changed/replaced
			$tab_title_wrappers = $dom_query_handler->query( '//div[contains(@class, "wp-block-ub-tabbed-content-tab-title-wrap")]' );
			if( count($tab_title_wrappers) <= 0 ){
				$tab_title_wrappers = $dom_query_handler->query( '//div[contains(@class, "wp-block-ub-tabbed-content-tab-title-vertical-wrap")]' );
			}
			if ( $tab_title_wrappers->length > 0 ) {
				$cta_index_list = [];
				foreach ( $tab_title_wrappers as $tab_index => $title_wrapper ) {
					if ( $title_wrapper->getAttribute( 'data-ub-pro-cta' ) === 'true' ) {

						// remove startup selected attributes from tab wrappers
						$title_wrapper->setAttribute( 'aria-selected', 'false' );

						$class_list = str_replace( 'active', '', $title_wrapper->getAttribute( 'class' ) );
						$title_wrapper->setAttribute( 'class', $class_list );

						$cta_index_list[] = $tab_index;
					}
				}

				$active_tab = 0;

				if ( isset( $attributes['activeTab'] ) ) {
					$active_tab = $attributes['activeTab'];
				}

				// if active tab is a cta tab, find a more suitable one
				if ( in_array( $active_tab, $cta_index_list ) ) {
					foreach ( $tab_title_wrappers as $tab_index => $title_wrapper ) {
						if ( ! in_array( $tab_index, $cta_index_list ) ) {
							$title_wrapper->setAttribute( 'aria-selected', 'true' );

							$class_list = join( ' ', [ $title_wrapper->getAttribute( 'class' ), 'active' ] );
							$title_wrapper->setAttribute( 'class', $class_list );

							$active_tab = $tab_index;

							break;
						}
					}
				}

				$tab_content_wrappers = $dom_query_handler->query( '//div[contains(@class, "wp-block-ub-tabbed-content-tab-content-wrap")]' );

				// handle startup content visibility
				foreach ( $tab_content_wrappers as $index => $content_wrapper ) {
					$base_class_list = preg_split( '/\s+/', $content_wrapper->getAttribute( 'class' ) );

					if ( $index === $active_tab ) {
						// make attribute changes to show tab content on startup
						$base_class_list[] = 'active';

						$hide_index = array_search( 'ub-hide', $base_class_list );
						if ( $hide_index !== false ) {
							unset( $base_class_list[ $hide_index ] );
							$base_class_list = array_values( $base_class_list );
						}
					} else {
						// make attribute changes to hide tab content on startup
						$base_class_list[] = 'ub-hide';

						$active_index = array_search( 'active', $base_class_list );
						if ( $active_index !== false ) {
							unset( $base_class_list[ $active_index ] );
							$base_class_list = array_values( $base_class_list );
						}
					}

					// assign attribute changes to content wrapper
					$content_wrapper->setAttribute( 'class', join( ' ', array_unique( $base_class_list ) ) );
				}
			}

			return $dom_document->saveHTML();
		}

		return $block_content;
	}
}
