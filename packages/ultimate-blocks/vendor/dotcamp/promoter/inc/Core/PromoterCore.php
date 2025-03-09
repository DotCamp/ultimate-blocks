<?php
/**
 * Promoter core class.
 *
 * @package DotCamp\Promoter
 */

namespace DotCamp\Promoter\Core;

use DotCamp\Promoter\Promotion;
use DotCamp\Promoter\Utils\AjaxEndpoint;
use function add_action;
use function get_option;

/**
 * Promoter core class.
 */
class PromoterCore {
	/**
	 * Editor script handle name.
	 *
	 * @var string
	 * @private
	 */
	private $editor_script_handle_name;

	/**
	 * Editor asset handler.
	 *
	 * @var EditorAssetHandler
	 * @private
	 */
	private $editor_asset_handler;

	/**
	 * Available promotions.
	 *
	 * @var Array<Promotion>
	 * @private
	 */
	private $promotions;

	/**
	 * Editor data object id.
	 *
	 * @var string
	 * @private
	 */
	private $editor_data_object_id = 'dotcampPromoterEditorData';

	/**
	 * Editor styles handle name.
	 *
	 * @var string
	 * @private
	 */
	private $editor_styles_handle_name;

	/**
	 * Blacklist ajax endpoint.
	 *
	 * @var AjaxEndpoint
	 * @private
	 */
	private $blacklist_ajax_endpoint;

	/**
	 * Blacklist option id.
	 *
	 * @var string
	 * @private
	 */
	private $blacklist_option_id;

	/**
	 * Install ajax endpoint.
	 *
	 * @var AjaxEndpoint
	 * @private
	 */
	private $install_ajax_endpoint;

	/**
	 * Class constructor.
	 *
	 * @param Array<Promotion>   $promotions Promotions.
	 * @param string             $editor_script_handle_name Editor script handle name.
	 * @param EditorAssetHandler $editor_asset_handler Editor asset handler.
	 * @param string             $editor_styles_handle_name Editor styles handle name.
	 * @param AjaxEndpoint       $blacklist_ajax_endpoint Blacklist ajax endpoint.
	 * @param string             $blacklist_option_id Blacklist option id.
	 * @param AjaxEndpoint       $install_ajax_endpoint Promotion install ajax endpoint.
	 */
	public function __construct( $promotions, $editor_script_handle_name, $editor_asset_handler, $editor_styles_handle_name, $blacklist_ajax_endpoint, $blacklist_option_id, $install_ajax_endpoint ) {
		$this->promotions                = $promotions;
		$this->editor_script_handle_name = $editor_script_handle_name;
		$this->editor_styles_handle_name = $editor_styles_handle_name;
		$this->editor_asset_handler      = $editor_asset_handler;
		$this->blacklist_ajax_endpoint   = $blacklist_ajax_endpoint;
		$this->blacklist_option_id       = $blacklist_option_id;
		$this->install_ajax_endpoint     = $install_ajax_endpoint;

		$this->initialize_ajax_endpoints();

		add_action( 'enqueue_block_editor_assets', array( $this, 'editor_assets' ) );
	}

	/**
	 * Initialize ajax endpoints.
	 *
	 * @return void
	 */
	private function initialize_ajax_endpoints() {
		$this->blacklist_ajax_endpoint->initialize_endpoint();
		$this->install_ajax_endpoint->initialize_endpoint();
	}

	/**
	 * Set editor related data for scripts.
	 *
	 * @return array Editor data.
	 */
	private function prepare_editor_data() {
		$promotions_data = array_reduce(
			$this->promotions,
			function ( $data, $promotion ) {
				$data[] = array(
					'promoterPluginId'  => $promotion->promoter_plugin_id,
					'promoterPlugin'    => $promotion->promoter_plugin_name,
					'promotionTarget'   => $promotion->promotion_target_name,
					'promotionTargetId' => $promotion->promotion_target_id,
					'description'       => $promotion->description,
					'blocksToUse'       => $promotion->blocks_to_use,
				);

				return $data;
			},
			array()
		);

		$ajax_data = array(
			'blacklist' => array(
				'action' => $this->blacklist_ajax_endpoint->get_action_name(),
				'nonce'  => $this->blacklist_ajax_endpoint->generate_nonce(),
				'url'    => $this->blacklist_ajax_endpoint->get_ajax_url(),
			),
			'install'   => array(
				'action' => $this->install_ajax_endpoint->get_action_name(),
				'nonce'  => $this->install_ajax_endpoint->generate_nonce(),
				'url'    => $this->install_ajax_endpoint->get_ajax_url(),
			),
		);

		return array(
			'promotions' => $promotions_data,
			'ajax'       => $ajax_data,
			'blacklist'  => get_option( $this->blacklist_option_id, array() ),
		);
	}

	/**
	 * Enqueue editor assets.
	 */
	public function editor_assets() {
		if ( current_user_can( 'manage_options' ) ) {
			$this->editor_asset_handler->enqueue_registered_asset( $this->editor_script_handle_name );
			$this->editor_asset_handler->enqueue_registered_asset( $this->editor_styles_handle_name );
			$this->editor_asset_handler->add_script_data( $this->editor_script_handle_name, $this->editor_data_object_id, $this->prepare_editor_data() );
		}
	}
}
