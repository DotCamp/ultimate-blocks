<?php
require_once('block-extensions/button/block.php');
require_once('block-extensions/table-of-contents/block.php');
require_once('block-extensions/image-slider/block.php');
require_once('block-extensions/advanced-video/block.php');
require_once('block-extensions/advanced-video/block.php');
require_once('block-extensions/post-grid/block.php');
require_once('block-extensions/divider/block.php');
require_once('block-extensions/expand/inc/expand-portion-extension.php');

add_filter('ub_expand_portion_fade_content', 'ubpro_render_expand_portion_block', 10, 2);
add_filter('ubpro_divider_content', 'ubpro_render_divider_block', 10, 3);
add_filter('render_block', 'ubpro_button_filter', 10, 3);
add_filter('render_block', 'ubpro_table_of_contents_filter', 9, 3);
add_filter('ubpro_image_slider_filter', 'ubpro_image_slider_extend', 10, 2);
add_filter('render_block_ub/advanced-video', 'ubpro_advanced_video_filter', 9, 3);
add_filter('render_block_ub/post-grid', 'ubpro_render_post_grid_block', 9, 3);
