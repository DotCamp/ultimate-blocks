<?php


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
        $attributes = $block['attrs'];
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
            function ub_makeListItem($num, $item, $listStyle, $blockID, $currentGaps, $attributes){
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
                        ub_makeListItem($key + 1, $subItem, $listStyle, $blockID, $currentGaps, $attributes);
                    }
                    $outputString .= ($listStyle === 'numbered' ? '</ol>' : '</ul>') . '</li>';
                }
                return $outputString;
            }
        }
    
        if(count($sortedHeaders) > 0){
            foreach($sortedHeaders as $key => $item){
                $listItems = ub_makeListItem($key, $item, $listStyle, $blockID, $currentGaps, $attributes);
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
                $toggle_button_styles = array();
                if ($attributes['toggleButtonType'] === 'chevron') {
                    $toggle_button_styles['background-color'] = $attributes['titleColor'];
                }
                $toggleButton = sprintf(
                    '<div class="ub_table-of-contents-toggle-icon-container">
                        <span class="ub_table-of-contents-chevron-left %1$s" style="%3$s"></span>
                        <span class="ub_table-of-contents-chevron-right %2$s" style="%3$s"></span>
                    </div>',
                    ($showList ? 'ub_asc_diagonal_bar' : 'ub_desc_diagonal_bar'),
                    ($showList ? 'ub_desc_diagonal_bar' : 'ub_asc_diagonal_bar'),
                    Ultimate_Blocks_Pro\CSS_Generator\generate_css_string($toggle_button_styles)
                );
                break;
            case 'plus':
                $toggle_button_styles = array();

                if ($attributes['toggleButtonType'] === 'plus') {
                    $toggle_button_styles['background-color'] = $attributes['titleColor'];
                }
                $toggleButton = sprintf(
                    '<div class="ub_table-of-contents-toggle-icon-container">
                        <span class="ub_table-of-contents-plus-part %1$s" style="%3$s"></span>
                        <span class="ub_table-of-contents-plus-part%2$s" style="%3$s"></span>
                    </div>',
                    ($showList ? 'ub_horizontal_bar' : 'ub_vertical_bar'),
                    ($showList ? ' ub_vertical_bar' : ''),
                    Ultimate_Blocks_Pro\CSS_Generator\generate_css_string($toggle_button_styles)
                );
                break;
            case 'text':
            default:
                $toggle_link_styles = array();
                $toggle_styles = array();

                if (isset($attributes['titleBackgroundColor'])) {
                    $toggle_link_styles['background-color'] = $attributes['titleBackgroundColor'];
                }
                if (isset($attributes['titleColor'])) {
                    $toggle_link_styles['color'] = $attributes['titleColor'];
                    $toggle_styles['color'] = $attributes['titleColor'];
                }
                $toggleButton = sprintf(
                    '<div class="ub_table-of-contents-header-toggle" style="%2$s">
                        <div class="ub_table-of-contents-toggle">
                        &nbsp;[<a class="ub_table-of-contents-toggle-link" href="#">%s</a>]
                        </div>
                    </div>',
                    __($showList ? 'hide' : 'show', 'ultimate-blocks'),
                    Ultimate_Blocks\includes\generate_css_string($toggle_link_styles),
		            Ultimate_Blocks\includes\generate_css_string($toggle_styles)
                );
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
        $contents_header_styles = array(
            'text-align' => isset($attributes['titleAlignment']) ? $attributes['titleAlignment'] : 'left',
        );
        if ($attributes['allowToCHiding']) {
            $contents_header_styles['margin-bottom'] = '0';
        }
        $header_container_styles = array(
            'background-color' => isset($attributes['titleBackgroundColor']) ? $attributes['titleBackgroundColor'] : '',
            'color' => isset($attributes['titleColor']) ? $attributes['titleColor'] : '',
        );
        $headerContent = (strlen($title) > 0 ? sprintf(
            '<div class="ub_table-of-contents-header-container" style="%4$s"><div class="ub_table-of-contents-header" style="%3$s"><div class="ub_table-of-contents-title">%1$s</div>%2$s</div></div>',
            $title,
            ($allowToCHiding ? $toggleButton : ''),
            Ultimate_Blocks\includes\generate_css_string($contents_header_styles),
		    Ultimate_Blocks\includes\generate_css_string($header_container_styles)
        ) : '');
        $padding = Ultimate_Blocks\includes\get_spacing_css( isset($attributes['padding']) ? $attributes['padding'] : array() );
	    $margin  = Ultimate_Blocks\includes\get_spacing_css( isset($attributes['margin']) ? $attributes['margin'] : array() );

        $styles = array(
            'padding-top'        => isset($padding['top']) ? $padding['top'] : "",
            'padding-left'       => isset($padding['left']) ? $padding['left'] : "",
            'padding-right'      => isset($padding['right']) ? $padding['right'] : "",
            'padding-bottom'     => isset($padding['bottom']) ? $padding['bottom'] : "",
            'margin-top'         => !empty($margin['top']) ? $margin['top']  : "",
            'margin-left'        => !empty($margin['left']) ? $margin['left']  : "",
            'margin-right'       => !empty($margin['right']) ? $margin['right']  : "",
            'margin-bottom'      => !empty($margin['bottom']) ? $margin['bottom']  : "",
        );
        if ($attributes['listStyle'] === 'bulleted' && $attributes['listIcon'] !== '') {
            $iconData = Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon($attributes['listIcon']);
            $styles['--ub-table-of-content-list-style-image'] = 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' . $iconData[0] . ' ' . $iconData[1] . '"><path fill="%23' . substr($attributes['listIconColor'], 1) . '" d="' . $iconData[2] . '"></path></svg>\');';
        }

        if ($attributes['allowToCHiding']) {
            $styles['max-width'] = 'fit-content';
            $styles['max-width'] = '-moz-fit-content';
        }
        $list_container_styles = array(
            'background-color' => isset($attributes['listBackgroundColor']) ? $attributes['listBackgroundColor'] : '',
        );
          return sprintf(
            '<div
                %1$s
                class="wp-block-ub-table-of-contents-block ub_table-of-contents%2$s%3$s%22$s"
                style="%21$s"
                %4$s
                %5$s
                data-showtext="%6$s"
                data-hidetext="%7$s"
                data-scrolltype="%8$s"
                %9$s
                %10$s
                %11$s
                data-initiallyhideonmobile="%12$s"
                data-initiallyshow="%13$s"
            >
                %14$s
                <div
                    class="ub_table-of-contents-extra-container"
                    style="%20$s"
                >
                    <div
                        class="ub_table-of-contents-container ub_table-of-contents-%15$s-column %16$s"
                    >%17$s%18$s</div>
                </div>
            </div>',
            ($is_sticky ? 'data-is_sticky="true"' : 'data-is_sticky="false"'), //1
            (isset($className) ? ' ' . esc_attr($className) : ''), //2
            (!$showList && strlen($title) > 0 ? ' ub_table-of-contents-collapsed' : ''), //3
            $link_to_divider_dataset, //4
            $sticky_data_sets, //5
            __('show', 'ultimate-blocks'), //6
            __('hide', 'ultimate-blocks'), //7
            $scrollOption, //8
            ($scrollOption === 'fixedamount' ? ' data-scrollamount="' . $scrollOffset . '"' : ''), //9
            ($scrollOption === 'namedelement' ? ' data-scrolltarget="' . $targetType . $scrollTarget . '"' : ''), //10
            ($blockID === '' ? '' : ' id="ub_table-of-contents-' . $blockID . '"'), //11
            json_encode($hideOnMobile), //12
            json_encode($showList), //13
            $headerContent, //14
            $numColumns, //15
            ($showList || strlen($title) === 0 || (strlen($title) === 1 && $title[0] === '') ? '' : 'ub-hide'), //16
            ($listStyle === 'numbered' ? '<ol>' : '<ul' . ($listStyle === 'plain' && $blockID === '' ? ' style="list-style: none;"' : '') . ($listIcon === '' ? '' : ' class="fa-ul"') . '>'), //17
            $listItems, //18
            ($listStyle === 'numbered' ? '</ol>' : '</ul>'), //19
            Ultimate_Blocks_Pro\CSS_Generator\generate_css_string($list_container_styles), //20
            Ultimate_Blocks\includes\generate_css_string( $styles ), //21
            $attributes['listStyle'] === "bulleted" && $attributes['listIcon'] !== '' ? " ub_table-of-contents-custom-icon": ""
        );
    }
}
