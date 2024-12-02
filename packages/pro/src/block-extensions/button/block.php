<?php

use Ultimate_Blocks_Pro\CSS_Generator;

function ubpro_buttons_parse( $b ) {
    require_once dirname( dirname( __DIR__ ) ) . '/icons.php';

    // Defaults
    $buttonWidth   = 'fixed';
    $url           = '';
    $openInNewTab  = true;
    $addNofollow   = true;
    $addSponsored  = false;
    $size          = 'medium';
    $iconSize      = 0;
    $chosenIcon    = '';
    $buttonText    = 'Button Text';
    $iconUnit      = 'px';
    $imageID       = 0;
    $imageURL      = '';
    $imageAlt      = '';

    extract( $b ); // Should overwrite the values above if they exist in the array

    $link_style = sprintf('border-radius: %1$spx;', $buttonRounded ? '60' : '0');
     $style_vars = [
        '--ub-button-background-color'			=> $buttonIsTransparent ? 'transparent' : esc_attr($buttonColor),
        '--ub-button-color'						=> $buttonIsTransparent ? esc_attr($buttonColor) : esc_attr($buttonTextColor),
        '--ub-button-border'					=> $buttonIsTransparent ? '3px solid ' . esc_attr($buttonColor) : 'none',
        '--ub-button-hover-background-color'	=> $buttonIsTransparent ? '' : esc_attr($buttonHoverColor),
        '--ub-button-hover-color'				=> $buttonIsTransparent ? esc_attr($buttonHoverColor) : esc_attr($buttonTextHoverColor),
        '--ub-button-hover-border'				=> $buttonIsTransparent ? '3px solid ' . esc_attr($buttonHoverColor) : 'none',
    ];
    $link_style .= CSS_generator\generate_css_string($style_vars);

    if (isset($isBorderComponentChanged) && $isBorderComponentChanged) {
		$link_border_radius_styles = [
			'border-top-left-radius' => !empty( $borderRadius['topLeft'] ) ? esc_attr($borderRadius['topLeft']) . ';': "",
			'border-top-right-radius' => !empty( $borderRadius['topRight'] ) ?  esc_attr($borderRadius['topRight']) . ';': "",
			'border-bottom-left-radius' => !empty( $borderRadius['bottomLeft'] ) ?  esc_attr($borderRadius['bottomLeft']) . ';': "",
			'border-bottom-right-radius' => !empty( $borderRadius['bottomRight'] ) ?  esc_attr($borderRadius['bottomRight']) . ';': "",
		];
	} else if ($buttonRounded) {
		if ( array_key_exists( 'topLeftRadius', $b ) && array_key_exists( 'topLeftRadiusUnit', $b ) && array_key_exists( 'topRightRadius', $b ) && array_key_exists( 'topRightRadiusUnit', $b ) && array_key_exists( 'bottomLeftRadius', $b ) && array_key_exists( 'bottomLeftRadiusUnit', $b ) && array_key_exists( 'bottomRightRadius', $b ) && array_key_exists( 'bottomRightRadiusUnit', $b ) ) {
			if ( count( array_unique( [ $b['topLeftRadius'], $b['topRightRadius'], $b['bottomLeftRadius'], $b['bottomRightRadius'] ] ) ) === 1 && count( array_unique( [ $b['topLeftRadiusUnit'], $b['topRightRadiusUnit'], $b['bottomLeftRadiusUnit'], $b['bottomRightRadiusUnit'] ] ) ) === 1 ) {
				$link_border_radius_styles = [
					'border-radius' => $b['topLeftRadius'] . $b['topLeftRadiusUnit']
				];
			} else {
				$link_border_radius_styles = [
					'border-radius' => $b['topLeftRadius'] . $b['topLeftRadiusUnit'] . ' ' . $b['topRightRadius'] . $b['topRightRadiusUnit'] . ' ' . $b['bottomRightRadius'] . $b['bottomRightRadiusUnit'] . ' ' . $b['bottomLeftRadius'] . $b['bottomLeftRadiusUnit']
				];
			}
		} else {
			$link_border_radius_styles = [
				'border-radius' => ( array_key_exists( 'buttonRadius', $b ) && $buttonRadius ? $buttonRadius : '60' ) . ( array_key_exists( 'buttonRadiusUnit', $b ) && $buttonRadiusUnit ? $buttonRadiusUnit : 'px' )
			];
		}
	} else {
		$link_border_radius_styles = [
			'border-radius' => '0'
		];
	}

	$link_style .= CSS_generator\generate_css_string($link_border_radius_styles);

    $iconType = $chosenIcon !== '' ? 'preset' : 'none';

    $presetIconSize = array(
        'small'  => 25,
        'medium' => 30,
        'large'  => 35,
        'larger' => 40,
    );

    return sprintf(
        '<div class="ub-button-container%s" >
            <a href="%2$s" style="%11$s" target="%3$s" rel="noopener noreferrer%4$s%5$s" class="ub-button-block-main ub-button-%6$s%7$s%8$s" role="button">
            <div class="ub-button-content-holder" style="flex-direction: %12$s;">%9$s<span class="ub-button-block-btn">%10$s</span>
            </div>
            </a>
        </div>',
        ( $buttonWidth === 'full' ? ' ub-button-full-container' : '' ), // 1
        esc_url( $url ), // 2
        ( $openInNewTab ? '_blank' : '_self' ), // 3
        ( $addNofollow ? ' nofollow' : '' ), // 4
        ( $addSponsored ? ' sponsored' : '' ), // 5
        $size, // 6
        ( $buttonWidth === 'full' ? ' ub-button-full-width' : ( $buttonWidth === 'flex' ? ' ub-button-flex-' . $size : '' ) ), // 7
        ( isset( $animation ) && $animation === 'wipe' ? ' ub-button-wipe-' . $wipeDirection : '' ), // 8
        ( $iconType === 'custom' ? ( $imageID > 0 ? '<img class="ub-button-image" src=' . $imageURL . '>' : '' ) : ( $iconType === 'preset' ? ( ( $chosenIcon !== '' && ! is_null( $chosenIcon ) ) ? '<span class="ub-button-icon-holder"><svg xmlns="http://www.w3.org/2000/svg" height="' . ( $iconSize ?: $presetIconSize[ $size ] ) . ( $iconUnit === 'em' ? 'em' : '' ) . '", width="' . ( $iconSize ?: $presetIconSize[ $size ] ) . ( $iconUnit === 'em' ? 'em' : '' ) . '" viewBox="0, 0, ' . Ultimate_Blocks_IconSet::generate_fontawesome_icon( $chosenIcon )[0] . ', ' . Ultimate_Blocks_IconSet::generate_fontawesome_icon( $chosenIcon )[1] . '"><path fill="currentColor" d="' . Ultimate_Blocks_IconSet::generate_fontawesome_icon( $chosenIcon )[2] . '"></svg></span>' : '' ) : '' ) ), // 9
        $buttonText, // 10
        esc_attr($link_style), // 11
		$iconPosition === 'left' ? 'row' : 'row-reverse' //12
    );
}

function ubpro_button_filter( $block_content, $block ) {
    if ( 'ub/button' != $block['blockName'] ) {
        return $block_content;
    } else {
        require dirname( dirname( __DIR__ ) ) . '/defaults.php';

        foreach ( $defaultValues['ub/button']['attributes'] as $key => $value ) {
            if ( ! isset( $block['attrs'][ $key ] ) ) {
                $block['attrs'][ $key ] = $value['default'];
            }
        }

        extract( $block['attrs'] );

        require_once dirname( dirname( __DIR__ ) ) . '/icons.php';

        $iconSize = array(
            'small'  => 25,
            'medium' => 30,
            'large'  => 35,
            'larger' => 40,
        );
        $padding = CSS_generator\get_spacing_css( isset($block['attrs']['padding']) ? $block['attrs']['padding'] : array() );
	    $margin  = CSS_generator\get_spacing_css( isset($block['attrs']['margin']) ? $block['attrs']['margin'] : array() );
        $spacing = !CSS_generator\is_undefined( $block['attrs']['blockSpacing'] ) ?
			CSS_generator\spacing_preset_css_var($block['attrs']['blockSpacing']['all']) :
			'20px';

        $wrapper_padding = array(
            'padding-top'        => isset($padding['top']) ? $padding['top'] : "",
            'padding-left'       => isset($padding['left']) ? $padding['left'] : "",
            'padding-right'      => isset($padding['right']) ? $padding['right'] : "",
            'padding-bottom'     => isset($padding['bottom']) ? $padding['bottom'] : "",
            'margin-top'         => !empty($margin['top']) ? $margin['top']  : "",
            'margin-left'        => !empty($margin['left']) ? $margin['left']  : "",
            'margin-right'       => !empty($margin['right']) ? $margin['right']  : "",
            'margin-bottom'      => !empty($margin['bottom']) ? $margin['bottom']  : "",
            'gap'                => $spacing,
        );
        foreach ($buttons as $key => &$b) {
			$b['isBorderComponentChanged'] = $isBorderComponentChanged;
		}
        $wrapper_styles = CSS_generator\generate_css_string($wrapper_padding);
        $buttonDisplay = ( ! isset( $buttons ) || count( $buttons ) === 0 ? sprintf(
            '<div class="ub-button-container align-button-%1$s%2$s"%3$s>
                <a href="%4$s" target="%5$s" rel="noopener noreferrer%6$s" class="ub-button-block-main ub-button-%7$s%8$s">
                    <div class="ub-button-content-holder">%9$s<span class="ub-button-block-btn">%10$s</span>
                    </div>
                </a>
            </div>',
            $align, // 1
            ( isset( $className ) ? ' ' . esc_attr( $className ) : '' ), // 2
            ( ! isset( $blockID ) || $blockID === '' ? ' ' : ' id="ub-button-' . $blockID . '"' ), // 3
            esc_url( $url ), // 4
            ( $openInNewTab ? '_blank' : '_self' ), // 5
            ( $addNofollow ? ' nofollow' : '' ), // 6
            $size, // 7
            ( $buttonWidth === 'full' ? ' ub-button-full-width' : ( $buttonWidth === 'flex' ? ' ub-button-flex-' . $size : '' ) ), // 8
            ( $chosenIcon !== '' ? '<span class="ub-button-icon-holder"><svg xmlns="http://www.w3.org/2000/svg" height="' . $iconSize[ $size ] . '" width="' . $iconSize[ $size ] . '" viewBox="0, 0, ' . Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon( $chosenIcon )[0] . ', ' . Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon( $chosenIcon )[1] . '"><path fill="currentColor" d="' . Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon( $chosenIcon )[2] . '"></svg></span>' : '' ), // 9
            $buttonText // 10
        ) : join( '', array_map( 'ubpro_buttons_parse', $buttons ) ) );

        return sprintf(
            '<div class="wp-block-ub-button %1$s%2$s orientation-button-%3$s%4$s%5$s" %6$s style="%8$s">%7$s</div>',
            ( isset( $buttons ) && count( $buttons ) > 0 ? 'ub-buttons' : 'ub-button' ), // 1
            ( isset( $buttons ) && count( $buttons ) > 0 ? ' align-button-' . ( $align === '' ? 'center' : $align ) : '' ), // 2
            $orientation, // 3
            ( $isFlexWrap ? ' ub-flex-wrap' : '' ), // 4
            ( isset( $className ) ? ' ' . esc_attr( $className ) : '' ), // 5
            ( ! isset( $blockID ) || $blockID === '' ? ' ' : ' id="ub-button-' . $blockID . '"' ), // 6
            $buttonDisplay, // 7
            esc_attr( $wrapper_styles ) // 8
        );
    }
}
