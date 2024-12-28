<?php
require_once('block-extensions/button/block.php');
require_once('block-extensions/table-of-contents/block.php');
require_once('block-extensions/image-slider/block.php');
require_once('block-extensions/advanced-video/block.php');
require_once('block-extensions/advanced-video/block.php');
require_once('block-extensions/post-grid/block.php');

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
            }
        }
    }


    ob_start(); ?>

    <style id="ub-pro"><?php echo($blockStylesheets); ?></style>
        
        <?php
        ob_end_flush();

}

add_action('wp_head', 'ubpro_include_block_attribute_css', 11, 3);
