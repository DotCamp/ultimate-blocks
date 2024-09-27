<?php

use Ultimate_Blocks_Pro\Ultimate_Blocks_Pro;

function ubpro_table_of_contents_replace_script(){
    wp_dequeue_script( 'ultimate_blocks-table-of-contents-front-script' );
    wp_deregister_script( 'ultimate_blocks-table-of-contents-front-script' );
    wp_enqueue_script(
        'ultimate_blocks-table-of-contents-front-script',
        plugins_url( 'table-of-contents/front.js', dirname( __FILE__ ) ),
        array( ),
        Ultimate_Blocks_Pro_Constants::plugin_version(),
        true
    );
}

add_action('wp_enqueue_scripts', 'ubpro_table_of_contents_replace_script', 20);

function ubpro_table_of_contents_filter($block_content, $block){
    if( "ub/table-of-contents-block" !== $block['blockName'] ) {
        return $block_content;
    }
    else{
        require dirname(dirname(__DIR__)) . '/defaults.php';

        foreach($defaultValues['ub/table-of-contents-block']['attributes'] as $key => $value){
            if(!isset($block['attrs'][$key])){
                $block['attrs'][$key] = $value['default'];
            }
        }

        extract($block['attrs']);
        require_once dirname(dirname(__DIR__)) . '/icons.php';

        $linkArray = json_decode($links, true);
		$linkArray = is_null($linkArray) ? [] : $linkArray;
    	$is_link_to_divider = isset($linkToDivider) && $linkToDivider;

        $filteredHeaders = array_values(array_filter($linkArray, function ($header) use ($allowedHeaders){
            return $allowedHeaders[$header['level'] - 1] && 
               (!array_key_exists("disabled",  $header) || (array_key_exists("disabled",  $header) && !$header['disabled']));
        }));
    
        $currentGaps = array_values(array_filter($gaps, function($gap, $index) use($allowedHeaders, $linkArray){
            return $allowedHeaders[$linkArray[$index]['level'] - 1] && (!array_key_exists("disabled",  $linkArray[$index]) || (array_key_exists("disabled", $linkArray[$index]) && !$linkArray[$index]['disabled']));
        }, ARRAY_FILTER_USE_BOTH));
    
        $sortedHeaders = [];
    
        foreach($filteredHeaders as $elem){
            $elem['content'] = trim(preg_replace('/(<.+?>)/', '', $elem['content']));
            $last = count($sortedHeaders) - 1;
            if (count($sortedHeaders) === 0 || $sortedHeaders[$last][0]['level'] < $elem['level']) {
                array_push($sortedHeaders, [$elem]);
            }
            else if ($sortedHeaders[$last][0]['level'] === $elem['level']){
                array_push($sortedHeaders[$last], $elem);
            }
            else{
                while($sortedHeaders[$last][0]['level'] > $elem['level'] && count($sortedHeaders) > 1){
                    array_push($sortedHeaders[count($sortedHeaders) - 2], array_pop($sortedHeaders));
                    $last = count($sortedHeaders) - 1;
                }
                if($sortedHeaders[$last][0]['level'] === $elem['level']){
                    array_push($sortedHeaders[$last], $elem);
                }
            }
        }
    
        if(count($sortedHeaders) > 0){
            while(count($sortedHeaders) > 1 &&
                $sortedHeaders[count($sortedHeaders) - 1][0]['level'] > $sortedHeaders[count($sortedHeaders) - 2][0]['level']){
                array_push($sortedHeaders[count($sortedHeaders) - 2], array_pop($sortedHeaders));
            }
            $sortedHeaders = $sortedHeaders[0];
        }
    
        $listItems = '';
    
        if (!function_exists('ub_makeListItem')) {
            function ub_makeListItem($num, $item, $listStyle, $blockID, $currentGaps){
                static $outputString = '';
                if($num === 0 && $outputString !== ''){
                    $outputString = '';
                }
                if (isset($item['level'])){
                    //intercept otter headings here
                    if(strpos($item["anchor"], "themeisle-otter ") === 0){
                        $anchor = '#' . str_replace("themeisle-otter ", "", $item["anchor"]);
                    }
                    else{
                        $anchor = '#' . $item["anchor"];
                    }
    
                    if(count($currentGaps) > $num && get_query_var('page') !== $currentGaps[$num]){
                        $baseURL = get_permalink();
                        $anchor = $baseURL . ($currentGaps[$num] > 1 ? (get_post_status(get_the_ID()) === 'publish' ? '' : '&page=')
                                . $currentGaps[$num] : '') . $anchor;
                    }
    
                    $content = array_key_exists("customContent", $item) && !empty($item["customContent"]) ? $item["customContent"] : $item["content"];
                    $outputString .= '<li><a href=' . $anchor . '>'. $content .'</a></li>';
                }
                else{
                    $openingTag = $listStyle === 'numbered' ? '<ol>' :
                        '<ul' . ($listStyle === 'plain' && $blockID === '' ? ' style="list-style: none;"' : '') . ($listIcon === '' ? '' : ' class="fa-ul"') . '>';  //add fa-ul if needed
    
                    $outputString = substr_replace($outputString, $openingTag,
                        strrpos($outputString, '</li>'), strlen('</li>'));
    
                    forEach($item as $key => $subItem){
                        ub_makeListItem($key + 1, $subItem, $listStyle, $blockID, $currentGaps);
                    }
                    $outputString .= ($listStyle === 'numbered' ? '</ol>' : '</ul>') . '</li>';
                }
                return $outputString;
            }
        }
    
        if(count($sortedHeaders) > 0){
            foreach($sortedHeaders as $key => $item){
                $listItems = ub_makeListItem($key, $item, $listStyle, $blockID, $currentGaps);
            }
        }
    
        $targetType = '';
        if ($scrollTargetType === 'id'){
            $targetType = '#';
        }
        else if ($scrollTargetType === 'class'){
            $targetType = '.';
        }

        switch($toggleButtonType){
            case 'chevron':
                $toggleButton = '<div class="ub_table-of-contents-toggle-icon-container">
                                    <span class="ub_table-of-contents-chevron-left ' . ($showList ? 'ub_asc_diagonal_bar' : 'ub_desc_diagonal_bar') . '"></span>
                                    <span class="ub_table-of-contents-chevron-right ' . ($showList ? 'ub_desc_diagonal_bar' : 'ub_asc_diagonal_bar') .'"></span>
                                </div>';
                break;
            case 'plus':
                $toggleButton = '<div class="ub_table-of-contents-toggle-icon-container">
                                    <span class="ub_table-of-contents-plus-part ' . ($showList ? 'ub_horizontal_bar' : 'ub_vertical_bar' ) . '"></span>
                                    <span class="ub_table-of-contents-plus-part' . ($showList ? ' ub_vertical_bar' : '' ) . '"></span>
                                </div>';
                break;
            case 'text':
            default:
                $toggleButton = '<div class="ub_table-of-contents-header-toggle">
                    <div class="ub_table-of-contents-toggle">
                    &nbsp;[<a class="ub_table-of-contents-toggle-link" href="#">' .
                        __($showList ? 'hide' : 'show', 'ultimate-blocks')
                        . '</a>]</div></div>';
                break;
        }
        $icon_name = !empty( $listIcon ) ? $listIcon : 'bars';
        $iconData = Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon($icon_name);
        $icon_data_view_box_1  = count($iconData) > 0  ? $iconData[0] : "";
        $icon_data_view_box_2  = count($iconData) > 0  ? $iconData[1] : "";
        $icon_data_path  = count($iconData) > 0 ?  $iconData[2] : "";
        $icon = count($iconData) > 0 ? "<svg style='color:$stickyButtonIconColor;' class='ub_sticky-toc-open-button-icon' xmlns='http://www.w3.org/2000/svg'height='34px' width='34px' viewBox='0, 0, $icon_data_view_box_1, $icon_data_view_box_2'><path fill='currentColor' d='$icon_data_path'></svg>" : "Open";

        $is_sticky = $isSticky;
        $sticky_toc_position = $stickyTOCPosition;
        $sticky_toc_width = $stickyTOCWidth;
        $hide_sticky_toc_on_mobile = $hideStickyTOCOnMobile ? "true" : "false";
        $sticky_data_sets = sprintf(
            'data-sticky_toc_position="%s" data-hide_sticky_on_mobile="%s" data-sticky_button_icon="%s" data-sticky_button_color="%s" data-sticky_toc_width="%s"',
            esc_attr($sticky_toc_position), 
            esc_attr($hide_sticky_toc_on_mobile), 
            esc_attr($icon), 
            esc_attr($stickyButtonIconColor),
            esc_attr($sticky_toc_width)

        );

        $link_to_divider_dataset = 'data-linktodivider='. ($is_link_to_divider ? 'true' : 'false');
        
        return '<div ' . ($is_sticky ? 'data-is_sticky="true"' :  'data-is_sticky="false"') .  ' class="wp-block-ub-table-of-contents-block ub_table-of-contents' . (isset($className) ? ' ' . esc_attr($className) : '')
                    . (!$showList && strlen($title) > 0 ? ' ub_table-of-contents-collapsed' : '' ) .
                    '"' . $link_to_divider_dataset . ' ' . $sticky_data_sets . ' data-showtext="' . __('show', 'ultimate-blocks') . '" data-hidetext="' . __('hide', 'ultimate-blocks')
                    . '" data-scrolltype="' . $scrollOption . '"' . ($scrollOption === 'fixedamount' ? ' data-scrollamount="' . $scrollOffset . '"' : '')
                    . ($scrollOption === 'namedelement' ? ' data-scrolltarget="' . $targetType . $scrollTarget . '"' : '')
                    . ($blockID === '' ? '' : ' id="ub_table-of-contents-' . $blockID . '"') . ' data-initiallyhideonmobile="' . json_encode($hideOnMobile) . '"
                        data-initiallyshow="' . json_encode($showList) . '">' .

                    (strlen($title) > 0 ? ('<div class="ub_table-of-contents-header-container"><div class="ub_table-of-contents-header">
                        <div class="ub_table-of-contents-title">' . $title . '</div>' . 
                        ($allowToCHiding ? $toggleButton : '')
                    . '</div></div>') : '')
                    . '<div class="ub_table-of-contents-extra-container"><div class="ub_table-of-contents-container ub_table-of-contents-' .
                        $numColumns . '-column ' . ($showList || strlen($title) === 0 ||
                        (strlen($title) === 1 && $title[0] === '') ? '' : 'ub-hide') . '">' .
                    ($listStyle === 'numbered' ? '<ol>' :  '<ul' . ($listStyle === 'plain' && $blockID === '' ? ' style="list-style: none;"' : '') . ($listIcon === '' ? '' : ' class="fa-ul"') . '>') //add fa-ul if needed
                    . $listItems .
                    ($listStyle === 'numbered' ? '</ol>' : '</ul>')
                    . '</div></div></div>';
    }
}
