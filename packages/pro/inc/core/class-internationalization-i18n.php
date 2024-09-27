<?php

namespace Ultimate_Blocks_Pro\Inc\Core;

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       http://ultimateblocks.com
 * @since      2.1.6
 *
 * @author     Ultimate Blocks
 */
class Internationalization_I18n {

	/**
	 * The text domain of the plugin.
	 *
	 * @since    2.1.6
	 * @access   protected
	 * @var      string    $text_domain    The text domain of the plugin.
	 */
	private $text_domain;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    2.1.6
	 * @param      string $plugin_text_domain       The text domain of this plugin.
	 */
	public function __construct( $plugin_text_domain ) {

		$this->text_domain = $plugin_text_domain;

	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    2.1.6
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			$this->text_domain,
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);
	}

}
