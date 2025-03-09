<?php

namespace Ultimate_Blocks_Pro\Inc\Core\Managers;

use function add_action;

/**
 * Class Admin_Notices_Manager
 *
 * Manager for handling admin notice messages.
 */
class Admin_Notices_Manager {
	/**
	 * Notice warning type.
	 */
	const WARNING = 'notice-warning';

	/**
	 * Notice info type.
	 */
	const INFO = 'updated notice';

	/**
	 * Error info type.
	 */
	const ERROR = 'notice-error';

	/**
	 * Add supplied callable to admin notices hook.
	 *
	 * @param callable $callable
	 */
	protected static function add_admin_action( $callable ) {
		add_action( 'admin_notices', $callable );
	}

	/**
	 * Generate HTML string for admin notice.
	 *
	 * @param string $message message
	 * @param string $type notice type, use defined notice type constants
	 *
	 * @return string notice html
	 */
	public static function generate_notice_html( $message, $type = self::INFO ) {
		return sprintf( '<div class="notice is-dismissible %1$s"><p>%2$s</p></div>', esc_attr( $type ), esc_html($message) );
	}

	/**
	 * Show admin notice.
	 *
	 * @param string $message message
	 * @param string $type notice type, use defined notice type constants
	 */
	public static function show_notice( $message, $type = self::INFO ) {
		static::add_admin_action( function () use ( $message, $type ) {
			echo static::generate_notice_html( esc_html($message), esc_attr($type) );
		} );
	}
}
