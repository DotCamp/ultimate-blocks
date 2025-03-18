<?php

use function Ultimate_Blocks\includes\is_undefined;

/**
 * Handle Responsive control frontend.
 */
class Ultimate_Blocks_Responsive_Control  {
    public function __construct(){
        add_filter( "render_block", array( $this, 'ub_render_responsive_control' ), 10, 2 );
    }


    public function ub_render_responsive_control($content, $block){
        // Check if the block name starts with 'ub/'
        $block_name = isset($block['blockName']) ? $block['blockName'] : "";
        if (strpos($block_name, 'ub/') !== 0) {
            return $content;
        }

        $attributes = isset($block['attrs']) ? $block['attrs'] : array();
        // Prepare classes based on attributes
        $classes = array();

        if (isset($attributes['isHideOnMobile']) && $attributes['isHideOnMobile']) {
            $classes[] = 'ub-hide-on-mobile';
        }
        if (isset($attributes['isHideOnTablet']) && $attributes['isHideOnTablet']) {
            $classes[] = 'ub-hide-on-tablet';
        }
        if (isset($attributes['isHideOnDesktop']) && $attributes['isHideOnDesktop']) {
            $classes[] = 'ub-hide-on-desktop';
        }

        // Remove empty classes
        $classes = array_filter($classes);
        // Find the first occurrence of the class attribute in the HTML content
        $dom = new DOMDocument();
		libxml_use_internal_errors(true); // Suppress warnings for malformed HTML
		$dom->loadHTML($content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
		libxml_clear_errors();

		$xpath = new DOMXPath($dom);
		$element = $xpath->query('//*[@class]')->item(0); // Select the first element with a class attribute

		if ($element) {
			$existing_classes = explode(' ', esc_attr($element->getAttribute('class')));
			$new_classes = array_unique(array_merge($existing_classes, $classes));
			$element->setAttribute('class', implode(' ', $new_classes));
		}

		return $dom->saveHTML();
    }
}
new Ultimate_Blocks_Responsive_Control();
