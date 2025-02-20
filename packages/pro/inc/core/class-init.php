<?php

namespace Ultimate_Blocks_Pro\Inc\Core;

use Ultimate_Blocks_Pro as NS;
use Ultimate_Blocks_Pro\Inc\Admin as Admin;
use Ultimate_Blocks_Pro\Inc\Core\Managers\Block_Extension_Manager;
use Ultimate_Blocks_Pro\Inc\Core\Managers\Ultimate_Blocks_Pro_Extension_Manager;
use Ultimate_Blocks_Pro\Inc\Core\Managers\Block_Status_Manager;
use Ultimate_Blocks_Pro\Inc\Core\Managers\License_Manager;
use Ultimate_Blocks_Pro\Inc\Core\Managers\Pro_Block_Manager;
use Ultimate_Blocks_Pro\Inc\Core\Managers\Saved_Styles_Manager;
use Ultimate_Blocks_Pro\Inc\Core\Managers\Settings_Menu_Manager;
use Ultimate_Blocks_Pro\Inc\Core\Managers\Static_Styles_Manager;
use Ultimate_Blocks_Pro\Inc\Core\Managers\Version_Control_Manager;
use Ultimate_Blocks_Pro\Inc\Frontend as Frontend;

/**
 * The core plugin class.
 * Defines internationalization, admin-specific hooks, and public-facing site hooks.
 *
 * @link       http://ultimateblocks.com
 * @since      2.1.6
 *
 * @author     Ultimate Blocks
 */
class Init {
	/**
	 * The name of the plugin used to uniquely identify it within the context of WordPress.
	 * @var string
	 */
	protected $plugin_name;

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @var      Loader $loader Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    2.1.6
	 * @access   protected
	 * @var      string $plugin_base_name The string used to uniquely identify this plugin.
	 */
	protected $plugin_basename;

	/**
	 * The current version of the plugin.
	 *
	 * @since    2.1.6
	 * @access   protected
	 * @var      string $version The current version of the plugin.
	 */
	protected $version;

	/**
	 * The text domain of the plugin.
	 *
	 * @since    2.1.6
	 * @access   protected
	 * @var      string $version The current version of the plugin.
	 */
	protected $plugin_text_domain;

	/**
	 * Initialize and define the core functionality of the plugin.
	 *
	 * @param bool $run whether to run the plugin or not
	 */
	public function __construct( $run = false ) {
		$this->before_license_check();

		if ( License_Manager::is_pro_valid() ) {
			$this->plugin_name        = NS\ULTIMATE_BLOCKS_PRO;
			$this->version            = NS\ULTIMATE_BLOCKS_PRO_VERSION;
			$this->plugin_basename    = NS\ULTIMATE_BLOCKS_PRO_BASENAME;
			$this->plugin_text_domain = NS\ULTIMATE_BLOCKS_PRO_TEXT_DOMAIN;

			$this->load_dependencies();
			$this->set_locale();
			$this->define_admin_hooks();
			$this->define_public_hooks();

			// initialize plugin managers
			$this->initialize_managers();

			if ( $run ) {
				$this->run();
			}
		}

	}

	/**
	 * Operations before license check.
	 *
	 * @return void
	 */
	public function before_license_check() {
		Settings_Menu_Manager::init( [], 'Ultimate_Blocks_Pro\Inc\Core\Managers\Settings_Menu_Manager' );
	}

	/**
	 * Loads the following required dependencies for this plugin.
	 *
	 * - Loader - Orchestrates the hooks of the plugin.
	 * - Internationalization_I18n - Defines internationalization functionality.
	 * - Admin - Defines all hooks for the admin area.
	 * - Frontend - Defines all hooks for the public side of the site.
	 *
	 * @access    private
	 */
	private function load_dependencies() {
		$this->loader = new Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Internationalization_I18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @access    private
	 */
	private function set_locale() {

		$plugin_i18n = new Internationalization_I18n( $this->plugin_text_domain );

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @access    private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Admin\Admin( $this->get_plugin_name(), $this->get_version(),
			$this->get_plugin_text_domain() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @access    private
	 */
	private function define_public_hooks() {

		$plugin_public = new Frontend\Frontend( $this->get_plugin_name(), $this->get_version(),
			$this->get_plugin_text_domain() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

	}

	/**
	 * Initialize managers.
	 * @return void
	 */
	private function initialize_managers() {
		Version_Control_Manager::init();

		Pro_Block_Manager::init();

		Block_Extension_Manager::init();

		Saved_Styles_Manager::init( [], 'Ultimate_Blocks_Pro\Inc\Core\Managers\Saved_Styles_Manager' );

		Static_Styles_Manager::init( [], 'Ultimate_Blocks_Pro\Inc\Core\Managers\Static_Styles_Manager' );

		Block_Status_Manager::init();

		require_once dirname(__FILE__) .'/class-pro-blocks-assets.php';
		require_once dirname(__FILE__) .'/managers/class-pro-extension-manager.php';
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @return    Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @return    string    The version number of the plugin.
	 * @since     2.1.6
	 */
	public function get_version() {
		return $this->version;
	}

	/**
	 * Retrieve the text domain of the plugin.
	 *
	 * @return    string    The text domain of the plugin.
	 * @since     2.1.6
	 */
	public function get_plugin_text_domain() {
		return $this->plugin_text_domain;
	}

}
