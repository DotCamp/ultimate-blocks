<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Expand\Inc\Views;

use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Block_Extension_View;
use Ultimate_Blocks_Pro;

/**
 * Extension view for expand block.
 */
class Expand_Extension_View implements I_Block_Extension_View {
	/**
	 * Render block extension.
	 *
	 * @param String $block_content the block content about to be appended
	 * @param array $attributes block attributed including both base and extension
	 * @param $block
	 *
	 * @return string | null HTML string of render
	 */
	public static function render( $block_content, $attributes, $block ) {
		extract( $attributes );
		 $buttonBorderVariables = Ultimate_Blocks_Pro\CSS_Generator\get_border_variables_css(
               isset($attributes['expandButtonBorder']) ? $attributes['expandButtonBorder'] : array(),
               "expand-button"
          );
          $buttonPaddingObj = Ultimate_Blocks_Pro\CSS_Generator\get_spacing_css(isset($attributes['expandButtonPadding']) ? $attributes['expandButtonPadding'] : array());

          $buttonBorderRadius = array(
               "--ub-expand-button-top-left-radius" => isset($attributes['expandButtonBorderRadius']['topLeft']) ? $attributes['expandButtonBorderRadius']['topLeft'] : "",
               "--ub-expand-button-top-right-radius" => isset($attributes['expandButtonBorderRadius']['topRight']) ? $attributes['expandButtonBorderRadius']['topRight'] : "",
               "--ub-expand-button-bottom-left-radius" => isset($attributes['expandButtonBorderRadius']['bottomLeft']) ? $attributes['expandButtonBorderRadius']['bottomLeft'] : "",
               "--ub-expand-button-bottom-right-radius" => isset($attributes['expandButtonBorderRadius']['bottomRight']) ? $attributes['expandButtonBorderRadius']['bottomRight'] : "",
          );

          $styles = array(
               "--ub-expand-button-color" => isset($attributes['expandButtonColor']) ? $attributes['expandButtonColor'] : "",
               "--ub-expand-button-bg-color" => !empty($attributes['expandButtonBgColor']) ? $attributes['expandButtonBgColor'] : '',
               "--ub-expand-button-padding-top" => isset($buttonPaddingObj['top']) ? $buttonPaddingObj['top'] : "",
               "--ub-expand-button-padding-right" => isset($buttonPaddingObj['right']) ? $buttonPaddingObj['right'] : "",
               "--ub-expand-button-padding-bottom" => isset($buttonPaddingObj['bottom']) ? $buttonPaddingObj['bottom'] : "",
               "--ub-expand-button-padding-left" => isset($buttonPaddingObj['left']) ? $buttonPaddingObj['left'] : "",
          );

          $styles = array_merge($styles, $buttonBorderRadius, $buttonBorderVariables);

          $styles_string =  Ultimate_Blocks_Pro\CSS_Generator\generate_css_string( $styles );

		$block_content = Ultimate_Blocks_Pro\Inc\Utils\Html_Utils::append_attr_value($block_content,'div',$styles_string,'style');

		return $block_content;
	}
}
