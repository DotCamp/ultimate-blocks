<?php

namespace Ultimate_Blocks_Pro\Src\Blocks\Timeline\Timeline_Item;
use Ultimate_Blocks_Pro\CSS_Generator;

use Ultimate_Blocks_Pro as NS;

/**
 * Coupon block.
 */
class Timeline_Item_Block {

	/**
      * Constructor
      * 
      * @return void
      */
      public function __construct(){
          $this->register_logic();
     }
	/**
	 * SVG Component function in PHP.
	 *
	 * @param array $icon - The icon data.
	 * @return string Rendered SVG markup.
	 */
	public function svg_component( $icon ) {
		// Set default values for viewBox and xmlns
		$defaultViewBox = '0 0 24 24';
		$defaultXmlns = 'http://www.w3.org/2000/svg';

		// Check if the necessary properties are set and not empty
		$viewBox = isset($icon['icon']['props']['viewBox']) && !empty($icon['icon']['props']['viewBox']) ? $icon['icon']['props']['viewBox'] : $defaultViewBox;
		$xmlns = isset($icon['icon']['props']['xmlns']) && !empty($icon['icon']['props']['xmlns']) ? $icon['icon']['props']['xmlns'] : $defaultXmlns;
		$pathData = isset($icon['icon']['props']['children']['props']['d']) ? $icon['icon']['props']['children']['props']['d'] : '';

		// Check if any of the required values is undefined or empty
		if (empty($pathData)) {
			return ''; // Return an empty string or handle the error as needed
		}

		// Build the SVG markup.
		$svgMarkup = sprintf(
			'<svg class="ub-timeline-item-connector-icon" viewBox="%s" xmlns="%s">
				<path d="%s" />
			</svg>',
			$viewBox,
			$xmlns,
			$pathData
		);

		return $svgMarkup;
	}
     /**
	 * Get styles function in PHP.
	 *
	 * @param array $attributes - attributes array.
	 * @return array CSS styles for the block.
	 */
	public function get_styles( $attributes ) {
		$timelineContentBorder = CSS_Generator\get_border_variables_css(
			$attributes['contentBorder'],
			'timeline-item-content'
		);

		$paddingObj = CSS_Generator\get_spacing_css( $attributes['contentPadding'] );

		$borderRadius = array(
			"--ub-timeline-item-content-top-left-radius" => !empty($attributes['contentBorderRadius']['topLeft']) ? $attributes['contentBorderRadius']['topLeft'] : "",
			"--ub-timeline-item-content-top-right-radius" => !empty($attributes['contentBorderRadius']['topRight']) ? $attributes['contentBorderRadius']['topRight'] : "",
			"--ub-timeline-item-content-bottom-left-radius" => !empty($attributes['contentBorderRadius']['bottomLeft']) ? $attributes['contentBorderRadius']['bottomLeft'] : "",
			"--ub-timeline-item-content-bottom-right-radius" => !empty($attributes['contentBorderRadius']['bottomRight']) ? $attributes['contentBorderRadius']['bottomRight'] : "",
		);

		$styles = array(
			"--ub-timeline-item-content-background-color" => ! empty( $attributes['contentBackground'] ) ? $attributes['contentBackground'] : $attributes['contentGradient'],
			"--ub-timeline-item-content-color" => $attributes['contentColor'],
			"--ub-timeline-item-content-padding-top" => $paddingObj['top'],
			"--ub-timeline-item-content-padding-right" => $paddingObj['right'],
			"--ub-timeline-item-content-padding-bottom" => $paddingObj['bottom'],
			"--ub-timeline-item-content-padding-left" => $paddingObj['left'],
		);

		$styles = array_merge( $styles, $timelineContentBorder, $borderRadius );

		// Filter out undefined, false, empty, and 'undefined undefined undefined' values.
		$styles = CSS_Generator\generate_css_string($styles);

		return $styles;
	}
     public function ub_render_timeline_item_block($attributes, $content, $block_instance){
		$timeline_type  = isset($attributes['timelineType']) ? $attributes['timelineType'] : "vertical";

		$classes = array( 'ub-timeline-item' );
		if('horizontal' === $timeline_type){
			array_push($classes, 'swiper-slide');
		}
          $wrapper_attributes = get_block_wrapper_attributes( array(
               'class' => implode(' ', $classes),
               'style' => $this->get_styles($attributes)
          ));
		$context = isset($block_instance->context) ? $block_instance->context : array(); 
		$show_opposite_text = isset($context['showOppositeText']) ? $context['showOppositeText'] : false;
		$opposite_text = $show_opposite_text ?  '<p class="ub-timeline-item-opposite-text">' . wp_kses_post($attributes['oppositeText'])  . '</p>' : "";

		$icon_connector = isset($context['iconConnector']) ? $context['iconConnector'] : false;
		$icon = isset($context['icon']) ? $context['icon'] : false;

		$vertical_timeline_item = sprintf(
               '<div %2$s>
                    <div class="ub-timeline-item-connector">
					%4$s
					%3$s
				</div>
                    <div class="ub-timeline-item-content">%1$s</div>
               </div>',
               $content,
               $wrapper_attributes,
			$opposite_text,
			$icon_connector ? $this->svg_component($icon) : ""
          );
		$horizontal_timeline_item = sprintf(
               '<div %2$s>
				<div class="ub-timeline-item-connector">
					%4$s
					%3$s
				</div>
				<div class="ub-timeline-item-content">%1$s</div>   
               </div>',
               $content,
               $wrapper_attributes,
			$opposite_text,
			$icon_connector ? $this->svg_component($icon) : ""
          );
          return 'vertical' === $timeline_type ? $vertical_timeline_item : $horizontal_timeline_item;
     }

	/**
	 * Main registration logic for the pro block.
	 *
	 * @return void
	 */
	public function register_logic() {
        require dirname(dirname(dirname(__DIR__))) . '/defaults.php';
		register_block_type_from_metadata(
			NS\ULTIMATE_BLOCKS_PRO_DIR . 'inc/blocks/timeline/timeline-item/block.json', array(
                    'attributes'      => $defaultValues['ub/timeline-item']['attributes'],
                    'render_callback' => array( $this, 'ub_render_timeline_item_block')
               )
		);
	}
}
