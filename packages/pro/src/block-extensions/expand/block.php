<?
require_once('inc/expand-portion-extension.php');
require_once('inc/expand-extension.php');

add_filter('ub_expand_styles', 'ubpro_render_expand_styles', 10, 2);
add_filter('ub_expand_portion_fade_content', 'ubpro_render_expand_portion_block', 10, 2);



function ubpro_expand_block_script(){
    wp_enqueue_script(
        'ultimate_blocks-pro-expand-script',
        plugins_url( 'expand/front.js', dirname( __FILE__ ) ),
        array(),
        Ultimate_Blocks_Pro_Constants::plugin_version(),
        true
    );
}

add_action('wp_enqueue_scripts', 'ubpro_expand_block_script', 20);