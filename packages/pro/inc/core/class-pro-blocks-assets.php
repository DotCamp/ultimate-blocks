<?php

/**
 * Enqueue block assets
 *
 * @package Ultimate_Blocks_Pro
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
     exit;
}

require_once dirname( __FILE__ ) . '/class-constants.php';

class Pro_Blocks_Assets {

     public function __construct() {
          add_action('enqueue_block_editor_assets', array($this, 'register_block_assets'));
          add_action('init', array($this, 'register_block_frontend_assets'));
     }
     public function register_block_frontend_assets(){
          // Register block CSS
          wp_register_style(
               'ultimate-blocks-pro-blocks-frontend-css',
               Ultimate_Blocks_Pro_Constants::plugin_url() . 'blocks/css/ultimate-blocks-pro-blocks-frontend-styles.css',
               array(),
               Ultimate_Blocks_Pro_Constants::plugin_version()
          );
     }
     public function register_block_assets() {
          // Register block JS
          wp_register_script(
               'ultimate-blocks-pro-blocks-js',
               Ultimate_Blocks_Pro_Constants::plugin_url() . 'blocks/js/ultimate-blocks-pro-blocks.js',
               array(  'wp-blocks', 'wp-element', 'wp-components', 'wp-editor', 'wp-api', 'lodash' ),
               Ultimate_Blocks_Pro_Constants::plugin_version()
          );

          // Register block CSS
          wp_register_style(
               'ultimate-blocks-pro-blocks-editor-css',
               Ultimate_Blocks_Pro_Constants::plugin_url() . 'blocks/css/ultimate-blocks-pro-blocks-editor-styles.css',
               array(),
               Ultimate_Blocks_Pro_Constants::plugin_version()
          );
     }
}

new Pro_Blocks_Assets();
?>