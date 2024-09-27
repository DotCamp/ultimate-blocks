<?php

namespace Ultimate_Blocks_Pro\Inc\Core\Managers;

use Exception;
use Ultimate_Blocks_Pro\Inc\Common\Factory\Block_Render_Factory;
use Ultimate_Blocks_Pro\Inc\Common\Factory\Rest_Response_Factory;
use Ultimate_Blocks_Pro\Inc\Common\Traits\Manager_Base_Trait;
use WP_Error;
use WP_REST_Request;
use WP_REST_Server;
use function add_action;
use function add_filter;
use function apply_filters;
use function current_user_can;
use function esc_html__;
use function get_option;
use function register_rest_route;
use function register_setting;
use function rest_ensure_response;
use function update_option;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Saved styles manager.
 */
class Saved_Styles_Manager {
	use Manager_Base_Trait;

	/**
	 * Rest route prefix.
	 * @var string
	 */
	const ROUTE_PREFIX = 'ultimate-blocks/v1';

	/**
	 * Rest api route directory for saved styles manager.
	 * @var string
	 */
	const ROUTE_DIR = 'saved-styles';

	/**
	 * Options API options group name.
	 * @var string
	 */
	private $options_group = 'ub/saved_styles';


	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		add_action( 'rest_api_init', [ $this, 'register_rest_endpoints' ] );
		add_action( 'rest_api_init', [ $this, 'register_saved_styles_settings' ] );
		add_action( 'admin_init', [ $this, 'register_saved_styles_settings' ] );

		// queue frontend data after related settings are registered since we will be using those on frontend data
		add_action( 'admin_init', [ $this, 'add_frontend_data' ] );
	}

	/**
	 * Manager rest route.
	 * @return string rest route
	 */
	public final function rest_route() {
		return static::ROUTE_PREFIX . '/' . static::ROUTE_DIR;
	}

	/**
	 * Add frontend data related to saved styles.
	 */
	public function add_frontend_data() {
		$saved_styles_data = [
			'saved'   => $this->get_saved_styles(),
			'options' => [
				'restPath' => $this->rest_route()
			]
		];

		// ub-pro/filter/savedStylesFrontendData filter hook
		$saved_styles_data = apply_filters( 'ub-pro/filter/savedStylesFrontendData', $saved_styles_data );

		Frontend_Data_Manager::get_instance()->add_editor_data( [ 'savedStyles' => $saved_styles_data ] );
	}

	/**
	 * Register saved styles settings to Options API.
	 *
	 * @return void
	 */
	public function register_saved_styles_settings() {
		register_setting( $this->options_group, $this->options_group, [
			'show_in_rest'      => false,
			'default'           => [ 'styles' => null, 'defaultStyles' => null ],
			'sanitize_callback' => [ $this, 'settings_sanitization' ]
		] );
	}

	/**
	 * Sanitize supplied settings.
	 *
	 * @param array $updated_setting new settings
	 *
	 * @return array sanitized setting function to apply middleware
	 */
	public function settings_sanitization( $updated_setting ) {
		if ( ! is_null( $updated_setting['styles'] ) ) {
			$decoded_string = base64_decode( $updated_setting['styles'] );
			@json_decode( $decoded_string );

			if ( json_last_error() !== JSON_ERROR_NONE ) {
				$updated_setting['styles'] = get_option( $this->options_group )['styles'];
			}
		}

		if ( ! is_null( $updated_setting['defaultStyles'] ) ) {
			$decoded_string = base64_decode( $updated_setting['defaultStyles'] );
			@json_decode( $decoded_string );

			if ( json_last_error() !== JSON_ERROR_NONE ) {
				$updated_setting['defaultStyles'] = get_option( $this->options_group )['defaultStyles'];
			}
		}

		return $updated_setting;
	}

	/**
	 * Handle POST request.
	 *
	 * @param WP_REST_Request $request rest request instance
	 *
	 * @return string | WP_Error post request status
	 */
	private function handle_rest_post( $request ) {
		$params = $request->get_body_params();

		try {
			// update saved styles
			if ( isset( $params['styles'] ) ) {
				$current_option_values = get_option( $this->options_group );

				$updated_styles = apply_filters( 'ub-pro/filter/savedStylesSaveData', $params['styles'] );

				$current_option_values['styles'] = $updated_styles;

				$update_status = update_option( $this->options_group, $current_option_values );
				if ( $update_status ) {
					return rest_ensure_response( Rest_Response_Factory::generate_response( get_option( $this->options_group ) ) );
				}
				throw new Exception( esc_html__( 'invalid styles object', 'ultimate-blocks-pro' ) );
			}

			// update default styles
			if ( isset( $params['defaultStyles'] ) ) {
				$current_option_values                  = get_option( $this->options_group );
				$current_option_values['defaultStyles'] = $params['defaultStyles'];

				$update_status = update_option( $this->options_group, $current_option_values );

				if ( $update_status ) {
					return rest_ensure_response( Rest_Response_Factory::generate_response( get_option( $this->options_group ) ) );
				}

				throw new Exception( esc_html__( 'invalid default styles', 'ultimate-blocks-pro' ) );
			}
		} catch ( Exception $e ) {
			return Rest_Response_Factory::generate_response( null, 401, 'update_failed',
				$e->getMessage() );
		}

		return Rest_Response_Factory::generate_response( null, 401, 'invalid_request',
			esc_html__( 'invalid request body', 'ultimate-blocks-pro' ) );
	}

	/**
	 * Get/create saved styles from Options API.
	 *
	 * @param WP_REST_Request $request rest request instance
	 *
	 * @return string | WP_Error saved styles or error object
	 */
	public function saved_styles_rest( $request ) {
		$request_type = strtolower( $request->get_method() );

		switch ( $request_type ) {
			case 'get':
				$saved_styles = $this->get_saved_styles();

				return rest_ensure_response( Rest_Response_Factory::generate_response( $saved_styles ) );
			case 'post' :
				return $this->handle_rest_post( $request );
			default:
				return Rest_Response_Factory::generate_response( null, 401, 'invalid_method',
					esc_html__( 'invalid request method' ) );
		}
	}

	/**
	 * Check current rest request permissions.
	 *
	 * @return bool | WP_Error permission check status
	 */
	public function rest_endpoint_permission_check() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return rest_ensure_response( Rest_Response_Factory::generate_rest_unauthorized() );
		}

		return true;
	}

	/**
	 * Callback for getting rendered HTML string of block.
	 *
	 * @param WP_REST_Request $request request object
	 *
	 * @return string block HTML
	 */
	public function saved_style_preview_render( $request ) {
		$attributes     = json_decode( base64_decode( $request['attributes'] ), true );
		$preview_render = Block_Render_Factory::render_block( $request['block'], $attributes );

		return rest_ensure_response( Rest_Response_Factory::generate_response( $preview_render ) );
	}

	/**
	 * Arguments for render route endpoint.
	 * @return array render route arguments
	 */
	public function render_route_args() {
		$args = [];

		$args['block'] = [
			'description'       => esc_html__( 'block type', 'ultimate-blocks-pro' ),
			'type'              => 'string',
			'required'          => true,
			'validate_callback' => [ $this, 'validate_render_rest_parameters' ],
			'sanitize_callback' => [ $this, 'sanitize_render_rest_parameters' ],
		];

		$args['attributes'] = [
			'description'       => esc_html__( 'block properties', 'ultimate-blocks-pro' ),
			'type'              => 'string',
			'required'          => true,
			'validate_callback' => [ $this, 'validate_render_rest_parameters' ],
			'sanitize_callback' => [ $this, 'sanitize_render_rest_parameters' ],
		];

		return $args;
	}

	/**
	 * Sanitize render route parameters.
	 *
	 * @param mixed $value value
	 * @param WP_REST_Request $request request object
	 * @param string $param parameter key
	 *
	 * @return WP_Error|boolean sanitization result
	 */
	public function sanitize_render_rest_parameters( $value, $request, $param ) {
		switch ( $param ) {
			case 'block':
				return sanitize_text_field( $value );
			default:
				return $value;
		}
	}

	/**
	 * Validate render route parameters.
	 *
	 * @param mixed $value value
	 * @param WP_REST_Request $request request object
	 * @param string $param parameter key
	 *
	 * @return WP_Error|boolean validation result
	 */
	public function validate_render_rest_parameters( $value, $request, $param ) {
		switch ( $param ) {
			case 'block':
				if ( Block_Render_Factory::is_block_registered( $value ) ) {
					return true;
				}

				return Rest_Response_Factory::generate_response( null, 401, 'invalid_block_type',
					esc_html__( 'invalid block type supplied' ) );
			case 'attributes':
				$decoded_value = base64_decode( $value );
				@json_decode( $decoded_value );

				if ( json_last_error() !== JSON_ERROR_NONE ) {
					return Rest_Response_Factory::generate_response( null, 401, 'invalid_property',
						esc_html__( 'invalid property supplied' ) );
				}

				return true;
		}

		return Rest_Response_Factory::generate_response( null, 401, 'invalid_parameters',
			esc_html__( 'invalid parameters supplied for request' ) );
	}

	/**
	 * Get both user and plugin supplied saved styles.
	 *
	 * @final
	 * @return object saved styles object
	 */
	public final function get_saved_styles() {
		return get_option( $this->options_group );
	}

	/**
	 * Register manager related rest api endpoints and routes.
	 *
	 * @return void
	 */
	public function register_rest_endpoints() {
		register_rest_route( static::ROUTE_PREFIX, '/' . static::ROUTE_DIR, [
			'methods'             => 'GET, POST',
			'callback'            => [ $this, 'saved_styles_rest' ],
			'permission_callback' => [ $this, 'rest_endpoint_permission_check' ],
		] );

		register_rest_route( static::ROUTE_PREFIX,
			'/' . trailingslashit( static::ROUTE_DIR ) . 'render', [
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => [ $this, 'saved_style_preview_render' ],
				'permission_callback' => [ $this, 'rest_endpoint_permission_check' ],
				'args'                => $this->render_route_args()
			] );
	}
}
