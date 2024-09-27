<?php

namespace Ultimate_Blocks_Pro\Inc\Common\Classes;

use Ultimate_Blocks_Pro\Inc\Common\Base\License_Provider;

/**
 * License class.
 */
class Ub_License {

	/**
	 * License status.
	 * @var string
	 */
	private $status;

	/**
	 * Provider id.
	 * @var string
	 */
	private $provider_id;

	/**
	 * Provider version.
	 * @var string
	 */
	private $provider_version;

	/**
	 * License key.
	 * @var string
	 */
	private $key;

	/**
	 * License constructor.
	 *
	 * @param string $provider_id provider id
	 * @param string $provider_version provider version
	 */
	public function __construct( $provider_id, $provider_version ) {
		$this->provider_id      = $provider_id;
		$this->provider_version = $provider_version;
	}

	/**
	 * Get license key.
	 *
	 * @param bool $hide_key hide key
	 *
	 * @return string license key
	 */
	public function get_key( $hide_key = false ) {
		if ( $hide_key ) {
			$key_length     = strlen( $this->key );
			$visible_length = round( $key_length / 4 );

			return str_repeat( '*', $key_length - $visible_length ) . substr( $this->key, - $visible_length );
		}

		return $this->key;
	}

	/**
	 * Set license key.
	 *
	 * @param string $key license key
	 */
	public function set_key( $key ) {
		$this->key = $key;
	}

	/**
	 * Get license status.
	 * @return string status
	 */
	public function get_status() {
		return $this->status;
	}

	/**
	 * Set license status.
	 *
	 * @param string $status status
	 */
	public function set_status( $status ) {
		// validate status
		$final_status = in_array( $status,
			array_values( License_Provider::LICENSE_STATUS ) ) ? $status : License_Provider::LICENSE_STATUS['INVALID'];

		$this->status = $final_status;
	}

	/**
	 * License validation status.
	 * @return boolean license validation status
	 */
	public final function is_valid() {
		return $this->status === 'valid';
	}

	/**
	 * Get license provider id.
	 * @return string provider id
	 */
	public function get_provider_id() {
		return $this->provider_id;
	}

	/**
	 * Get provider version.
	 * @return string provider version
	 */
	public function get_provider_version() {
		return $this->provider_version;
	}
}
