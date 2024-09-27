<?php

namespace Ultimate_Blocks_Pro\Inc\Admin;

use Ultimate_Blocks_Pro\Inc\Core\Helpers;
use Ultimate_Blocks_Pro\Inc\Core\Managers\Frontend_Data_Manager;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @link       http://ultimateblocks.com
 * @since      2.1.6
 *
 * @author    Ultimate Blocks
 */
class Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    2.1.6
	 * @access   private
	 * @var      string $plugin_name The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    2.1.6
	 * @access   private
	 * @var      string $version The current version of this plugin.
	 */
	private $version;

	/**
	 * The text domain of this plugin.
	 *
	 * @since    2.1.6
	 * @access   private
	 * @var      string $plugin_text_domain The text domain of this plugin.
	 */
	private $plugin_text_domain;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param string $plugin_name The name of this plugin.
	 * @param string $version The version of this plugin.
	 * @param string $plugin_text_domain The text domain of this plugin.
	 *
	 * @since       2.1.6
	 */
	public function __construct( $plugin_name, $version, $plugin_text_domain ) {

		$this->plugin_name        = $plugin_name;
		$this->version            = $version;
		$this->plugin_text_domain = $plugin_text_domain;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    2.1.6
	 */
	public function enqueue_styles( $hook_suffix ) {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Loader as all the hooks are defined
		 * in that particular class.
		 *
		 * The Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		Helpers::enqueue_asset( 'inc/admin/css/ultimate-blocks-pro-admin.css',
			$this->plugin_name );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    2.1.6
	 */
	public function enqueue_scripts( $hook ) {
		/*
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Loader as all the hooks are defined
		 * in that particular class.
		 *
		 * The Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		$allowed_hooks = ['post.php', 'post-new.php'];

		if ( in_array($hook, $allowed_hooks)) {

			Helpers::enqueue_asset(
				'inc/admin/js/ultimate-blocks-pro-admin.js',
				$this->plugin_name,
				array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-hooks', 'wp-api', 'lodash' ) );

			wp_localize_script( $this->plugin_name, 'ub_roles', get_editable_roles() );
			Frontend_Data_Manager::get_instance()->attach_editor_data( $this->plugin_name );
		}
	}
}
