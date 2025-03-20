<?php

use Ultimate_Blocks_Pro\CSS_Generator;

function ubpro_image_slider_replace_script(){
    wp_dequeue_script( 'ultimate_blocks-image-slider-init-script' );
    wp_deregister_script( 'ultimate_blocks-image-slider-init-script' );
    wp_enqueue_script(
        'ultimate_blocks-image-slider-init-script',
        plugins_url( 'image-slider/front.js', dirname( __FILE__ ) ),
        array('ultimate_blocks-swiper'),
        Ultimate_Blocks_Pro_Constants::plugin_version(),
        true
    );
}

add_action('wp_enqueue_scripts', 'ubpro_image_slider_replace_script', 20);


function ubpro_image_slider_extend($slider_html, $block){
    if ("ub/image-slider" != $block->parsed_block['blockName']) {
        return $slider_html;
    }

    extract($block->parsed_block['attrs']);

    $imageArray = isset($pics) ? (count($pics) > 0 ? $pics : json_decode($images, true)) : array();
    $thumbs = '';

    foreach ($imageArray as $image) {
        $thumbs .= '<img class="swiper-slide" src="' . esc_url($image['url']) . '">';
    }
    if (isset($showThumbnails) && $showThumbnails === true) {
        $slider_html .= sprintf(
            '<div class="ub_image_slider_thumbs swiper-container" data-swiper-data=\'{"slidesPerView": 4, "freeMode": true, "watchSlidesProgress": true, "watchSlidesVisibility": true}\'><div class="swiper-wrapper">%1$s</div></div>',
            $thumbs
        );
    }

    return $slider_html;
}

add_filter('ubpro_image_slider_filter', 'ubpro_image_slider_extend', 10, 2);
