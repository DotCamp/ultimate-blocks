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

        extract($block['attrs']);
        $block_attrs = $block['attrs'];
        $margin 			 	= Ultimate_Blocks\includes\get_spacing_css( isset($block_attrs['margin']) ? $block_attrs['margin'] : array() );
        $padding 			 	= Ultimate_Blocks\includes\get_spacing_css( isset($block_attrs['padding']) ? $block_attrs['padding'] : array() );

        $navigationColor = isset($block_attrs['navigationColor']) ? $block_attrs['navigationColor'] : '';
        $activePaginationColor = isset($block_attrs['activePaginationColor']) ? $block_attrs['activePaginationColor'] : '';
        $paginationColor = isset($block_attrs['paginationColor']) ? $block_attrs['paginationColor'] : '';

        $image_slider_wrapper_styles = array(
            '--swiper-navigation-color'				=> $navigationColor,
            '--swiper-pagination-color'				=> $activePaginationColor,
            '--swiper-inactive-pagination-color'	=> $paginationColor,
            '--swiper-navigation-background-color'	=> CSS_Generator\get_background_color_var($block_attrs, 'navigationBackgroundColor', 'navigationGradientColor'),
            'padding-top'           			 	=> isset($padding['top']) ? $padding['top'] : "",
            'padding-left'          			 	=> isset($padding['left']) ? $padding['left'] : "",
            'padding-right'         			 	=> isset($padding['right']) ? $padding['right'] : "",
            'padding-bottom'        			 	=> isset($padding['bottom']) ? $padding['bottom'] : "",
            'margin-top'            			 	=> isset($margin['top']) ? $margin['top']  : "",
            'margin-right'          			 	=> isset($margin['left']) ? $margin['left']  : "",
            'margin-bottom'         			 	=> isset($margin['right']) ? $margin['right']  : "",
            'margin-left'           			 	=> isset($margin['bottom']) ? $margin['bottom']  : "",
            'min-height' 							=> (35 + $sliderHeight) . 'px;',
        );

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

        $wrapper_attributes = get_block_wrapper_attributes(
            array(
                'class' => implode(' ', $classes),
                'style' => CSS_Generator\generate_css_string($image_slider_wrapper_styles)
            )
        );
        return sprintf(
            '<div %1$s %2$s data-swiper-data=\'{"speed":%3$d,"spaceBetween":%4$d,"slidesPerView":%5$d,"loop":%6$s,"pagination":{"el": %7$s , "type": "%8$s"%9$s},%10$s"keyboard": { "enabled": true },"effect": "%11$s"%12$s%13$s%14$s%15$s%16$s%17$s}\'>
            <div class="swiper-wrapper">%18$s</div><div class="swiper-pagination"></div>%19$s</div>%20$s',
            $wrapper_attributes,
            ($blockID === '' ? 'style="min-height: ' . (25 + (count($imageArray) > 0 ? $sliderHeight : 200)) . 'px;"' : 'id="ub_image_slider_' . $blockID . '"'),
            $speed,
            $spaceBetween,
            $slidesPerView,
            json_encode($wrapsAround),
            ($usePagination ? '".swiper-pagination"' : 'null'),
            $paginationType,
            ($paginationType === 'bullets' ? ', "clickable":true' : ''),
            ($useNavigation ? '"navigation": {"nextEl": ".swiper-button-next", "prevEl": ".swiper-button-prev"},' : ''),
            $transition,
            ($transition === 'fade' ? ',"fadeEffect":{"crossFade": true}' : ''),
            ($transition === 'coverflow' ? ',"coverflowEffect":{"slideShadows":' . json_encode($slideShadows) . ', "rotate": ' . $rotate . ', "stretch": ' . $stretch . ', "depth": ' . $depth . ', "modifier": ' . $modifier . '}' : ''),
            ($transition === 'cube' ? ',"cubeEffect":{"slideShadows":' . json_encode($slideShadows) . ', "shadow":' . json_encode($shadow) . ', "shadowOffset":' . $shadowOffset . ', "shadowScale":' . $shadowScale . '}' : ''),
            ($transition === 'flip' ? ', "flipEffect":{"slideShadows":' . json_encode($slideShadows) . ', "limitRotation": ' . json_encode($limitRotation) . '}' : ''),
            ($autoplays ? ',"autoplay":{"delay": '. ($autoplayDuration * 1000) . '}' : ''),
            (!$isDraggable ? ',"simulateTouch":false' : ''),
            $gallery,
            ($useNavigation ? '<div class="swiper-button-prev"></div> <div class="swiper-button-next"></div>' : ""),
            ($showThumbnails === true ? '<div class="ub_image_slider_thumbs swiper-container" data-swiper-data=\'{"slidesPerView": 4, "freeMode": true, "watchSlidesProgress": true, "watchSlidesVisibility": true}\'><div class="swiper-wrapper">' . $thumbs . '</div></div>' : '')
        );
    }
}