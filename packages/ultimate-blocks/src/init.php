<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since    1.0.0
 * @package CGB
 */

// Exit if accessed directly.

use PHPUnit\Event\Runtime\PHP;
use Ultimate_Blocks\includes\Editor_Data_Manager;

use function Ultimate_Blocks\includes\get_border_css;

require_once dirname(__DIR__) . '/src/extensions/extension-manager.php';
require_once dirname(__DIR__) . '/includes/ultimate-blocks-styles-css-generator.php';

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'get_current_screen' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/screen.php' );
}
function ub_get_spacing_styles( $attributes, $paddingImportant = false ) {
	$padding = Ultimate_Blocks\includes\get_spacing_css( isset($attributes['padding']) ? $attributes['padding'] : array() );
	$margin = Ultimate_Blocks\includes\get_spacing_css( isset($attributes['margin']) ? $attributes['margin'] : array() );

	$styles = array(
		'padding-top'        => isset($padding['top']) ? $padding['top'] . ($paddingImportant ? " !important" : "") : "",
		'padding-left'       => isset($padding['left']) ? $padding['left'] . ($paddingImportant ? " !important" : "") : "",
		'padding-right'      => isset($padding['right']) ? $padding['right'] . ($paddingImportant ? " !important" : "") : "",
		'padding-bottom'     => isset($padding['bottom']) ? $padding['bottom'] . ($paddingImportant ? " !important" : "") : "",
		'margin-top'         => !empty($margin['top']) ? $margin['top'] . " !important" : "",
		'margin-left'        => !empty($margin['left']) ? $margin['left'] . " !important" : "",
		'margin-right'       => !empty($margin['right']) ? $margin['right'] . " !important" : "",
		'margin-bottom'      => !empty($margin['bottom']) ? $margin['bottom'] . " !important" : "",
	);

	return Ultimate_Blocks\includes\generate_css_string( $styles );
}

/**
 * Check if the current page is the Gutenberg block editor.
 * @return bool
 */
function ub_check_is_gutenberg_page() {

	// The Gutenberg plugin is on.
	if ( function_exists( 'is_gutenberg_page' ) && is_gutenberg_page() ) {
		return true;
	}

	// Gutenberg page on WordPress 5+.
	$current_screen = get_current_screen();
	if ( $current_screen !== null && method_exists( $current_screen,
					'is_block_editor' ) && $current_screen->is_block_editor() ) {
		return true;
	}

	return false;

}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * `wp-blocks`: includes block type registration and related functions.
 *
 * @since 1.0.0
 */

function ub_update_css_version( $updated ) {
	static $frontendStyleUpdated = false;
	static $editorStyleUpdated = false;
	if ( $updated === 'frontend' ) {
		$frontendStyleUpdated = true;
	} elseif ( $updated === 'editor' ) {
		$editorStyleUpdated = true;
	}

	if ( $frontendStyleUpdated && $editorStyleUpdated ) {
		update_option( 'ultimate_blocks_css_version', Ultimate_Blocks_Constants::plugin_version() );
		if ( ! file_exists( wp_upload_dir()['basedir'] . '/ultimate-blocks/sprite-twitter.png' ) ) {
			copy( dirname( __DIR__ ) . '/src/blocks/click-to-tweet/icons/sprite-twitter.png',
					wp_upload_dir()['basedir'] . '/ultimate-blocks/sprite-twitter.png' );
		}
		$frontendStyleUpdated = false;
		$editorStyleUpdated   = false;
	}
}

function ub_load_assets() {
	if ( file_exists( wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.style.build.css' ) &&
		 get_option( 'ultimate_blocks_css_version' ) != Ultimate_Blocks_Constants::plugin_version() ) {
		$frontStyleFile = fopen( wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.style.build.css', 'w' );
		$blockDir       = dirname( __DIR__ ) . '/src/blocks/';
		$blockList      = get_option( 'ultimate_blocks', false );

		foreach ( $blockList as $key => $block ) {
			$blockDirName       = strtolower( str_replace( ' ', '-',
					trim( preg_replace( '/\(.+\)/', '', $blockList[ $key ]['label'] ) )
			) );
			$frontStyleLocation = $blockDir . $blockDirName . '/style.css';

			if ( file_exists( $frontStyleLocation ) && $blockList[ $key ]['active'] ) { //also detect if block is enabled
				if ( $block['name'] === 'ub/click-to-tweet' ) {
					fwrite( $frontStyleFile, str_replace( "src/blocks/click-to-tweet/icons", "ultimate-blocks",
							file_get_contents( $frontStyleLocation ) ) );
				} else {
					fwrite( $frontStyleFile, file_get_contents( $frontStyleLocation ) );
				}
			}
			if ( $block['name'] === 'ub/styled-box' && $blockList[ $key ]['active'] ) {
				//add css for blocks phased out by styled box
				fwrite( $frontStyleFile, file_get_contents( $blockDir . 'feature-box' . '/style.css' ) );
				fwrite( $frontStyleFile, file_get_contents( $blockDir . 'notification-box' . '/style.css' ) );
				fwrite( $frontStyleFile, file_get_contents( $blockDir . 'number-box' . '/style.css' ) );
			}
		}
		fclose( $frontStyleFile );
		ub_update_css_version( 'frontend' );
	}

	#TODO Temporary
	wp_enqueue_style(
		'ultimate_blocks-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array(), // Dependency to include the CSS after it.
		uniqid()  // Version: latest version number.
	);
	// wp_enqueue_style(
	// 		'ultimate_blocks-cgb-style-css', // Handle.
	// 		file_exists( wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.style.build.css' ) ?
	// 				content_url( '/uploads/ultimate-blocks/blocks.style.build.css' ) :
	// 				plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
	// 		array(), // Dependency to include the CSS after it.
	// 		Ultimate_Blocks_Constants::plugin_version()  // Version: latest version number.
	// );
}

function ub_advanced_heading_add_assets( $fontList ) {

	$fontNames = join( "|", array_filter( $fontList, function ( $item ) {
		return $item !== 'Default';
	} ) );

	wp_enqueue_style( 'ultimate_blocks-advanced-heading-fonts',
			'https://fonts.googleapis.com/css?family=' . $fontNames );
}

function ub_generate_widget_block_list( $output = false ) {
	static $blockList = array();
	require_once plugin_dir_path( __FILE__ ) . 'common.php';

	if ( ! $output ) {
		$widget_elements = get_option( 'widget_block' );
		foreach ( (array) $widget_elements as $key => $widget_element ) {
			if ( ! empty( $widget_element['content'] ) ) {

				$widget_blocks = ub_getPresentBlocks( $widget_element['content'] );

				foreach ( $widget_blocks as $block ) {
					$blockList[] = $block;
				}
			}
		}
	}

	return $blockList;
}

function ultimate_blocks_cgb_block_assets() {
	// Styles.
	if ( is_singular() and has_blocks() ) {
		require_once plugin_dir_path( __FILE__ ) . 'common.php';

		$main_assets_loaded = false;

		$advanced_heading_font_list = array();

		$widget_blocks = ub_generate_widget_block_list();

		$defaultFont = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';

		foreach ( $widget_blocks as $block ) {
			if ( strpos( $block['blockName'], 'ub/' ) === 0 ) {

				if ( ! $main_assets_loaded ) {
					ub_load_assets();
					$main_assets_loaded = true;
				}

				if ( strpos( $block['blockName'], 'ub/advanced-heading' ) === 0 ) {
					if ( $block['attrs']['fontFamily'] !== $defaultFont && ! in_array( $block['attrs']['fontFamily'],
									$advanced_heading_font_list ) ) {
						array_push( $advanced_heading_font_list, $block['attrs']['fontFamily'] );
					}
				}
			}
		}

		if ( ! ( $main_assets_loaded ) ) {
			$presentBlocks = ub_getPresentBlocks();

			foreach ( $presentBlocks as $block ) {
				if ( strpos( $block['blockName'], 'ub/' ) === 0 ) {

					if ( ! $main_assets_loaded ) {
						ub_load_assets();
						$main_assets_loaded = true;
					}

					if ( strpos( $block['blockName'], 'ub/advanced-heading' ) === 0 ) {
						if ( $block['attrs']['fontFamily'] !== $defaultFont && ! in_array( $block['attrs']['fontFamily'],
										$advanced_heading_font_list ) ) {
							array_push( $advanced_heading_font_list, $block['attrs']['fontFamily'] );
						}

					}
				}
			}
		}

		if ( count( $advanced_heading_font_list ) > 0 ) {
			ub_advanced_heading_add_assets( $advanced_heading_font_list );
		}

	} elseif ( ub_check_is_gutenberg_page() ) {
		ub_load_assets();
	}
} // End function ultimate_blocks_cgb_block_assets().

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'ultimate_blocks_cgb_block_assets' );

function ub_include_block_attribute_css() {
	require plugin_dir_path( __FILE__ ) . 'defaults.php';
	require_once plugin_dir_path( __FILE__ ) . 'common.php';

	$presentBlocks    = array_unique( array_merge( ub_getPresentBlocks(), ub_generate_widget_block_list( true ) ),
			SORT_REGULAR );
	$blockStylesheets = "";

	$hasNoSmoothScroll = true;

	foreach ( $presentBlocks as $block ) {
		if ( isset( $defaultValues[ $block['blockName'] ] ) ) {
			$attributes = array_merge( array_map( function ( $attribute ) {
				return $attribute['default'];
			}, $defaultValues[ $block['blockName'] ]['attributes'] ), $block['attrs'] );
		}

		if ( isset( $attributes ) && isset( $attributes['blockID'] ) && $attributes['blockID'] != '' ) {
			switch ( $block['blockName'] ) {
				default:
					//nothing could be done
					break;
				case 'ub/feature-box-block':
					$prefix           = '#ub_feature_box_' . $attributes['blockID'];
					$blockStylesheets .= $prefix . ' .ub_feature_one_title{' . PHP_EOL .
										 'text-align: ' . $attributes['title1Align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_feature_two_title{' . PHP_EOL .
										 'text-align: ' . $attributes['title2Align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_feature_three_title{' . PHP_EOL .
										 'text-align: ' . $attributes['title3Align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_feature_one_body{' . PHP_EOL .
										 'text-align: ' . $attributes['body1Align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_feature_two_body{' . PHP_EOL .
										 'text-align: ' . $attributes['body2Align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_feature_three_body{' . PHP_EOL .
										 'text-align: ' . $attributes['body3Align'] . ';' . PHP_EOL .
										 '}';
					break;
				case 'ub/how-to':
					$styles = ub_get_spacing_styles($attributes);
					$prefix = '#ub_howto_' . $attributes['blockID'];
					$blockStylesheets .= $prefix . '{' . $styles . '}';

					if ( $attributes['sectionListStyle'] === 'none' ) {
						$blockStylesheets .= $prefix . ' .ub_howto-section-display,' . $prefix . ' .ub_howto-step-display,' .
											 $prefix . ' .ub_howto-step-display .ub_howto-step{' . PHP_EOL .
											 'list-style: none;' . PHP_EOL .
											 '}' . PHP_EOL;
					}
					if ( $attributes['suppliesListStyle'] === 'none' ) {
						$blockStylesheets .= $prefix . ' .ub_howto-supplies-list{' . PHP_EOL .
											 'list-style: none;' . PHP_EOL .
											 '}' . PHP_EOL;
					}
					if ( $attributes['toolsListStyle'] === 'none' ) {
						$blockStylesheets .= $prefix . ' .ub_howto-tools-list{' . PHP_EOL .
											 'list-style: none;' . PHP_EOL .
											 '}' . PHP_EOL;
					}

					function ub_howto_getStepPic( $step ) {
						return $step['stepPic'];
					}

					function ub_howto_generateStepPicStyle( $stepPic ) {
						return 'width: ' . $stepPic['width'] . 'px;' .
							   ( $stepPic['float'] === 'left' ? 'padding-right: 10px;' : ( $stepPic['float'] === 'right' ? 'padding-left: 10px;' : '' ) ) .
							   ( $stepPic['float'] === 'none' ? '' : 'float: ' . $stepPic['float'] . ';' );
					}

					$blockStylesheets .= '@media (min-width: 768px){' . PHP_EOL;
					if ( $attributes['useSections'] ) {
						$sectionPicArray = array_map( function ( $section ) {
							return array_map( 'ub_howto_getStepPic', $section['steps'] );
						}, $attributes['section'] );

						$blockStylesheets .= implode( array_map( function ( $section, $outerIndex, $prefix ) {
							return implode( array_map( function ( $stepPic, $outerIndex, $innerIndex, $prefix ) {
								if ( $stepPic['width'] > 0 ) {
									return $prefix . ' .ub_howto-section:nth-child(' . ( $outerIndex + 1 ) . ') .ub_howto-step:nth-child(' . ( $innerIndex + 1 ) . ') figure,' .
										   $prefix . ' .ub_howto-section:nth-child(' . ( $outerIndex + 1 ) . ') .ub_howto-step:nth-child(' . ( $innerIndex + 1 ) . ') .ub_howto-step-image {' .
										   ub_howto_generateStepPicStyle( $stepPic ) .
										   '}' . PHP_EOL;
								} else {
									return '';
								}
							}, $section, array_fill( 0, count( $section ), $outerIndex ), array_keys( $section ),
									array_fill( 0, count( $section ), $prefix ) ) );
						}, $sectionPicArray, array_keys( $sectionPicArray ),
								array_fill( 0, count( $sectionPicArray ), $prefix ) ) );
					} else {
						$stepPicArray     = array_map( 'ub_howto_getStepPic',
								array_key_exists( 'section',
										$attributes ) ? $attributes['section'][0]['steps'] : array() );
						$blockStylesheets .= implode( array_map( function ( $stepPic, $index, $prefix ) {
							if ( array_key_exists( 'width', $stepPic ) && $stepPic['width'] > 0 ) {
								return $prefix . ' .ub_howto-step:nth-child(' . ( $index + 1 ) . ') figure,' .
									   $prefix . '.ub_howto-step:nth-child(' . ( $index + 1 ) . ') .ub_howto-step-image {' .
									   ub_howto_generateStepPicStyle( $stepPic ) .
									   '}' . PHP_EOL;
							} else {
								return '';
							}
						},
								$stepPicArray, array_keys( $stepPicArray ),
								array_fill( 0, count( $stepPicArray ), $prefix ) ) );
					}

					if ( $attributes['finalImageWidth'] > 0 ) {
						$blockStylesheets .= $prefix . ' .ub_howto-yield-image-container{' .
											 'width: ' . $attributes['finalImageWidth'] . 'px;' .
											 ( $attributes['finalImageFloat'] === 'left' ? 'padding-right: 10px;' : ( $attributes['finalImageFloat'] === 'right' ? 'padding-left: 10px;' : '' ) ) .
											 ( $attributes['finalImageFloat'] === 'none' ? '' : 'float: ' . $attributes['finalImageFloat'] . ';' );
						'}';
					}

					$blockStylesheets .= '}' . PHP_EOL;

					break;
				case 'ub/notification-box-block':
					$blockStylesheets .= '#ub-notification-box-' . $attributes['blockID'] . ' .ub_notify_text{' . PHP_EOL .
										 'text-align: ' . $attributes['align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL;
					break;
				case 'ub/number-box-block':
					$prefix           = '#ub-number-box-' . $attributes['blockID'];
					$blockStylesheets .= $prefix . ' .ub_number_one_title{' . PHP_EOL .
										 'text-align: ' . $attributes['title1Align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_number_two_title{' . PHP_EOL .
										 'text-align: ' . $attributes['title2Align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_number_three_title{' . PHP_EOL .
										 'text-align: ' . $attributes['title3Align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_number_one_body{' . PHP_EOL .
										 'text-align: ' . $attributes['body1Align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_number_two_body{' . PHP_EOL .
										 'text-align: ' . $attributes['body2Align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_number_three_body{' . PHP_EOL .
										 'text-align: ' . $attributes['body3Align'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_number_column{' . PHP_EOL .
										 'text-align: ' . $attributes['borderColor'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_number_box_number{' . PHP_EOL .
										 'background-color: ' . $attributes['numberBackground'] . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .ub_number_box_number>p{' . PHP_EOL .
										 'color: ' . $attributes['numberColor'] . ';' . PHP_EOL .
										 '}';
					break;
				case 'ub/tabbed-content-block':
					$prefix           = '#ub-tabbed-content-' . $attributes['blockID'];
					$styles 		   = ub_get_spacing_styles($attributes);
					if(isset($attributes['contentColor'])){
						$styles .= '--ub-tab-content-color:'. $attributes['contentColor'] .';';
					}
					if(isset($attributes['contentBackground'])){
						$styles .= '--ub-tab-content-background:'. $attributes['contentBackground'] .';';
					}
					$blockStylesheets .= $prefix . '{' . PHP_EOL . $styles . PHP_EOL . "}";
					$blockStylesheets .= $prefix . ' > .wp-block-ub-tabbed-content-tab-holder > .wp-block-ub-tabbed-content-tabs-title > .wp-block-ub-tabbed-content-tab-title-wrap, ' .
										 $prefix . ' > .wp-block-ub-tabbed-content-tab-holder > .wp-block-ub-tabbed-content-tabs-title-vertical-tab > .wp-block-ub-tabbed-content-tab-title-vertical-wrap{' . PHP_EOL .
										 ( $attributes['tabStyle'] === 'underline' ? '' : 'background-color: ' . ( $attributes['normalColor'] ?: 'inherit' ) . ';' . PHP_EOL ) .
										 ( ( $attributes['tabStyle'] === 'tabs' ? 'border-color: lightgrey;' : 'border: none;' ) . PHP_EOL ) .
										 'color: ' . ( $attributes['normalTitleColor'] ?: 'inherit' ) . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' > .wp-block-ub-tabbed-content-tab-holder > .wp-block-ub-tabbed-content-tabs-title > .wp-block-ub-tabbed-content-tab-title-wrap.active, ' .
										 $prefix . ' > .wp-block-ub-tabbed-content-tab-holder > .wp-block-ub-tabbed-content-tabs-title-vertical-tab > .wp-block-ub-tabbed-content-tab-title-vertical-wrap.active,' .
										 $prefix . ' > .wp-block-ub-tabbed-content-tab-holder > .wp-block-ub-tabbed-content-tabs-title > .wp-block-ub-tabbed-content-accordion-toggle.active{' . PHP_EOL .
										 ( $attributes['tabStyle'] === 'underline' ? 'border-bottom: 5px solid ' . $attributes['titleColor'] . ';' . PHP_EOL :
												 'background-color: ' . $attributes['theme'] . ';' . PHP_EOL ) .
										 'color: ' . ( $attributes['titleColor'] ?: 'inherit' ) . ';' . PHP_EOL .
										 '}' .
										 $prefix . '  .wp-block-ub-tabbed-content-accordion-toggle.active{' . PHP_EOL .
										 'background-color: ' . $attributes['theme'] . ';' . PHP_EOL .
										 '}' .
										 $prefix . ' > .wp-block-ub-tabbed-content-tab-holder > .wp-block-ub-tabbed-content-tabs-title{' . PHP_EOL .
										 'justify-content: ' . ( $attributes['tabsAlignment'] === 'center' ? 'center' :
									'flex-' . ( $attributes['tabsAlignment'] === 'left' ? 'start' : 'end' ) ) . ';' . PHP_EOL .
										 '}' . PHP_EOL .
										 $prefix . ' .wp-block-ub-tabbed-content-accordion-toggle{' . PHP_EOL .
										 'background-color: ' . ( $attributes['normalColor'] ?: 'transparent' ) . ';' . PHP_EOL .
										 'color: ' . ( $attributes['normalTitleColor'] ?: 'inherit' ) . ';' . PHP_EOL .
										 '}' . PHP_EOL;
					foreach ( $attributes['tabsTitleAlignment'] as $key => $titleAlign ) {
						$blockStylesheets .= $prefix . ' > .wp-block-ub-tabbed-content-tab-holder > .wp-block-ub-tabbed-content-tabs-title > .wp-block-ub-tabbed-content-tab-title-wrap:nth-child(' . ( $key + 1 ) . '){' . PHP_EOL .
											 'text-align: ' . $titleAlign . ';' . PHP_EOL .
											 '}' . PHP_EOL;
					}
					break;
				case 'ub/table-of-contents-block':
					$prefix = '#ub_table-of-contents-' . $attributes['blockID'];
					$styles = ub_get_spacing_styles($attributes);
					$blockStylesheets .= $prefix . '{' . PHP_EOL . $styles . PHP_EOL . "}";
					if ( $attributes['listStyle'] === 'plain' ) {
						$blockStylesheets .= $prefix . ' ul{' . PHP_EOL .
											 'list-style: none;' . PHP_EOL .
											 '}' . PHP_EOL;
					}
					if ( $attributes['enableSmoothScroll'] && $hasNoSmoothScroll ) {
						$blockStylesheets  .= 'html {' . PHP_EOL .
											  'scroll-behavior: smooth;' . PHP_EOL .
											  '}' . PHP_EOL;
						$hasNoSmoothScroll = false;
					}
					if ( $attributes['allowToCHiding'] ) {
						$blockStylesheets .= $prefix . '.ub_table-of-contents-collapsed {' . PHP_EOL .
											 'max-width: fit-content;' . PHP_EOL .
											 'max-width: -moz-fit-content;' . PHP_EOL .
											 '}' . PHP_EOL .
											 $prefix . '.ub_table-of-contents-collapsed .ub_table-of-contents-header {' . PHP_EOL .
											 'margin-bottom: 0;' . PHP_EOL .
											 '}' . PHP_EOL;
					}
					$blockStylesheets .= $prefix . ' .ub_table-of-contents-header{' . PHP_EOL .
										 'text-align: ' . $attributes['titleAlignment'] . ';' . PHP_EOL .
										 '}' . PHP_EOL;

					if ( $attributes['titleBackgroundColor'] ) {
						$blockStylesheets .= $prefix . ' .ub_table-of-contents-header-container,' . $prefix . ' .ub_table-of-contents-toggle-link {' . PHP_EOL .
											 'background-color: ' . $attributes['titleBackgroundColor'] . ';' . PHP_EOL .
											 '}' . PHP_EOL;
					}
					if ( $attributes['titleColor'] ) {
						$blockStylesheets .= $prefix . ' .ub_table-of-contents-title, ' . $prefix . ' .ub_table-of-contents-toggle,' . $prefix . ' .ub_table-of-contents-toggle-link{' . PHP_EOL .
											 'color: ' . $attributes['titleColor'] . ';' . PHP_EOL .
											 '}' . PHP_EOL;
					}
					if ( $attributes['listColor'] ) {
						$blockStylesheets .= $prefix . ' .ub_table-of-contents-container a{' . PHP_EOL .
											 'color: ' . $attributes['listColor'] . ';' . PHP_EOL .
											 '}' . PHP_EOL;
					}
					if ( $attributes['listBackgroundColor'] ) {
						$blockStylesheets .= $prefix . ' .ub_table-of-contents-extra-container{' . PHP_EOL .
											 'background-color: ' . $attributes['listBackgroundColor'] . ';' . PHP_EOL .
											 '}' . PHP_EOL;
					}
					if ( $attributes['listIconColor'] ) {
						$blockStylesheets .= $prefix . ' li{' . PHP_EOL .
											 'color: ' . $attributes['listIconColor'] . ';' . PHP_EOL . '}' . PHP_EOL;
					}
				break;
			}
		}
	}
	$blockStylesheets = preg_replace( '/\s+/', ' ', $blockStylesheets );
	ob_start(); ?>

	<style><?php echo( $blockStylesheets ); ?></style>

	<?php
	ob_end_flush();
}

add_action( 'wp_head', 'ub_include_block_attribute_css' );

/**
 * Enqueue assets which are important to be initialized before any version of plugin assets are.
 * @return void
 */
function ultimate_blocks_priority_editor_assets() {
	wp_enqueue_script( 'ultimate-blocks-priority-script',
			trailingslashit( ULTIMATE_BLOCKS_URL ) . 'dist/priority.build.js', [ 'wp-blocks' ], ULTIMATE_BLOCKS_VERSION,
			false );

	Editor_Data_Manager::get_instance()->attach_priority_data( [], 'ultimate-blocks-priority-script' );
}

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * `wp-blocks`: includes block type registration and related functions.
 * `wp-element`: includes the WordPress Element abstraction for describing the structure of your blocks.
 * `wp-i18n`: To internationalize the block's text.
 *
 * @since 1.0.0
 */
function ultimate_blocks_cgb_editor_assets() {
	// Scripts.
	wp_enqueue_script(
			'ultimate_blocks-cgb-block-js', // Handle.
			plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
			// Block.build.js: We register the block here. Built with Webpack.
			array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-editor', 'wp-api', 'lodash'), // Dependencies, defined above.
			Ultimate_Blocks_Constants::plugin_version(), true  // Version: latest version number.
	);

	$extensions = get_option('ultimate_blocks_extensions');
	wp_localize_script( 'ultimate_blocks-cgb-block-js', 'ub_extensions', $extensions );
	Editor_Data_Manager::get_instance()->attach_editor_data( [], 'ultimate_blocks-cgb-block-js' );

	wp_enqueue_script(
			'ultimate_blocks-cgb-deactivator-js', // Handle.
			plugins_url( '/dist/deactivator.build.js', dirname( __FILE__ ) ),
			// Block.build.js: We register the block here. Built with Webpack.
			array( 'wp-editor', 'wp-blocks', 'wp-i18n', 'wp-element' ), // Dependencies, defined above.
			Ultimate_Blocks_Constants::plugin_version(), // Version: latest version number.
			true
	);

	// Styles.
	if ( file_exists( wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.editor.build.css' ) &&
		 get_option( 'ultimate_blocks_css_version' ) != Ultimate_Blocks_Constants::plugin_version() ) {
		$adminStyleFile = fopen( wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.editor.build.css', 'w' );
		$blockDir       = dirname( __DIR__ ) . '/src/blocks/';
		$blockList      = get_option( 'ultimate_blocks', false );

		foreach ( $blockList as $key => $block ) {
			$blockDirName       = strtolower( str_replace( ' ', '-',
					trim( preg_replace( '/\(.+\)/', '', $blockList[ $key ]['label'] ) )
			) );
			$adminStyleLocation = $blockDir . $blockDirName . '/editor.css';

			if ( file_exists( $adminStyleLocation ) && $blockList[ $key ]['active'] ) { //also detect if block is enabled
				fwrite( $adminStyleFile, file_get_contents( $adminStyleLocation ) );
			}
			if ( $block['name'] === 'ub/styled-box' && $blockList[ $key ]['active'] ) {
				//add css for blocks phased out by styled box
				fwrite( $adminStyleFile, file_get_contents( $blockDir . 'feature-box' . '/editor.css' ) );
				fwrite( $adminStyleFile, file_get_contents( $blockDir . 'number-box' . '/editor.css' ) );
			}
		}
		fclose( $adminStyleFile );
		ub_update_css_version( 'editor' );
	}

	wp_enqueue_style(
			'ultimate_blocks-cgb-block-editor-css', // Handle.
			file_exists( wp_upload_dir()['basedir'] . '/ultimate-blocks/blocks.editor.build.css' ) ?
					content_url( '/uploads/ultimate-blocks/blocks.editor.build.css' ) :
					plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
			array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
			Ultimate_Blocks_Constants::plugin_version() // Version: latest version number
	);
} // End function ultimate_blocks_cgb_editor_assets().

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'ultimate_blocks_priority_editor_assets', 1 );

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'ultimate_blocks_cgb_editor_assets' );


function ub_register_settings() {
	register_setting( 'ub_settings', 'ub_icon_choices', array(
			'type'         => 'string',
			'show_in_rest' => true,
			'default'      => '' //value should be in json
	) );
}

add_action( 'init', 'ub_register_settings' );

/**
 * Rank Math ToC Plugins List.
 */
add_filter( 'rank_math/researches/toc_plugins', function ( $toc_plugins ) {
	$toc_plugins['ultimate-blocks/ultimate-blocks.php'] = 'Ultimate Blocks';

	return $toc_plugins;
} );

// Click to Tweet Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/click-to-tweet/block.php';

// Social Share Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/social-share/block.php';

// Content toggle Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/content-toggle/block.php';

// Tabbed Content Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/tabbed-content/block.php';

// Progress Bar Block.
require_once plugin_dir_path( __FILE__ ) . 'blocks/progress-bar/block.php';

// Countdown Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/countdown/block.php';

// Image Slider Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/image-slider/block.php';

// Table of Contents Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/table-of-contents/block.php';

// Button Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/button/block.php';

// Content Filter Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/content-filter/block.php';

// Call to Action Block
require_once plugin_dir_path( __FILE__ ) . 'blocks/call-to-action/block.php';

// Feature Box
require_once plugin_dir_path( __FILE__ ) . 'blocks/feature-box/block.php';

// Notification Box
require_once plugin_dir_path( __FILE__ ) . 'blocks/notification-box/block.php';

// Number Box
require_once plugin_dir_path( __FILE__ ) . 'blocks/number-box/block.php';

// Star Rating
require_once plugin_dir_path( __FILE__ ) . 'blocks/star-rating/block.php';

// Testimonial
require_once plugin_dir_path( __FILE__ ) . 'blocks/testimonial/block.php';

// Review
require_once plugin_dir_path( __FILE__ ) . 'blocks/review/block.php';

// Divider
require_once plugin_dir_path( __FILE__ ) . 'blocks/divider/block.php';

//Post-Grid
require_once plugin_dir_path( __File__ ) . 'blocks/post-grid/block.php';

//Styled Box
require_once plugin_dir_path( __FILE__ ) . 'blocks/styled-box/block.php';

//Expand
require_once plugin_dir_path( __FILE__ ) . 'blocks/expand/block.php';

// Styled List
require_once plugin_dir_path( __FILE__ ) . 'blocks/styled-list/block.php';

// How To
require_once plugin_dir_path( __FILE__ ) . 'blocks/how-to/block.php';

// Advanced Heading
require_once plugin_dir_path( __FILE__ ) . 'blocks/advanced-heading/block.php';

// Advanced Video
require_once plugin_dir_path( __FILE__ ) . 'blocks/advanced-video/block.php';

// Icon
require_once plugin_dir_path( __FILE__ ) . 'blocks/icon/block.php';

// Counter
require_once plugin_dir_path( __FILE__ ) . 'blocks/counter/block.php';

/**
 * Innerblocks.
 */
// icon innerblock
require_once plugin_dir_path( __FILE__ ) . 'blocks/icon-inner/block.php';
