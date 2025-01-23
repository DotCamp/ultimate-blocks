<?php

namespace Ultimate_Blocks_Pro\Inc\Core;

use Plugin_Upgrader;
use Ultimate_Blocks_Pro\Inc\Common\Classes\Quiet_Activator;
use Ultimate_Blocks_Pro\Inc\Core\Managers\Admin_Notices_Manager;
use function activate_plugin;
use function deactivate_plugins;
use function esc_html__;
use function get_plugins;
use function is_wp_error;
use function plugin_basename;
use function wp_die;

/**
 * Fired during plugin activation
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @link       http://ultimateblocks.com
 * @since      2.1.6
 *
 * @author     Ultimate Blocks
 **/
class Activator {
	/**
	 * Base plugin path.
	 * @var string
	 */
	public static $base_path = 'ultimate-blocks/ultimate-blocks.php';

	/**
	 * Short Description.
	 *
	 * Long Description.
	 *
	 * @since    2.1.6
	 */
	public static function activate() {

		$min_php = '7.2';

		// Check PHP Version and deactivate & die if it doesn't meet minimum requirements.
		if ( version_compare( PHP_VERSION, $min_php, '<' ) ) {
			deactivate_plugins( plugin_basename( __FILE__ ) );
			wp_die( 'This plugin requires a minmum PHP Version of ' . $min_php );
		}

		static::check_base_version();
	}

	/**
	 * Check if base version is installed.
	 *
	 * This function will only check installation status of base plugin and will not check activated status.
	 * @return bool status
	 */
	public static function is_base_available() {
		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );

		$plugin_list = get_plugins();

		return array_key_exists( static::$base_path, $plugin_list );
	}

	/**
	 * Check availability of base version of plugin
	 * @return void
	 */
	public static function check_base_version() {
		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );

		$base_status = static::is_base_available();

		// install base version if not available
		if ( ! $base_status ) {
			require_once( ABSPATH . 'wp-admin/includes/plugin-install.php' );
			$plugin_base = plugins_api( 'plugin_information', [ 'slug' => 'ultimate-blocks' ] );

			// handle api fetch error
			if ( is_wp_error( $plugin_base ) ) {
				Admin_Notices_Manager::show_notice( $plugin_base->get_error_message(),
					Admin_Notices_Manager::ERROR );
			}

			require_once( ABSPATH . 'wp-admin/includes/file.php' );
			require_once( ABSPATH . 'wp-admin/includes/misc.php' );
			require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );
			require_once( ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php' );

			$upgrader = new Plugin_Upgrader( new Quiet_Activator() );

			$installation_status = $upgrader->install( $plugin_base->download_link );

			// handle base installation error
			if ( is_wp_error( $installation_status ) ) {
				Admin_Notices_Manager::show_notice( $plugin_base->get_error_message(),
					Admin_Notices_Manager::ERROR );
			}
		}

		// activate base version
		if ( ! is_plugin_active( static::$base_path ) ) {
			$activation_status = activate_plugin( static::$base_path );

			// handle activation error
			if ( is_wp_error( $activation_status ) ) {
				Admin_Notices_Manager::show_notice( $activation_status->get_error_message(),
					Admin_Notices_Manager::ERROR );
			}
		}

		// global base version freemius implementation
		global $ub_fs;

		// check implementation of freemius on base version
		if ( ! isset( $ub_fs ) ) {
			deactivate_plugins( plugin_basename( __FILE__ ) );

			$message = sprintf( esc_html__( 'You are using an incompatible version of %1$s. Please update to a newer version.',
				'ultimate-blocks-pro' ), '<strong>Ultimate Blocks</strong>' );

			// kill WordPress execution to prevent further freemius related errors and possible data corruption
			wp_die( $message );
		}
	}
}
