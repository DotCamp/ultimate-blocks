<?php

namespace Ultimate_Blocks_Pro\Src\Blocks\Timeline;

use Ultimate_Blocks_Pro\CSS_Generator;
use Ultimate_Blocks_Pro\Src\Blocks\Timeline\Timeline_Item\Timeline_Item_Block;
use Ultimate_Blocks_Pro\Inc\Common\Base\Pro_Block;
use Ultimate_Blocks_Pro as NS;
use function esc_html__;

/**
 * Coupon block.
 */
class Timeline_Block extends Pro_Block {

	/**
	 * Get styles function in PHP.
	 *
	 * @param array $attributes - attributes array.
	 * @return array CSS styles for the block.
	 */
	public function get_styles( $attributes ) {
		$timelineContentBorder = CSS_Generator\get_border_variables_css(
			$attributes['contentBorder'],
			'timeline-items-content'
		);

		$paddingObj = CSS_Generator\get_spacing_css( $attributes['contentPadding'] );

		$borderRadius = array(
			"--ub-timeline-items-content-top-left-radius" => !empty( $attributes['contentBorderRadius']['topLeft'] ) ? $attributes['contentBorderRadius']['topLeft'] : "",
			"--ub-timeline-items-content-top-right-radius" => !empty( $attributes['contentBorderRadius']['topRight'] ) ? $attributes['contentBorderRadius']['topRight'] : "",
			"--ub-timeline-items-content-bottom-left-radius" => !empty( $attributes['contentBorderRadius']['bottomLeft'] ) ? $attributes['contentBorderRadius']['bottomLeft'] : "",
			"--ub-timeline-items-content-bottom-right-radius" => !empty( $attributes['contentBorderRadius']['bottomRight'] ) ? $attributes['contentBorderRadius']['bottomRight'] : "",
		);

		$styles = array(
			"--ub-timeline-items-content-background-color" => ! empty( $attributes['contentBackground'] ) ? $attributes['contentBackground'] : $attributes['contentGradient'],
			"--ub-timeline-items-content-color" => $attributes['contentColor'],
			"--swiper-navigation-color" => $attributes['arrowColor'],
			"--ub-timeline-connector-color" => $attributes['connectorColor'],
			"--ub-timeline-opposite-text-color" => $attributes['oppositeTextColor'],
			"--ub-timeline-progress-line-color" => $attributes['progressLineColor'],
			"--ub-timeline-connector-background-color" => $attributes['connectorBackground'],
			"--ub-timeline-tree-color" => $attributes['lineColor'],
			"--ub-timeline-items-content-padding-top" => $paddingObj['top'],
			"--ub-timeline-items-content-padding-right" => $paddingObj['right'],
			"--ub-timeline-items-content-padding-bottom" => $paddingObj['bottom'],
			"--ub-timeline-items-content-padding-left" => $paddingObj['left'],
			"--ub-timeline-items-connector-size" => $attributes['connectorSize'] . "px",
			"--ub-timeline-items-connector-icon-color" => $attributes['connectorIconColor'],
			"--ub-timeline-items-connector-icon-size" => $attributes['connectorIconSize'] . 'px',
			"--swiper-navigation-sides-offset" => "-3px",
            "--swiper-navigation-top-offset" => "40px",
		);

		$styles = array_merge( $styles, $timelineContentBorder, $borderRadius );

		// Filter out undefined, false, empty, and 'undefined undefined undefined' values.
		$styles = CSS_Generator\generate_css_string($styles);

		return $styles;
	}
     public function ub_render_timeline_block( $attributes, $content ){
		extract($attributes);
		$timeline_type  		= isset($timelineType)  ? $timelineType : "vertical";
		$items_per_view 		= isset($itemsPerView)  ? $itemsPerView : '2';
		$show_arrow 	 		= isset($showArrow) 	?  $showArrow 	 : 'true';
		$enable_dragging 		= isset($enableDragging)	? $enableDragging	 : true;

		$classes = array(
			'ub-timeline-frontend',
			'ub-timeline-wrapper',
			sprintf('ub-timeline-items-align-%s', $timelineAlignment),
			sprintf('ub-timeline-items-starts-from-%s', $timelineItemStartsFrom),
			sprintf('ub-timeline-items-connector-position-%s', $connectorPosition),
		);
		if($showOppositeText){
			array_push($classes,'ub-timeline-show-opposite-text');
		}
		if($showTimelineProgress){
			array_push($classes, 'ub-timeline-show-progress');
		}
		if($numberedConnector){
			array_push($classes, 'ub-timeline-items-numbered-connectors');
		}
		if($showConnectors){
			array_push($classes, 'ub-timeline-items-show-connectors');
		}
		if(('vertical' === $timeline_type) || !isset($timelineType)){
			array_push($classes, 'ub-timeline-vertical');
		}
		if('horizontal' === $timeline_type){
			array_push($classes, 'ub-timeline-horizontal');
			array_push($classes, 'swiper');
		}
		// Remove empty classes
		$classes = array_filter($classes);

		$wrapper_attributes = get_block_wrapper_attributes( array(
            'class' 			=> implode(' ',$classes),
            'style' 			=> $this->get_styles($attributes),
            'data-items_per_view' 	=> $items_per_view,
            'data-show_arrow'		=> $show_arrow === false ? "false" : "true",
            'data-enable_dragging'	=> $enable_dragging === false ? "false" : "true",
        ));
		$timeline_progress = $showTimelineProgress ? '<div class="ub-timeline-tree-progress"></div>' : '' ;
		$horizontal_timeline_arrow = '<div class="swiper-button-prev"></div>
				<div class="swiper-button-next"></div>';
          $vertical_timeline = sprintf(
               '<div %2$s>
                    <div class="ub-timeline-tree">%3$s</div>
                    %1$s
               </div>',
               $content,
               $wrapper_attributes,
			$timeline_progress
          );
		$horizontal_timeline = sprintf(
			'<div %2$s>
				<div class="ub-timeline-tree">%3$s</div>
				<div class="swiper-wrapper">
					%1$s
				</div>
				%4$s
			</div>',
			$content,
			$wrapper_attributes,
			$timeline_progress,
			$show_arrow ? $horizontal_timeline_arrow : ""
		);
		return 'vertical' === $timeline_type ? $vertical_timeline : $horizontal_timeline; 
     }

	/**
	 * Main registration logic for the pro block.
	 *
	 * @return void
	 */
	protected function register_logic() {
     	require dirname(dirname(__DIR__)) . '/defaults.php';
		new Timeline_Item_Block();
		register_block_type_from_metadata(
			NS\ULTIMATE_BLOCKS_PRO_DIR . 'inc/blocks/timeline/block.json', array(
                    'attributes'      => $defaultValues['ub/timeline']['attributes'],
                    'render_callback' => array( $this, 'ub_render_timeline_block')
               )
		);
		wp_register_script(
			'ub-timeline-frontend-script',
			plugins_url( 'timeline/front.js', dirname( __FILE__ ) ),
			array(),
			uniqid(),
			false
		);
	}

	/**
	 * Get block name.
	 * @return string block name
	 */
	public function get_block_name() {
		return 'ub/timeline';
	}

	/**
	 * Short description for the pro block.
	 * @return string block description
	 */
	public function get_block_description() {
		return esc_html__('Effortlessly create and customize interactive timelines to showcase your story or project milestones.');
	}
}
