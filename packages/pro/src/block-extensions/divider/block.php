<?php


use Ultimate_Blocks_Pro as NS;
use Ultimate_Blocks_Pro_IconSet;
use function esc_attr;

function ubpro_render_divider_block( $_, $attributes, $block){
    require_once( trailingslashit( NS\ULTIMATE_BLOCKS_PRO_DIR ) . 'src/icons.php' );

		extract( $attributes );

		$block_attrs 		= $block->parsed_block['attrs'];

		$is_horizontal 	= $orientation === 'horizontal';
		$className     	= isset( $className ) ? esc_attr( $className ) : '';
		$border_height 	= $is_horizontal ? esc_attr( $borderHeight . 'px' ) : esc_attr( $lineHeight );
		$border_color  	= esc_attr( $borderColor );
		$horizontal_spacing = $is_horizontal ? "margin-top: $border_height; margin-bottom: $border_height;" : ""; 
		$align 			= isset($align) ? ' align' . $align : '';

		// need to check for both values for compatibility with older versions of plugin
		if ( isset( $icon ) && $icon !== '' ) {
			$icon_styles = array(
				'background-color' => $iconBackgroundColor
			);
            	$block_spacing_value = NS\CSS_Generator\spacing_preset_css_var(isset($block_attrs['iconSpacing']['all']) ? $block_attrs['iconSpacing']['all'] : '');
			if(!empty($block_spacing_value)){
                if(!$is_horizontal){
                    $icon_styles['padding-top'] = $block_spacing_value;
                    $icon_styles['padding-bottom'] = $block_spacing_value;
                }else{
                    $icon_styles['padding-left'] = $block_spacing_value;
                    $icon_styles['padding-right'] = $block_spacing_value;
                }
			}
			$icon_styles_string = NS\CSS_Generator\generate_css_string($icon_styles);
			$icon_size       = esc_attr( isset($block_attrs['iconSize']) ? $block_attrs['iconSize'] : 30 );
			$icon_raw        = Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon( $icon );
			$icon_raw_width  = $icon_raw[0];
			$icon_raw_height = $icon_raw[1];
			$icon_raw_html   = $icon_raw[2];
			$icon_alignment  = esc_attr( isset($block_attrs['iconAlignment']) ? $block_attrs['iconAlignment'] : 'center'  );
			return <<<ICON_RENDER
<div class="ub_divider_icon" data-icon-alignment="$icon_alignment" style="$horizontal_spacing $icon_styles_string">
	<svg xmlns="http://www.w3.org/2000/svg" height="$icon_size" width="$icon_size" viewBox="0, 0, $icon_raw_width, $icon_raw_height">
		<path fill="$border_color" d="$icon_raw_html">
	</svg>
</div>

ICON_RENDER;
		}
}