<?php

function ubpro_buttons_parse($b){
    require_once dirname(dirname(__DIR__)) . '/icons.php';

    //defaults
    $buttonWidth = 'fixed' ;
    $url = '';
    $openInNewTab = true;
    $addNofollow = true;
    $addSponsored = false;
    $size = 'medium';
    $iconSize = 0;
    $chosenIcon = '';
    $buttonText = 'Button Text';
    $iconUnit = 'px';
    $imageID = 0;
	$imageURL = '';
	$imageAlt = '';


    extract($b); //should overwrite the values above if they exist in the array

	$iconType = $chosenIcon !== '' ? 'preset' : 'none';

    $presetIconSize = array('small' => 25, 'medium' => 30, 'large' => 35, 'larger' => 40);

    return '<div class="ub-button-container' . ($buttonWidth === 'full' ? ' ub-button-full-container' : '') . '">
    <a href="' . esc_url($url) . '" target="' . ($openInNewTab ? '_blank' : '_self') . '"
    rel="noopener noreferrer' . ($addNofollow ? ' nofollow' : '') . ($addSponsored ? ' sponsored' : '') . '"
    class="ub-button-block-main ub-button-' . $size .
    ($buttonWidth === 'full' ? ' ub-button-full-width' :
        ($buttonWidth === 'flex' ? ' ub-button-flex-'. $size : '')) . (isset($animation) && $animation === 'wipe' ?  (' ub-button-wipe-' . $wipeDirection  ) :'') . '" role="button">
    <div class="ub-button-content-holder">'.
        ($iconType === 'custom' ?
            ($imageID > 0 ? '<img class="ub-button-image" src=' . $imageURL . '>' : '') :
            ($iconType === 'preset' ?

                (($chosenIcon !== '' && !is_null($chosenIcon) )? '<span class="ub-button-icon-holder">' .
                    '<svg xmlns="http://www.w3.org/2000/svg"' .
                    'height="' . ($iconSize ? : $presetIconSize[$size]) . ($iconUnit === 'em' ? 'em':'') .
                    '", width="' . ($iconSize ? : $presetIconSize[$size]) . ($iconUnit === 'em' ? 'em' :'') . '"' .
                    'viewBox="0, 0, ' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[0] . ', ' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[1]
                    . '"><path fill="currentColor" d="' . Ultimate_Blocks_IconSet::generate_fontawesome_icon($chosenIcon)[2] . '"></svg>'
                    . '</span>'
                : '') : ''))

        .'<span class="ub-button-block-btn">' . $buttonText . '</span>
    </div></a></div>';
}

function ubpro_button_filter($block_content, $block){
    if( "ub/button" != $block['blockName'] ) {
        return $block_content;
    }
    else{
        require dirname(dirname(__DIR__)) . '/defaults.php';

        foreach($defaultValues['ub/button']['attributes'] as $key => $value){
            if(!isset($block['attrs'][$key])){
                $block['attrs'][$key] = $value['default'];
            }
        }

        extract($block['attrs']);

        require_once dirname(dirname(__DIR__)) . '/icons.php';

        $iconSize = array('small' => 25, 'medium' => 30, 'large' => 35, 'larger' => 40);

        $buttonDisplay = (!isset($buttons) || count($buttons) === 0 ? '<div class="ub-button-container align-button-' . $align.(isset($className) ? ' ' . esc_attr($className) : '') . '"' . (!isset($blockID) || $blockID === '' ? ' ': ' id="ub-button-' . $blockID . '"') . '>
        <a href="' . esc_url($url) . '" target="' . ($openInNewTab ? '_blank' : '_self') . '"
        rel="noopener noreferrer' . ($addNofollow ? ' nofollow' : '').'"
        class="ub-button-block-main ub-button-' . $size .
        ($buttonWidth === 'full' ? ' ub-button-full-width' :
            ($buttonWidth === 'flex' ? ' ub-button-flex-' . $size : '')) . '">
        <div class="ub-button-content-holder">' .
            ($chosenIcon !== '' ? '<span class="ub-button-icon-holder"><svg xmlns="http://www.w3.org/2000/svg"
            height="' . $iconSize[$size] . '", width="' . $iconSize[$size] . '"
            viewBox="0, 0, ' . Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon($chosenIcon)[0] . ', ' . Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon($chosenIcon)[1]
            .'"><path fill="currentColor" d="' . Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon($chosenIcon)[2] . '"></svg></span>': '')
            .'<span class="ub-button-block-btn">' . $buttonText . '</span>
        </div></a></div>' : join('', array_map('ubpro_buttons_parse', $buttons)));

          return '<div class="wp-block-ub-button ' . (isset($buttons) && count($buttons) > 0 ? 'ub-buttons' : 'ub-button') . (isset($buttons) && count($buttons) > 0 ? ' align-button-' . ($align === '' ? 'center' : $align) : '')
        . ' orientation-button-' . $orientation . ($isFlexWrap ? " ub-flex-wrap" : '') . (isset($className) ? ' ' . esc_attr($className) : '') . '" ' .(!isset($blockID) || $blockID === '' ? ' ': ' id="ub-button-' . $blockID . '"') . '>' .$buttonDisplay . '</div>';
    }
}
