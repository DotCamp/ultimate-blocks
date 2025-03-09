<?php
/**
 * Promotion blacklist ajax endpoint.
 *
 * @package DotCamp\Promoter
 */

namespace DotCamp\Promoter\Core;

use DotCamp\Promoter\Utils\AjaxEndpoint;
use function get_option;
use function update_option;
use function wp_send_json_success;

/**
 * Promotion blacklist ajax endpoint.
 *
 * This ajax endpoint will handle blacklist operations for selected promotions.
 */
class PromotionBlacklistAjaxEndpoint extends AjaxEndpoint {
	/**
	 * Option id to write blacklist.
	 *
	 * @var string
	 * @private
	 */
	private $option_id;

	/**
	 * Class constructor.
	 *
	 * @param string $action_name Action name.
	 * @param string $option_id Option id to write blacklist.
	 */
	public function __construct( $action_name, $option_id ) {
		$this->option_id = $option_id;
		parent::__construct( $action_name );
	}

	/**
	 * Required parameters for the endpoint.
	 *
	 * @return array Required parameters..
	 */
	public function required_paramaters() {
		return array( 'promotionTargetId' );
	}

	/**
	 * User capability required for the endpoint.
	 *
	 * @return string User capability.
	 */
	public function user_capability() {
		return 'manage_options';
	}

	/**
	 * Handle request.
	 *
	 * @param array $request_parameters Request parameters.
	 *
	 * @return void
	 */
	public function handle_request( $request_parameters ) {
		$target_plugin_id  = $request_parameters['promotionTargetId'];
		$current_blacklist = get_option( $this->option_id, array() );

		if ( ! in_array( $target_plugin_id, $current_blacklist, true ) ) {
			$current_blacklist[] = $target_plugin_id;
			update_option( $this->option_id, $current_blacklist );
		}

		wp_send_json_success( array( 'message' => 'Promotion blacklisted successfully.' ) );
	}
}
