<?php

use Ultimate_Blocks_Pro\CSS_Generator;

function ubpro_get_image_slider_styles( $attributes ) {
	$navigation_color = isset($attributes['navigationColor']) ? $attributes['navigationColor'] : '';
	$pagination_color = isset($attributes['paginationColor']) ? $attributes['paginationColor'] : '';
	$active_pagination_color = isset($attributes['activePaginationColor']) ? $attributes['activePaginationColor'] : '';

	$styles = array(
		'--swiper-navigation-color'				=> $navigation_color,
		'--swiper-pagination-color'				=> $active_pagination_color,
		'--swiper-inactive-pagination-color'	=> $pagination_color,
		'--swiper-navigation-background-color'	=> CSS_Generator\get_background_color_var($attributes, 'navigationBackgroundColor', 'navigationGradientColor')
	);

	return CSS_Generator\generate_css_string( $styles );
}

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


function ubpro_image_slider_filter($block_content, $block){
    if( "ub/image-slider" != $block['blockName'] ) {
        return $block_content;
    }
    else{
        require dirname(dirname(__DIR__)) . '/defaults.php';
        foreach($defaultValues['ub/image-slider']['attributes'] as $key => $value){
            if(!isset($block['attrs'][$key])){
                $block['attrs'][$key] = $value['default'];
            }
        }

        //echo json_encode($block['attrs']);

        extract($block['attrs']);

	    $imageArray = isset($pics) ? (count($pics) > 0 ? $pics : json_decode($images, true)) : array();
	    $captionArray = isset($descriptions) ? count($descriptions) > 0 ? $descriptions : json_decode($captions, true) : array();

        $gallery = '';

        $thumbs = '';

        foreach($imageArray as $key => $image){
            $gallery .= '<figure class="swiper-slide">
            <img src="' . $image['url'] . '" alt="' . wp_kses_post($image['alt']) . '"' .
                ($blockID === '' ? ' style="height: ' . $sliderHeight . 'px;"' : '') . '>' .
                '<figcaption class="ub_image_slider_image_caption">' . ($captionArray[$key]['link'] === '' ? '' : '<a href="' . esc_url($captionArray[$key]['link']) . '">')
                . $captionArray[$key]['text']
                . ($captionArray[$key]['link'] === '' ? '' : '</a>') . ' </figcaption></figure>';

            $thumbs .= '<img class="swiper-slide" src="' . $image['url'] . '">';
        }
        $classes = array( 'ub_image_slider', 'swiper-container', 'wp-block-ub-image-slider' );
        if( !empty($align) ){
            $classes[] = 'align' . esc_attr($align) ;
        }
        if(isset($className)){
            $classes[] =  esc_attr($className) ;
        }

        $styles = ubpro_get_image_slider_styles($block['attrs']);
        $wrapper_attributes = get_block_wrapper_attributes(
            array(
                'class' => implode(' ', $classes),
                'style' => $styles
            )
        );
        return '<div ' . $wrapper_attributes . '' . ($blockID === '' ? 'style="min-height: ' . (25 + (count($imageArray) > 0) ? $sliderHeight : 200) . 'px;"'
            : 'id="ub_image_slider_' . $blockID . '"').
            ' data-swiper-data=\'{"speed":' . $speed . ',"spaceBetween":' . $spaceBetween . ',"slidesPerView":' . $slidesPerView . ',"loop":' . json_encode($wrapsAround) .
                ',"pagination":{"el": ' . ($usePagination ? '".swiper-pagination"' : 'null') . ' , "type": "' . $paginationType . '"'.($paginationType === 'bullets' ? ', "clickable":true' :'') . '}
                ,' . ($useNavigation ? '"navigation": {"nextEl": ".swiper-button-next", "prevEl": ".swiper-button-prev"},' : '') . '  "keyboard": { "enabled": true },
                "effect": "' . $transition . '"'
                . ($transition === 'fade' ? ',"fadeEffect":{"crossFade": true}' : '')
                . ($transition === 'coverflow' ? ',"coverflowEffect":{"slideShadows":' . json_encode($slideShadows) . ', "rotate": ' . $rotate . ', "stretch": ' . $stretch . ', "depth": ' . $depth . ', "modifier": ' . $modifier . '}' : '')
                . ($transition === 'cube' ? ',"cubeEffect":{"slideShadows":' . json_encode($slideShadows) . ', "shadow":' . json_encode($shadow) . ', "shadowOffset":' . $shadowOffset . ', "shadowScale":' . $shadowScale . '}' : '')
                . ($transition === 'flip' ? ', "flipEffect":{"slideShadows":' . json_encode($slideShadows) . ', "limitRotation": ' . json_encode($limitRotation) . '}' : '')
                . ($autoplays ? ',"autoplay":{"delay": '. ($autoplayDuration * 1000) . '}' : '')
                . (!$isDraggable ? ',"simulateTouch":false' : '') . '}\'>' .
            '<div class="swiper-wrapper">' . $gallery
            . '</div><div class="swiper-pagination"></div>' . ($useNavigation ? '<div class="swiper-button-prev"></div> <div class="swiper-button-next"></div>' : "") .'</div>'.
            ($showThumbnails === true ? '<div class="ub_image_slider_thumbs swiper-container"
            data-swiper-data=\'{"slidesPerView": 4, "freeMode": true, "watchSlidesProgress": true, "watchSlidesVisibility": true}\'><div class="swiper-wrapper">'
            .$thumbs.'</div></div>' : '');
    }
}
