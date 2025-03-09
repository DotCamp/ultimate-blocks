<?php

namespace Ultimate_Blocks_Pro\Inc\Core\Managers;

use Ultimate_Blocks_Pro\Inc\Common\Base\License_Provider;
use Ultimate_Blocks_Pro\Inc\Common\Classes\Ub_License;
use Ultimate_Blocks_Pro\Inc\Common\Traits\Manager_Base_Trait;
use WP_Error;
use function add_action;
use function esc_html__;
use function get_transient;
use function is_wp_error;
use function set_transient;

/**
 * Manager for handling licenses.
 */
class License_Manager {
	use Manager_Base_Trait;

	/**
	 * @var License_Provider
	 */
	private $license_provider;

	/**
	 * Whether to use transient cache or not.
	 *
	 * Don't use cache for freemius license provider.
	 * @var bool
	 */
	private $use_cache = false;

	// transient cache expiration time in seconds
	const TRANSIENT_EXPIRATION = 60;

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		$this->license_provider = $this->class_options['license_provider'];
		$this->define_global_initialization_const();

		add_action( 'admin_notices', [ $this, 'plugin_page_notices' ], 10, 1 );
	}

	/**
	 * Define a global constant marking license manager is initialized with status of available license.
	 *
	 * @return void
	 */
	public function define_global_initialization_const() {
		define( 'ULTIMATE_BLOCKS_PRO_LICENSE', static::is_pro_valid() );
	}

	/**
	 * Show license related notices on plugin page.
	 *
	 * @return void
	 */
	public function plugin_page_notices() {
		$current_page = get_current_screen();

		if ( $current_page->base !== 'plugins' ) {
			return;
		}

		$license_validation_status = static::is_pro_valid();

		if ( ! $license_validation_status ) {
			$message = sprintf( esc_html_x(
				'Activate a valid license to start using %1$s', '$1$s is name of pro version plugin',
				'ultimate-blocks-pro' ), '
				<span style="font-weight: bold">Ultimate Blocks <span style="color: #F64646">PRO</span></span>.'
			);

			echo Admin_Notices_Manager::generate_notice_html( esc_html($message), esc_html(Admin_Notices_Manager::WARNING) );
		}
	}

	/**
	 * Generate compatible cache id.
	 * @return string cache id
	 */
	private function generate_cache_id() {
		$cache_prefix             = 'ub_pro';
		$current_license_provider = static::get_instance()->license_provider;
		$provider_version         = str_replace( '.', '_', $current_license_provider->provider_version );

		return sprintf( '%s-%s-v%s', $cache_prefix, $current_license_provider->get_provider_id(), $provider_version );
	}

	/**
	 * Get current license from cache.
	 *
	 * @return false | Ub_License cached license or false if not found
	 */
	private function current_license_from_cache() {
		$cache_id = $this->generate_cache_id();

		$cache_license_data = get_transient( $cache_id );

		if ( ! $cache_license_data ) {
			return false;
		}

		$cached_license = static::get_instance()->license_provider->generate_license_raw();
		$cached_license->set_key( $cache_license_data['key'] );
		$cached_license->set_status( $cache_license_data['status'] );

		return $cached_license;
	}

	/**
	 * Cache supplied license.
	 *
	 * @param Ub_License $license license to be cached
	 *
	 * @return void
	 */
	private function cache_license( $license ) {
		$cache_id = $this->generate_cache_id();

		$cache_data = [
			'key'         => $license->get_key( true ),
			'status'      => $license->get_status(),
			'provider_id' => $license->get_provider_id(),
			'version'     => $license->get_provider_version(),
		];

		set_transient( $cache_id, $cache_data, self::TRANSIENT_EXPIRATION );
	}

	/**
	 * Get current license.
	 *
	 * @param bool $from_cache whether to check cache first for an available license
	 *
	 * @return WP_Error | Ub_License current license or WP_Error is something went wrong
	 */
	private function current_license( $from_cache = true ) {
		if ( $from_cache ) {
			$cached_license = $this->current_license_from_cache();

			if ( $cached_license && is_a( $cached_license, Ub_License::class ) && $cached_license->is_valid() ) {
				return $cached_license;
			}
		}

		$remote_license = $this->license_provider->get_license( null );

		// if license is valid, cache it
		if ( ! is_wp_error( $remote_license ) && $remote_license->is_valid() ) {
			$this->cache_license( $remote_license );
		}

		return $remote_license;
	}

	/**
	 * Activate license.
	 *
	 * @param string $license_key license key to activate
	 *
	 * @return WP_Error | Ub_License activated license or WP_Error if something went wrong
	 */
	public static function activate_license( $license_key ) {
		return static::get_instance()->license_provider->activate_license( $license_key );
	}

	/**
	 * Get pro status for active license.
	 * @return bool whether pro license is valid
	 */
	public static function is_pro_valid() {
		$available_license = static::get_instance()->current_license( static::get_instance()->use_cache );

		return $available_license && ! is_wp_error( $available_license ) && $available_license->is_valid();
	}
}
