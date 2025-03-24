<?php

use Ultimate_Blocks_Pro\CSS_Generator;

function ubpro_buttons_styles($_, $b){
    extract( $b );
    $is_wipe_animation = key_exists('animation', $b) && $b['animation'] === 'wipe';
    $wipe_animation_color = $is_wipe_animation ? $buttonColor : $buttonHoverColor;

	return array(
        '--ub-button-hover-color'   => $buttonIsTransparent ? $wipe_animation_color : $buttonTextHoverColor,
    );
}


add_action( 'ubpro_buttons_styles', 'ubpro_buttons_styles', 10, 2 );

function ubpro_button_link_styles($_, $b){
    extract( $b );
    $is_wipe_animation = key_exists('animation', $b) && $b['animation'] === 'wipe';
    $link_style = [];

     if ($is_wipe_animation) {
		$link_style['position'] = 'relative';
		$link_style['--ub-button-after-background-color'] = $b['buttonHoverColor'];
    }
    return $link_style;
}

add_filter( 'ubpro_button_link_styles', 'ubpro_button_link_styles', 10, 2 );


function ubpro_link_classes($classes, $b){
	extract( $b );
    $is_wipe_animation = key_exists('animation', $b) && $b['animation'] === 'wipe';
	$classes .= $is_wipe_animation ? ' ub-button-wipe-' . $wipeDirection : '';
	
	return esc_attr($classes);
}

add_filter( 'ubpro_button_link_classes', 'ubpro_link_classes', 10, 2 );

function ubpro_buttons_custom_image($_, $b){
	extract( $b );
	$iconSize = array(
		'small'  => 25,
		'medium' => 30,
		'large'  => 35,
		'larger' => 40,
	);
	$image_styles = [
		'max-height' => ($b['iconSize'] ?: $iconSize[$b['size']]) . $b['iconUnit'] . ';'
	];
	// Generate the styled image HTML if imageID exists
	if ($imageID > 0) {
		return '<img style="' . CSS_Generator\generate_css_string($image_styles) . '" class="ub-button-image" src="' . $imageURL . '" alt="' . $imageAlt . '">';
	}
	// Return empty string if no image
	return '';
}
add_filter( 'ubpro_buttons_custom_image', 'ubpro_buttons_custom_image', 10, 2 );