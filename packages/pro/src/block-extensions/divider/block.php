<?php

function ubpro_divider_filter($block_content, $block){
    if( "ub/divider" !== $block['blockName'] ) {
        return $block_content;
    }
    else{
        require dirname(dirname(__DIR__)) . '/defaults.php';
        require_once dirname(dirname(__DIR__)) . '/icons.php';

        foreach($defaultValues['ub/divider']['attributes'] as $key => $value){
            if(!isset($block['attrs'][$key])){
                $block['attrs'][$key] = $value['default'];
            }
        }

        extract($block['attrs']);

        return '<div class="ub_divider_container'.(isset($className) ? ' ' . esc_attr($className) : '').'"' .
        ($blockID === '' ? 'style="'.($orientation === 'horizontal' ? 'border-top' : 'border-left').': ' . $borderSize . 'px ' . $borderStyle . ' ' . $borderColor . '; margin-top: ' . $borderHeight . 'px; margin-bottom: ' . $borderHeight . 'px;"' :
        'id="ub_divider_' . $blockID.'"')
         .'>' .

        ($icon === '' ? '' : '<div class="ub_divider_icon"><svg xmlns="http://www.w3.org/2000/svg"
        height="' . $iconSize . '", width="' . $iconSize . '"
        viewBox="0, 0, ' . Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon($icon)[0] . ', ' . Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon($icon)[1]
        .'"><path fill="'.$borderColor.'" d="' . Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon($icon)[2] . '"></svg></div>') .

        '<hr class="ub_divider"></div>';
    }
}