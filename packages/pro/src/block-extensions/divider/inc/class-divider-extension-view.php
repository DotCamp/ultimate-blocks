<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Divider\Inc;

use Ultimate_Blocks;
use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Block_Extension_View;
use Ultimate_Blocks_Pro as NS;
use Ultimate_Blocks_Pro\Ultimate_Blocks_Pro;
use Ultimate_Blocks_Pro_IconSet;
use function esc_attr;

/**
 * Extension view for divider block.
 */
class Divider_Extension_View implements I_Block_Extension_View {

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
		require_once( trailingslashit( NS\ULTIMATE_BLOCKS_PRO_DIR ) . 'src/icons.php' );

		extract( $attributes );

		$block_attrs 		= $block->parsed_block['attrs'];
		$is_horizontal 	= $orientation === 'horizontal';
		$className     	= isset( $className ) ? esc_attr( $className ) : '';
		$border_size   	= esc_attr( $borderSize . 'px' );
		$border_height 	= $is_horizontal ? esc_attr( $borderHeight . 'px' ) : esc_attr( $lineHeight );
		$border_color  	= esc_attr( $borderColor );
		$border_style  	= esc_attr( $borderStyle );
		$alignment     	= esc_attr( $alignment );
		$divider_width      = isset($attributes['isWidthControlChanged']) && $attributes['isWidthControlChanged'] && isset($attributes['dividerWidth']) ? esc_attr($attributes['dividerWidth']) : esc_attr($attributes['width'] . '%');
		$line_width    	= $is_horizontal ? $divider_width : $border_size;
		$horizontal_spacing = $is_horizontal ? "margin-top: $border_height; margin-bottom: $border_height;" : ""; 
		$border_name 	  	= $is_horizontal ? 'border-top' : 'border-left';
		$divider_style 	= $is_horizontal ? '' : 'height:100%;';
		$align 			= isset($align) ? ' align' . $align : '';
		$generated_icon 	= '';

		$margin 			 	= NS\CSS_Generator\get_spacing_css( isset($block_attrs['margin']) ? $block_attrs['margin'] : array() );
        	$padding 			 	= NS\CSS_Generator\get_spacing_css( isset($block_attrs['padding']) ? $block_attrs['padding'] : array() );

		$divider_styles = array(
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
		$divider_styles_string = NS\CSS_Generator\generate_css_string($divider_styles);

		// need to check for both values for compatibility with older versions of plugin
		if ( ! is_null( $icon ) && $icon !== '' ) {
			$icon_styles = array(
				'background-color' => $iconBackgroundColor
			);
            	$block_spacing_value = NS\CSS_Generator\spacing_preset_css_var(isset($block_attrs['iconSpacing']['all']) ? $block_attrs['iconSpacing']['all'] : '');
			if(!empty($block_spacing_value)){
				$icon_styles['padding-left'] = $block_spacing_value;
				$icon_styles['padding-right'] = $block_spacing_value;
			}
			$icon_styles_string = NS\CSS_Generator\generate_css_string($icon_styles);
			$icon_size       = esc_attr( $iconSize );
			$icon_raw        = Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon( $icon );
			$icon_raw_width  = $icon_raw[0];
			$icon_raw_height = $icon_raw[1];
			$icon_raw_html   = $icon_raw[2];
			$icon_alignment  = esc_attr( $iconAlignment );
			$generated_icon = <<<ICON_RENDER
<div class="ub_divider_icon" data-icon-alignment="$icon_alignment" style="$horizontal_spacing $icon_styles_string">
	<svg xmlns="http://www.w3.org/2000/svg" height="$icon_size" width="$icon_size" viewBox="0, 0, $icon_raw_width, $icon_raw_height">
		<path fill="$border_color" d="$icon_raw_html">
	</svg>
</div>

ICON_RENDER;
		}

		return <<<RENDER
<div id="ub_divider_$blockID" data-divider-alignment="$alignment" class="ub_divider wp-block-ub-divider ub-divider ub-divider-orientation-$orientation$align" style="width: $line_width; height: $border_height; $divider_styles_string">
	<div class="ub_divider_line $className" 
	style="$border_name: $border_size $border_style $border_color; $horizontal_spacing $divider_style">
	</div>
	$generated_icon
</div>
RENDER;
	}
}
