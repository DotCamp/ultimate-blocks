<?php

namespace Ultimate_Blocks_Pro\Inc\Core\Freemius;

use stdClass;
use Ultimate_Blocks_Pro\Inc\Common\Base\License_Provider;
use Ultimate_Blocks_Pro\Inc\Common\Classes\Ub_License;
use Ultimate_Blocks_Pro as NS_PRO;
use function do_action;

/**
 * Freemius license provider.
 */
class Freemius_License_Provider extends License_Provider {

	/**
	 * Provider version.
	 *
	 * Will be used to distinguish different versions of same provider.
	 *
	 * For freemius, this is not the version of its SDK, but the version of this provider class.
	 *
	 * @var string
	 */
	public $provider_version = '1.0.0';

	/**
	 * Freemius license provider constructor.
	 */
	public function __construct() {
		$this->initialize_freemius();
	}

	/**
	 * Initialize freemius SDK.
	 * @return void
	 */
	private function initialize_freemius() {
		$this->freemius_instance();
	}

	/**
	 * Get freemius instance.
	 *
	 * If not instance is found, a new one will be created.
	 *
	 * @return object freemius instance
	 */
	private function freemius_instance() {
		global $ub_pro_fs;

		if ( ! isset( $ub_pro_fs ) ) {
			// Include Freemius SDK.
			require_once NS_PRO\ULTIMATE_BLOCKS_PRO_DIR . 'inc/libraries/freemius/start.php';
			$ub_pro_fs = fs_dynamic_init( [
				'id'               => '12651',
				'slug'             => 'ultimate-blocks-pro',
				'premium_slug'     => 'ultimate-blocks-pro',
				'type'             => 'plugin',
				'public_key'       => 'pk_16ad0320a87c5e7d61d7e5a474ed0',
				'is_premium'       => true,
				'is_premium_only'  => true,
				'has_paid_plans'   => true,
				'is_org_compliant' => false,
				'parent'           => [
					'id'         => '1798',
					'slug'       => 'ultimate-blocks',
					'public_key' => 'pk_bd3d3c8e255543256632fd4bb9842',
					'name'       => 'Ultimate Blocks',
				],
				'has_affiliation'  => 'selected',
				'menu'             => [
					'first-path' => 'plugins.php',
					'support'    => false,
					'account'    => false,
				],
			] );

			do_action( 'ub_pro_fs_loaded' );
		}

		return $ub_pro_fs;
	}

	/**
	 * Check license with remote provider.
	 *
	 * @param string $license_key license key to check
	 *
	 * @return WP_Error | object license check remote data
	 */
	protected function start_provider_remote_operation( $operation_type, $license_key ) {
		$ub_pro_fs  = $this->freemius_instance();
		$pro_status = $ub_pro_fs->is__premium_only() && $ub_pro_fs->can_use_premium_code();

		$resp_obj         = new stdClass();
		$resp_obj->status = $pro_status ? self::LICENSE_STATUS['VALID'] : self::LICENSE_STATUS['INVALID'];

		return $resp_obj;
	}


	/**
	 * Provider identification.
	 *
	 * @return string
	 */
	public function get_provider_id() {
		return 'freemius';
	}

	/**
	 * Populate a license instance with data from remote provider.
	 *
	 * @param Ub_License $license license instance
	 * @param Object $data remote provider response data
	 *
	 * @return Ub_License populated license instance
	 */
	public function populate_license( $license, $data ) {
		$license->set_status( $data->status );

		// since freemius is handling key operations itself, we can set a dummy key
		$license->set_key( '1234567890' );

		return $license;
	}

	/**
	 * Remote target urls for provider operations.
	 *
	 * Will be using freemius SDK for remote operations.
	 *
	 * If a string is returned, it will be used as target url for all operations.
	 *
	 * If an array is returned, it should use REMOTE_OPERATION_TYPES as keys and target urls as values.
	 *
	 * @return string || array remote target urls
	 */
	public function provider_remote_target_urls() {
		return '';
	}

	/**
	 * Generate license check request body.
	 *
	 * Will be using freemius SDK for remote operations.
	 *
	 * @param array $base_body base body object
	 *
	 * @return array license check request body
	 */
	protected function generate_license_validation_req_body( $license_key, $base_body = [] ) {
		return [];
	}

	/**
	 * Generate license activation request body.
	 *
	 * Will be using freemius SDK for remote operations.
	 *
	 * @param array $base_body base body object
	 *
	 * @return array license activation request body
	 */
	protected function generate_license_activation_req_body( $license_key, $base_body = [] ) {
		return [];
	}
}
