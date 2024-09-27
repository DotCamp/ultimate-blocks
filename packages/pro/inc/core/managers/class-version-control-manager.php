<?php

namespace Ultimate_Blocks_Pro\Inc\Core\Managers;

use Ultimate_Blocks_Pro\Inc\Common\Base\Version_Sync_Base;
use Ultimate_Blocks_Pro\Inc\Common\Traits\Manager_Base_Trait;
use Ultimate_Blocks_Pro as UB_PRO_NS;
use WP_Error;
use function add_filter;
use function is_wp_error;
use function wp_remote_get;
use function wp_remote_retrieve_body;

// if called directly, abort
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Version_Control_Manager.
 *
 * Pro addon version control manager.
 */
class Version_Control_Manager extends Version_Sync_Base {
	use Manager_Base_Trait;

	/**
	 * Freemius api base url.
	 */
	const FREEMIUS_API_BASE = 'https://api.freemius.com';

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		$this->subscribe_to_version_sync();

		add_filter( 'ub/filter/admin_settings_menu_data', [ $this, 'add_settings_menu_data' ], 20, 1 );
	}


	/**
	 * Add version control related data to settings menu frontend.
	 *
	 * @param array $data data
	 *
	 * @return array filtered data
	 */
	public function add_settings_menu_data( $data ) {
		$oldest_pro_version = $this->highest_lowest_version_available();
		$all_versions       = $data['versionControl']['versions'];

		$compatible_versions = array_filter( $all_versions, function ( $target_version ) use ( $oldest_pro_version ) {
			// since we are releasing a counter version for every base version, instead of checking all pro versions, we can compare the base plugin versions against the oldest pro version
			return version_compare( $target_version, $oldest_pro_version ? $oldest_pro_version : "", '>=' );
		} );

		$data['versionControl']['versions'] = $compatible_versions;

		return $data;
	}

	/**
	 * Get slug of plugin/addon used in its distribution API.
	 * @return string slug
	 */
	public function get_version_slug() {
		return 'ultimate-blocks-pro';
	}

	/**
	 * Parse version number from package url.
	 *
	 * @param string $package package url
	 *
	 * @return string|null version number
	 */
	public function parse_version_from_package( $package ) {
		$parsed_version = null;
		$match          = [];

		preg_match( '/.+\/(.+)\.zip/', $package, $match );

		if ( isset( $match[1] ) ) {
			$parsed_version_id = $match[1];
			$versions          = $this->plugin_versions();

			$parsed_version = array_reduce( $versions, function ( $carry, $version_info ) use ( $parsed_version_id ) {
				if ( $version_info['id'] === $parsed_version_id ) {
					$carry = $version_info['version'];
				}

				return $carry;
			}, null );
		}

		return $parsed_version;
	}

	/**
	 * Callback hook for version sync manager when a subscriber attempted an install operation.
	 *
	 * @param string $slug subscriber slug
	 * @param string $version version to install
	 *
	 * @return false|WP_Error false to permit install(i know, but it is what it is) or WP_Error to cancel it
	 */
	public function version_sync_logic( $slug, $version ) {
		// override this value for return values of separate version sync logic results
		$return_value = false;

		// only continue sync logic if install in questing belongs to base version of the plugin
		if ( $slug === 'ultimate-blocks' ) {
			// use generic sync logic
			$return_value = $this->generic_sync_logic( $slug, $version );
		}

		return $return_value;
	}

	/**
	 * Plugin specific logic for fetching versions and their info.
	 *
	 * Use plugin version for keys and info for their values. Use 'url' property key for download link.
	 * @return array|WP_Error versions array
	 */
	protected function get_plugin_versions() {
		$path         = $this->freemius_installs_base_path( '/updates.json' );
		$auth_headers = $this->prepare_freemius_auth_headers( $path );

		// using a trick of supplying minimum version of 1.0.0 to get all available versions
		$version_tags_api_url = $this->get_freemius_api_url( $path, [
			'version' => '1.0.0',
		] );

		$response = wp_remote_get( $version_tags_api_url, [
			'timeout' => 120,
			'headers' => $auth_headers
		] );

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$body_raw     = wp_remote_retrieve_body( $response );
		$decoded_body = (array) json_decode( $body_raw, true );

		if ( isset( $decoded_body['tags'] ) ) {
			return array_reduce( $decoded_body['tags'], function ( $carry, $version_info ) {
				if ( isset( $version_info['version'] ) ) {
					$carry[ $version_info['version'] ] = $version_info;
				}

				return $carry;
			}, [] );
		}

		return new WP_Error( 501,
			esc_html__( 'Problem with Freemius API, please try again later', 'ultimate-blocks-pro' ) );
	}

	/**
	 * Get Freemius api url.
	 *
	 * @param string $path slash prefixed path that will be combined with Freemius API base
	 * @param array $query_args an array of query args with keys as arg name and values as values
	 *
	 * @return string url
	 */
	private function get_freemius_api_url( $path, $query_args = [] ) {
		$url = self::FREEMIUS_API_BASE . $path;

		return add_query_arg( $query_args, $url );
	}

	/**
	 * Freemius api installs path base path.
	 *
	 * This function will form a base path for installs path with dynamic properties.
	 *
	 * @param string $path extra path that with slash prefixed to add to base path
	 *
	 * @return string installs base path
	 */
	private function freemius_installs_base_path( $path = '' ) {
		global $ub_pro_fs;

		return '/v1/installs/' . $ub_pro_fs->get_site()->id . $path;
	}

	/**
	 * Prepare a download path for given Freemius plugin version tag.
	 *
	 * @param string $version_tag Freemius plugin version tag.
	 *
	 * @return string download path
	 */
	private function prepare_freemius_download_path( $version_tag ) {
		return $this->freemius_installs_base_path( '/updates/' . $version_tag . '.zip' );
	}

	/**
	 * Prepare Freemius API authorization key.
	 *
	 * This function will only be generating valid authorization headers for 'installs' api path.
	 *
	 * @param string $path api path
	 *
	 * @return array authorization key
	 */
	private function prepare_freemius_auth_headers( $path ) {
		global $ub_pro_fs;

		$site         = $ub_pro_fs->get_site();
		$site_id      = $site->id;
		$content_type = '';
		$content_body = '';
		$public_key   = $site->public_key;
		$secret_key   = $site->secret_key;
		$date         = date( 'r' );

		$string_to_sign = <<<STS
GET
$content_type
$content_body
$date
$path
STS;

		$signature = str_replace( '=', '',
			strtr( base64_encode( hash_hmac( 'sha256', $string_to_sign, $secret_key ) ), '+/', '-_' ) );

		return [
			'date'          => $date,
			'authorization' => 'FS ' . $site_id . ':' . $public_key . ':' . $signature
		];
	}

	/**
	 * Plugin __FILE__
	 * @return string plugin file
	 */
	public function plugin_file() {
		return UB_PRO_NS\ULTIMATE_BLOCKS_PRO_PLUGIN_FILE;
	}

	/**
	 * Get text domain of the plugin.
	 *
	 * It will be used for ajax upgraders to identify our plugin since slug is not supplied in plugin info property of that upgrader skin.
	 * @return string
	 */
	public function get_text_domain() {
		return 'ultimate-blocks-pro';
	}

}
