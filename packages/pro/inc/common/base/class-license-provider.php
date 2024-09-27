<?php

namespace Ultimate_Blocks_Pro\Inc\Common\Base;

use stdClass;
use Ultimate_Blocks_Pro\Inc\Common\Classes\Ub_License;
use WP_Error;
use function __;
use function is_wp_error;

/**
 * Abstract class for license providers.
 *
 * - Override $provider_version variable to distinguish different versions of same provider.
 */
abstract class License_Provider {

	/**
	 * License statuses.
	 * @var string[]
	 */
	const LICENSE_STATUS = [
		'NONE'    => 'none',
		'VALID'   => 'valid',
		'INVALID' => 'invalid',
		'EXPIRED' => 'expired',
	];

	/**
	 * Remote url types.
	 * @var string[]
	 */
	const REMOTE_OPERATION_TYPES = [
		'VALIDATION' => 'validation',
		'ACTIVATION' => 'activation',
	];

	/**
	 * Default remote request arguments.
	 * @var array
	 */
	public $default_remote_args = [
		'timeout'   => 30,
		'sslverify' => false
	];

	/**
	 * Provider version.
	 *
	 * Will be used to distinguish different versions of same provider.
	 * @var string
	 */
	public $provider_version = '1.0.0';

	/**
	 * Provider identification.
	 *
	 * @return string
	 */
	abstract public function get_provider_id();

	/**
	 * Populate a license instance with data from remote provider.
	 *
	 * @param Ub_License $license license instance
	 * @param Object $data remote provider response data
	 *
	 * @return Ub_License populated license instance
	 */
	abstract public function populate_license( $license, $data );

	/**
	 * Remote target urls for provider operations.
	 *
	 * If a string is returned, it will be used as target url for all operations.
	 *
	 * If an array is returned, it should use REMOTE_OPERATION_TYPES as keys and target urls as values.
	 *
	 * @return string || array remote target urls
	 */
	abstract public function provider_remote_target_urls();

	/**
	 * Generate license check request body.
	 *
	 * @param array $base_body base body object
	 *
	 * @return array license check request body
	 */
	abstract protected function generate_license_validation_req_body( $license_key, $base_body = [] );

	/**
	 * Generate license activation request body.
	 *
	 * @param array $base_body base body object
	 *
	 * @return array license activation request body
	 */
	abstract protected function generate_license_activation_req_body( $license_key, $base_body = [] );

	/**
	 * Get remote url based on provided type.
	 *
	 * @param string $type remote url type, should be one of REMOTE_OPERATION_TYPES
	 *
	 * @return string|WP_Error remote url, or WP_Error if an error is occurred
	 */
	private function get_remote_url( $type ) {
		$target_urls = $this->provider_remote_target_urls();

		// if a string is provided, use it as target url for all operations
		if ( is_string( $target_urls ) ) {
			return $target_urls;
		}

		if ( is_array( $target_urls ) && isset( $target_urls[ $type ] ) ) {
			return $target_urls[ $type ];
		}

		return new WP_Error( 'invalid_remote_url',
			__( "No remote url is found with the given operation type: [$type]", 'ultimate-blocks-pro' ) );
	}

	/**
	 * Post remote data to provider.
	 *
	 * @param string $target_url target url
	 * @param array $req_body request body
	 *
	 * @return WP_Error | object
	 */
	private function post_provider_remote( $target_url, $req_body ) {
		$remote_args = array_merge( [
			'body' => $req_body,
		], $this->default_remote_args );

		$response = wp_remote_post( $target_url, $remote_args );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		return json_decode( wp_remote_retrieve_body( $response ) );
	}

	/**
	 * Check license with remote provider.
	 *
	 * @param string $license_key license key to check
	 *
	 * @return WP_Error | object license check remote data
	 */
	protected function start_provider_remote_operation( $operation_type, $license_key ) {
		$target_url = $this->get_remote_url( $operation_type );

		// return WP_Error if no remote url is found
		if ( is_wp_error( $target_url ) ) {
			return $target_url;
		}

		// validate operation type
		if ( in_array( $operation_type, array_values( self::REMOTE_OPERATION_TYPES ) ) ) {
			$req_body_func = 'generate_license_' . $operation_type . '_req_body';

			if ( method_exists( $this, $req_body_func ) ) {
				$req_body = $this->$req_body_func( $license_key );

				return $this->post_provider_remote( $target_url, $req_body );
			}
		}

		return new WP_Error( 'invalid_remote_operation',
			__( "No remote operation is found with the given operation type: [$operation_type]",
				'ultimate-blocks-pro' ) );
	}

	/**
	 * Will generate base license object instance.
	 *
	 * @return Ub_License license object
	 */
	public function generate_license_raw() {
		return new Ub_License( $this->get_provider_id(), $this->provider_version );
	}

	/**
	 * Get associated license.
	 *
	 * @param string $license_key license key
	 *
	 * @return Ub_License | WP_Error license object, or WP_Error if an error is occurred
	 */
	public function get_license( $license_key = null ) {
		$resp_data = $this->start_provider_remote_operation( self::REMOTE_OPERATION_TYPES['VALIDATION'],
			$license_key );

		// handle error on response data
		if ( is_wp_error( $resp_data ) ) {
			return $resp_data;
		}

		// handle null response data
		if ( is_null( $resp_data ) ) {
			return new WP_Error( 'error_remote_get', __( 'Error while getting remote data', 'ultimate-blocks-pro' ) );
		}

		$resp_license = $this->generate_license_raw();
		$resp_license->set_key( $license_key );

		return $this->populate_license( $resp_license,
			$resp_data );
	}

	/**
	 * Activate given license key.
	 *
	 * @param string $license_key license key
	 *
	 * @return void
	 */
	public function activate_license( $license_key = null ) {
		$resp_data = $this->start_provider_remote_operation( self::REMOTE_OPERATION_TYPES['ACTIVATION'],
			$license_key );

		if ( is_wp_error( $resp_data ) ) {
			return $resp_data;
		}
	}
}
