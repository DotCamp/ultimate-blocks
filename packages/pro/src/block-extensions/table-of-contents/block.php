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

function ubpro_table_of_contents_sticky_data_sets($_, $attributes){
    require_once dirname(dirname(__DIR__)) . '/icons.php';

    $is_sticky = isset($attributes['isSticky']) ? $attributes['isSticky'] : false;
    $sticky_toc_position = isset($attributes['stickyTOCPosition']) ? $attributes['stickyTOCPosition'] : 'left';
    $sticky_toc_width = isset($attributes['stickyTOCWidth']) ? $attributes['stickyTOCWidth'] : '320px';
    $hide_sticky_toc_on_mobile = isset($attributes['hideStickyTOCOnMobile']) ? $attributes['hideStickyTOCOnMobile'] : false;
    $sticky_button_icon_color = isset($attributes['stickyButtonIconColor']) ? $attributes['stickyButtonIconColor'] : '#000000';
    $list_icon = isset($attributes['listIcon']) ? $attributes['listIcon'] : '';
    $icon_name = !empty($list_icon) ? $list_icon : 'bars';
    $iconData = Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon($icon_name);
    $icon_data_view_box_1 = count($iconData) > 0 ? $iconData[0] : "";
    $icon_data_view_box_2 = count($iconData) > 0 ? $iconData[1] : "";
    $icon_data_path = count($iconData) > 0 ? $iconData[2] : "";
    $icon = count($iconData) > 0 ? sprintf('<svg style="color:%1$s;" class="ub_sticky-toc-open-button-icon" xmlns="http://www.w3.org/2000/svg" height="34px" width="34px" viewBox="0, 0, %2$s, %3$s"><path fill="currentColor" d="%4$s"></svg>', 
        $sticky_button_icon_color,
        $icon_data_view_box_1,
        $icon_data_view_box_2,
        $icon_data_path
    ) : "Open";

    $sticky_data_sets = sprintf(
        'data-is_sticky="%1$s" data-sticky_toc_position="%2$s" data-hide_sticky_on_mobile="%3$s" data-sticky_button_icon="%4$s" data-sticky_button_color="%5$s" data-sticky_toc_width="%6$s"',
        esc_attr($is_sticky ? 'true' : 'false'),
        esc_attr($sticky_toc_position), 
        esc_attr($hide_sticky_toc_on_mobile ? 'true' : 'false'), 
        esc_attr($icon), 
        esc_attr($sticky_button_icon_color),
        esc_attr($sticky_toc_width)
    );
    return $sticky_data_sets;
}

add_filter('ubpro_table_of_contents_sticky_data', 'ubpro_table_of_contents_sticky_data_sets', 10, 2);

function ubpro_table_of_contents_styles_filter($_, $attributes){
    require_once dirname(dirname(__DIR__)) . '/icons.php';

    $styles = array();
    if (isset($attributes['listStyle']) && $attributes['listStyle'] === 'bulleted' && isset($attributes['listIcon']) && $attributes['listIcon'] !== '') {
        $iconData = Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon($attributes['listIcon']);
        $styles['--ub-table-of-content-list-style-image'] = 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' . $iconData[0] . ' ' . $iconData[1] . '"><path fill="%23' . substr($attributes['listIconColor'], 1) . '" d="' . $iconData[2] . '"></path></svg>\');';
    }
    return $styles;
}


add_filter( 'ubpro_table_of_contents_styles', 'ubpro_table_of_contents_styles_filter', 10, 2 );

function ubpro_table_of_contents_classes_filter($_, $attributes){
    $classes = array();
    if(isset($attributes['isSticky'])){
        $classes[] = 'ub_table-of-contents-sticky';
    }
    if((isset($attributes['listStyle']) && $attributes['listStyle'] === 'bulleted') && (isset($attributes['listIcon']) && $attributes['listIcon'] !== '')){
        $classes[] = 'ub_table-of-contents-custom-icon';
    }

    return $classes;
}

add_filter( 'ubpro_table_of_contents_classes', 'ubpro_table_of_contents_classes_filter', 10, 2 );

function ubpro_toc_header_toggle($headerToggle, $attributes){
    if(!$attributes['allowToCHiding']) {
        return '';
    }
    
    $toggleButtonType = isset($attributes['toggleButtonType']) ? $attributes['toggleButtonType'] : 'text';
    $showList = isset($attributes['initiallyShow']) ? $attributes['initiallyShow'] : true;
    
    switch($toggleButtonType) {
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
        default:
            $toggleButton = $headerToggle;
    }
    
    return $toggleButton;
}

add_filter('ubpro_table_of_contents_header_toggle', 'ubpro_toc_header_toggle', 10, 2);