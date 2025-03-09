<?php
/**
 * Promoter main class.
 *
 * @package DotCamp\Promoter
 */

namespace DotCamp\Promoter;

use DotCamp\Promoter\Core\EditorAssetHandler;
use DotCamp\Promoter\Core\LibraryPaths;
use DotCamp\Promoter\Core\PromoterCore;
use DotCamp\Promoter\Core\Registry;
use DotCamp\Promoter\Utils\ArrayConfiguration;
use DotCamp\Promoter\Utils\PromoterAsset;
use DotCamp\Promoter\Core\PromotionBlacklistAjaxEndpoint;
use DotCamp\Promoter\Utils\AjaxEndpoint;
use DotCamp\Promoter\Core\PromotionInstallAjaxEndpoint;
use function is_plugin_active;

/**
 * Promoter bootstrap class.
 *
 * This class will be responsible for initializing the library.
 */
class Promoter {
	/**
	 * Library paths.
	 *
	 * @var LibraryPaths
	 * @private
	 */
	private $library_paths;

	/**
	 * Registry.
	 *
	 * @var Registry
	 * @private
	 */
	private $registry;

	/**
	 * Asset handler.
	 *
	 * @var EditorAssetHandler
	 * @private
	 */
	private $asset_handler;

	/**
	 * Class constructor.
	 *
	 * @param string                       $plugin_file Path to the main plugin file.
	 * @param Array<Promotion> | Promotion $promotions Promotions.
	 */
	public function __construct( $plugin_file, $promotions ) {
		$this->initialize_library( $plugin_file );

		$filtered_promotions = $this->filter_promotions( is_array( $promotions ) ? $promotions : array( $promotions ) );

		$ajax_endpoints = $this->generate_ajax_endpoints( $filtered_promotions );

		new PromoterCore( $filtered_promotions, $this->registry->get_config( 'frontend.editor_script.handle' ), $this->asset_handler, $this->registry->get_config( 'frontend.editor_styles.handle' ), $ajax_endpoints['blacklist'], $this->registry->get_config( 'ajax.promotion_black_list.option_id' ), $ajax_endpoints['install'] );
	}

	/**
	 * Generate ajax endpoints.
	 *
	 * @param Array<Promotion> $available_promotions Available promotions.
	 *
	 * @return Array<AjaxEndpoint> Generated ajax endpoints.
	 */
	private function generate_ajax_endpoints( $available_promotions ) {
		$blacklist_endpoint = new PromotionBlacklistAjaxEndpoint( $this->registry->get_config( 'ajax.promotion_black_list.action' ), $this->registry->get_config( 'ajax.promotion_black_list.option_id' ) );

		$install_endpoint = new PromotionInstallAjaxEndpoint( $this->registry->get_config( 'ajax.promotion_install.action' ), $available_promotions );

		return array(
			'blacklist' => $blacklist_endpoint,
			'install'   => $install_endpoint,
		);
	}

	/**
	 * Filter promotions.
	 *
	 * @param Array<Promotion> $unfiltered_promotions Unfiltered promotions.
	 *
	 * @return Array<Promotion> Filtered promotions.
	 */
	private function filter_promotions( $unfiltered_promotions ) {
		return $this->filter_promotions_by_active( $unfiltered_promotions );
	}

	/**
	 * Filter promotions by target plugin active status.
	 *
	 * @param Array<Promotion> $unfiltered_promotions Unfiltered promotions.
	 *
	 * @return Array<Promotion> Filtered promotions.
	 */
	private function filter_promotions_by_active( $unfiltered_promotions ) {
		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		return array_filter(
			$unfiltered_promotions,
			function ( $promotion ) {
				$promotion_target_id = $promotion->promotion_target_id;

				return ! is_plugin_active( $promotion_target_id );
			}
		);
	}

	/**
	 * Initialize the library.
	 *
	 * @param string $plugin_file Path to the main plugin file.
	 */
	private function initialize_library( $plugin_file ) {
		$this->library_paths = $this->initialize_library_paths( $plugin_file );
		$this->registry      = $this->initialize_registry();
		$this->asset_handler = $this->initialize_asset_handler();
	}

	/**
	 * Initialize the asset handler.
	 *
	 * This function will initialize the asset handler which will handle all js and css
	 * files for frontend.
	 */
	private function initialize_asset_handler() {
		$editor_core_script_config        = $this->registry->get_config( 'frontend.editor_script' );
		$editor_core_script_relative_path = $editor_core_script_config['path'];
		$editor_core_script_deps          = require $this->library_paths->dir_path( $editor_core_script_config['deps'] );

		// Main editor script asset.
		$editor_core_script_asset = new PromoterAsset(
			$this->library_paths->dir_path( $editor_core_script_relative_path ),
			$this->library_paths->url_path( $editor_core_script_relative_path ),
			$editor_core_script_config['handle'],
			$editor_core_script_deps['dependencies'],
			$editor_core_script_deps['version']
		);

		$editor_core_style_config = $this->registry->get_config( 'frontend.editor_styles' );
		$editor_core_style_asset  = new PromoterAsset(
			$this->library_paths->dir_path( $editor_core_style_config['path'] ),
			$this->library_paths->url_path( $editor_core_style_config['path'] ),
			$editor_core_style_config['handle'],
			array()
		);

		return new EditorAssetHandler( array( $editor_core_script_asset, $editor_core_style_asset ) );
	}

	/**
	 * Initialize the library paths.
	 *
	 * @param string $plugin_file Path to the main plugin file.
	 *
	 * @return LibraryPaths Initialized library paths.
	 */
	private function initialize_library_paths( $plugin_file ) {
		// Since our entry point is not in the root of the library, we need to calculate it.
		$library_abs_root_path = dirname( __DIR__ );

		return new LibraryPaths( $plugin_file, $library_abs_root_path );
	}

	/**
	 * Initialize registry.
	 *
	 * @return Registry Initialized registry.
	 */
	private function initialize_registry() {
		$core_configs = require $this->library_paths->dir_path( 'inc/Config/config_core.php' );

		return new Registry( new ArrayConfiguration( $core_configs ) );
	}
}
