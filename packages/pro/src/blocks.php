<?php
require_once('block-extensions/button/block.php');
require_once('block-extensions/table-of-contents/block.php');
require_once('block-extensions/image-slider/block.php');
require_once('block-extensions/advanced-video/block.php');
require_once('block-extensions/advanced-video/block.php');
require_once('block-extensions/post-grid/block.php');
require_once dirname(__FILE__) . '/class-ultimate-blocks-pro-block-styling-functions.php';

add_filter('render_block', 'ubpro_button_filter', 10, 3);
add_filter('render_block', 'ubpro_table_of_contents_filter', 9, 3);
add_filter('render_block', 'ubpro_image_slider_filter', 9, 3);
add_filter('render_block_ub/advanced-video', 'ubpro_advanced_video_filter', 9, 3);
add_filter('render_block_ub/post-grid', 'ubpro_render_post_grid_block', 9, 3);

function ubpro_get_spacing_styles( $attributes ) {
	$padding = Ultimate_Blocks_Pro\CSS_Generator\get_spacing_css( $attributes['padding'] );
	$margin = Ultimate_Blocks_Pro\CSS_Generator\get_spacing_css( $attributes['margin'] );

	$styles = array(
		'padding-top'         => isset($padding['top']) ? $padding['top'] : "",
		'padding-left'        => isset($padding['left']) ? $padding['left'] : "",
		'padding-right'       => isset($padding['right']) ? $padding['right'] : "",
		'padding-bottom'      => isset($padding['bottom']) ? $padding['bottom'] : "",
		'margin-top'         => !empty($margin['top']) ? $margin['top'] . " !important" : "",
		'margin-left'        => !empty($margin['left']) ? $margin['left'] . " !important" : "",
		'margin-right'       => !empty($margin['right']) ? $margin['right'] . " !important" : "",
		'margin-bottom'      => !empty($margin['bottom']) ? $margin['bottom'] . " !important" : "",
	);

	return Ultimate_Blocks_Pro\CSS_Generator\generate_css_string( $styles );
}

function ubpro_include_block_attribute_css(){
    require plugin_dir_path(__FILE__) . 'defaults.php';
    require_once plugin_dir_path(__FILE__) . 'icons.php';

    $presentBlocks = array_unique(ub_getPresentBlocks(), SORT_REGULAR);
    $blockStylesheets = "";

    foreach( $presentBlocks as $block ){
        if(array_key_exists($block['blockName'], $defaultValues)){
            $attributes = array_merge(array_map(function($attribute){
                return $attribute['default'];
            }, $defaultValues[$block['blockName']]['attributes']), $block['attrs']);
        }
        if(isset($attributes) && array_key_exists('blockID', $attributes) && $attributes['blockID'] != ''){
            switch ($block['blockName']){
                default:
                    //nothing could be done
                    break;
                case 'ub/button':

                    $prefix = '#ub-button-' . $attributes['blockID'];

                    $presetIconSize = array('small' => 25, 'medium' => 30, 'large' => 35, 'larger' => 40);

                    foreach($attributes['buttons'] as $key => $button){
                        if( key_exists('animation', $attributes['buttons'][$key]) && $attributes['buttons'][$key]['animation'] === 'wipe'){
                            $blockStylesheets .= $prefix . ' .ub-button-container:nth-child('. ($key + 1) .') a{' . PHP_EOL .
                                'position: relative;' . PHP_EOL .
                            '}' . PHP_EOL .
                            $prefix . ' .ub-button-container:nth-child('. ($key + 1) .') a:hover{' . PHP_EOL .
                                'background-color: ' . $attributes['buttons'][$key]['buttonColor'] . ';' . PHP_EOL .
                                'color: ' . $attributes['buttons'][$key]['buttonTextColor'] . ';' . PHP_EOL .
                            '}' . PHP_EOL .
                            $prefix . ' .ub-button-container:nth-child('. ($key + 1) .') a:after{' . PHP_EOL .
                                'content: "";' . PHP_EOL .
                                'position: absolute;' . PHP_EOL .
                                'z-index: 5;' . PHP_EOL .
                                'background-color: ' . $attributes['buttons'][$key]['buttonHoverColor'] . ';' . PHP_EOL .
                                'transition: all 0.5s;' . PHP_EOL .
                            '}' . PHP_EOL .
                            $prefix . ' .ub-button-container:nth-child('. ($key + 1) .') .ub-button-content-holder{' . PHP_EOL .
                                'top: 0;' . PHP_EOL . 
                                'z-index: 6;' . PHP_EOL .
                            '}' ;
                        }
                        if( key_exists('imageURL', $attributes['buttons'][$key]) && $attributes['buttons'][$key]['imageURL'] !== '' ){
                            $blockStylesheets .= $prefix . ' .ub-button-container:nth-child('. ($key + 1) .') .ub-button-image{' . PHP_EOL .
                                'max-height: ' . ( $attributes['buttons'][$key]['iconSize'] ? : $presetIconSize[ $attributes['buttons'][$key]['size'] ]) . ($attributes['buttons'][$key]['iconUnit']) . ';' . PHP_EOL .
                            '}';
                        }
                    }
                    break;
                case 'ub/table-of-contents-block':
                    $prefix = '#ub_table-of-contents-' . $attributes['blockID'];
                    $styles = ubpro_get_spacing_styles($attributes);
					$blockStylesheets .= $prefix . '{' . PHP_EOL . $styles . PHP_EOL . "}"; 
                    $blockStylesheets .= $prefix . ' li{ color:' . $attributes['listIconColor'] .';  }';
                    if( $attributes['listStyle'] === "bulleted" && $attributes['listIcon'] !== ''){
                        $iconData = Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon($attributes['listIcon']);

                        $blockStylesheets .= $prefix . ' li{' . PHP_EOL .
                            'list-style: none;' . PHP_EOL .
                        '}' . PHP_EOL .
                        $prefix . ' li::before{' . PHP_EOL .
                            'top: 0.2em;' . PHP_EOL .
                            'content: "";' . PHP_EOL .
                            'position: relative;' . PHP_EOL .
                            'display: inline-block;' . PHP_EOL .
                            'background-repeat: no-repeat;' . PHP_EOL .
                            'height: 1em;' . PHP_EOL .
                            'width: 1em;' . PHP_EOL .
                            'background-image: url(\'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ' . $iconData[0]. ' ' . $iconData[1]
                            . '\"><path fill=\"%23' . substr($attributes['listIconColor'], 1) . '\" d=\"' . $iconData[2] . '\"></path></svg>\');' . PHP_EOL .
                            'margin-right: 5px;' . PHP_EOL .
                        '}' . PHP_EOL;
                    }
                    if($attributes['toggleButtonType'] === 'plus'){
                        $blockStylesheets .= $prefix . ' .ub_table-of-contents-plus-part{' . PHP_EOL .
                            'background-color: ' . $attributes['titleColor'] . ';' . PHP_EOL .
                        '}';
                        if($attributes['showList']){
                            $blockStylesheets .= $prefix . ':not(.ub_table-of-contents-collapsed) .ub_table-of-contents-plus-part.ub_vertical_bar{' . PHP_EOL .
                                'background-color: transparent;' . PHP_EOL .
                            '}';
                        }
                    }
                    if($attributes['toggleButtonType'] === 'chevron'){
                        $blockStylesheets .= $prefix . ' .ub_table-of-contents-chevron-left, ' . $prefix . ' .ub_table-of-contents-chevron-right{' . PHP_EOL .
                            'background-color: ' . $attributes['titleColor'] . ';' . PHP_EOL .
                        '}';
                    }
                    break;
                case 'ub/social-share':
					$prefix           = '#ub-social-share-' . $attributes['blockID'];
                    $styles           = ubpro_get_spacing_styles($attributes);
					$blockStylesheets .= $prefix . '{' . PHP_EOL . $styles . PHP_EOL . "}"; 
                    break;
                case 'ub/review':
                    $prefix           = '#ub_review_' . $attributes['blockID'];
					$styles           = ubpro_get_spacing_styles($attributes);
					$blockStylesheets .= $prefix . '{' . PHP_EOL . $styles . PHP_EOL . "}"; 
                    break;
                case 'ub/image-slider':
                    $prefix           = '#ub_image_slider_' . $attributes['blockID'];
					$styles           = ubpro_get_spacing_styles($attributes);
					$blockStylesheets .= $prefix . '{' . PHP_EOL . $styles . PHP_EOL . "}"; 
                    break;
                case 'ub/expand':
                    $prefix            = '#ub-expand-' . $attributes['blockID'];
                    $styling_functions = new Ultimate_Blocks_Pro_Block_Styling_Function();
                    $block_styles      = $styling_functions->ubpro_get_expand_block_styles($attributes); 

                    $styles            = ubpro_get_spacing_styles($attributes);
					$blockStylesheets  .= $prefix . '{' . PHP_EOL . $styles . PHP_EOL . PHP_EOL . $block_styles . PHP_EOL . "}"; 
                    break;
                case 'ub/divider':
                    $prefix           = '#ub_divider_' . $attributes['blockID'];
					$styles           = ubpro_get_spacing_styles($attributes);
                    $block_spacing_value = Ultimate_Blocks_Pro\CSS_Generator\spacing_preset_css_var(isset($attributes['iconSpacing']['all']) ? $attributes['iconSpacing']['all'] : '');
					$block_spacing = !empty($block_spacing_value) ? '--ub-divider-icon-spacing:' . $block_spacing_value . ';' : "";
					$blockStylesheets .= $prefix . '{' . PHP_EOL . $styles . $block_spacing . PHP_EOL . "}"; 
                    break;
                case 'ub/content-toggle-block':
                    $prefix           = '#ub-content-toggle-' . $attributes['blockID'];
					$styles           = ubpro_get_spacing_styles($attributes);
					$blockStylesheets .= $prefix . '{' . PHP_EOL . $styles . PHP_EOL . "}"; 
                    break;
            }
        }
    }


    ob_start(); ?>

    <style id="ub-pro"><?php echo($blockStylesheets); ?></style>
        
        <?php
        ob_end_flush();

}

add_action('wp_head', 'ubpro_include_block_attribute_css', 11, 3);
