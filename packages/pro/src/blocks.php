<?php
require_once('block-extensions/button/block.php');
require_once('block-extensions/table-of-contents/block.php');
require_once('block-extensions/image-slider/block.php');
require_once('block-extensions/advanced-video/block.php');
require_once('block-extensions/advanced-video/block.php');
require_once('block-extensions/post-grid/block.php');
require_once('block-extensions/divider/block.php');
require_once('block-extensions/expand/block.php');

add_filter('render_block', 'ubpro_button_filter', 10, 3);
add_filter('render_block_ub/post-grid', 'ubpro_render_post_grid_block', 9, 3);
