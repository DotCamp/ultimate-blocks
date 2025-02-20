<?php
require_once('block-extensions/button/block.php');
require_once('block-extensions/table-of-contents/block.php');
require_once('block-extensions/image-slider/block.php');
require_once('block-extensions/advanced-video/block.php');
require_once('block-extensions/advanced-video/block.php');
require_once('block-extensions/post-grid/block.php');

add_filter('render_block', 'ubpro_button_filter', 10, 3);
add_filter('render_block', 'ubpro_table_of_contents_filter', 9, 3);
add_filter('render_block', 'ubpro_image_slider_filter', 9, 3);
add_filter('render_block_ub/advanced-video', 'ubpro_advanced_video_filter', 9, 3);
add_filter('render_block_ub/post-grid', 'ubpro_render_post_grid_block', 9, 3);
