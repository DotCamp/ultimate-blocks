<?php
/**
 * @link              http://ultimateblocks.com
 * @since             2.1.6
 * @package           Ultimate_Blocks_Pro
 *
 * @wordpress-plugin
 * Plugin Name: Ultimate Blocks Pro
 * Description: Make Your Content Shine With Ultimate Blocks Pro.
 * Plugin URI:  https://ultimateblocks.com/
 * Version:     3.2.8
 * Author:      Ultimate Blocks
 * Author URI:  https://ultimateblocks.com/
 * License: GPL3+
 * License URI: http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: ultimate-blocks-pro
 * Domain Path: /languages
 */

namespace Ultimate_Blocks_Pro;

use Ultimate_Blocks_Pro\Inc\Core\Freemius\Freemius_License_Provider;
use Ultimate_Blocks_Pro\Inc\Core\Managers\Admin_Notices_Manager;
use Ultimate_Blocks_Pro\Inc\Core\Managers\License_Manager;
use function add_action;
use function deactivate_plugins;
use function do_action;
use function is_plugin_active;
use function plugin_basename;
use function register_activation_hook;
use function register_deactivation_hook;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Define Constants
 */

define( __NAMESPACE__ . '\NS', __NAMESPACE__ . '\\' );

define( NS . 'ULTIMATE_BLOCKS_PRO', 'ultimate-blocks-pro' );

define( NS . 'ULTIMATE_BLOCKS_PRO_VERSION', '3.0.6' );

define( NS . 'ULTIMATE_BLOCKS_PRO_DIR', plugin_dir_path( __FILE__ ) );

define( NS . 'ULTIMATE_BLOCKS_PRO_URL', plugin_dir_url( __FILE__ ) );

define( NS . 'ULTIMATE_BLOCKS_PRO_BASENAME', plugin_basename( __FILE__ ) );

define( NS . 'ULTIMATE_BLOCKS_PRO_TEXT_DOMAIN', 'ultimate-blocks-pro' );

define( NS . 'ULTIMATE_BLOCKS_PRO_PLUGIN_FILE', __FILE__ );


require_once 'inc/core/class-constants.php';

require_once( ULTIMATE_BLOCKS_PRO_DIR . 'inc/libraries/autoloader.php' );
require_once( ULTIMATE_BLOCKS_PRO_DIR . 'vendor/autoload.php' );

/**
 * Plugin Singleton Container
 *
 * Maintains a single copy of the plugin app object
 *
 * @since    2.1.6
 */
class Ultimate_Blocks_Pro {

	/**
	 * The instance of the plugin.
	 *
	 * @since    2.1.6
	 * @var      Init $init Instance of the plugin.
	 */
	private static $init;

	/**
	 * Loads the plugin
	 *
	 * @access    public
	 */

	public function __construct() {
		static::register_activation_deactivation();

		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );

		// check if base version is active and only initialize plugin if base version is active
		if ( is_plugin_active( 'ultimate-blocks/ultimate-blocks.php' ) ) {
			add_action( 'plugins_loaded', array( $this, 'initialize_license_manager' ), 9, 1 );
			add_action( 'ub_pro_license_manager_initialized', array( $this, 'init' ), 11, 1 );
		} else {
			// deactivate pro plugin
			deactivate_plugins( plugin_basename( __FILE__ ) );

			// show error message to admin notices
			$message = sprintf(
				esc_html__( '%1$s requires %2$s to be installed and activated.', 'ultimate-blocks-pro' ),
				'<strong>' . esc_html__( 'Ultimate Blocks Pro', 'ultimate-blocks-pro' ) . '</strong>',
				'<strong>' . esc_html__( 'Ultimate Blocks', 'ultimate-blocks-pro' ) . '</strong>'
			);
			Admin_Notices_Manager::show_notice( $message, Admin_Notices_Manager::ERROR );
		}
	}

	/**
	 * Initialize license manager.
	 * @return void
	 */
	public function initialize_license_manager() {
		License_Manager::init( [ 'license_provider' => new Freemius_License_Provider() ] );
		do_action( 'ub_pro_license_manager_initialized' );
	}

	public static function register_activation_deactivation() {
		register_activation_hook( __FILE__, [ NS . 'Inc\Core\Activator', 'activate' ] );
		register_deactivation_hook( __FILE__, [ NS . 'Inc\Core\Deactivator', 'deactivate' ] );
	}

	public static function init() {
		require_once( ULTIMATE_BLOCKS_PRO_DIR . 'src/blocks.php' );
		register_activation_hook( __FILE__, array( NS . 'Inc\Core\Activator', 'activate' ) );
		register_deactivation_hook( __FILE__, array( NS . 'Inc\Core\Deactivator', 'deactivate' ) );

		if ( null === self::$init ) {
			self::$init = new Inc\Core\Init( true );
		}

		return self::$init;
	}
}

/**
 * Begins execution of the plugin
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * Also returns copy of the app object so 3rd party developers
 * can interact with the plugin's hooks contained within.
 **/
function Ultimate_Blocks_Pro_init() {
	return new Ultimate_Blocks_Pro();
}

$min_php = '7.2';

// Check the minimum required PHP version and run the plugin.
if ( version_compare( PHP_VERSION, $min_php, '>=' ) ) {
	Ultimate_Blocks_Pro_init();
}
