<?php

namespace Ultimate_Blocks_Pro\Inc\Common\Classes;


use WP_Upgrader_Skin;

class Quiet_Activator extends WP_Upgrader_Skin {


	/**
	 * @since 2.8.0
	 */
	public function header() {
		// keep it quiet...
	}

	/**
	 * @since 2.8.0
	 */
	public function footer() {
		// keep it quiet...
	}

	/**
	 * @param string $feedback Message data.
	 * @param mixed ...$args Optional text replacements.
	 *
	 * @since 2.8.0
	 * @since 5.9.0 Renamed `$string` (a PHP reserved keyword) to `$feedback` for PHP 8 named parameter support.
	 *
	 */
	public function feedback( $feedback, ...$args ) {
		// keep it quiet...
	}
}
