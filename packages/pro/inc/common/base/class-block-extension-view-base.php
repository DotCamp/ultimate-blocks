<?php

namespace Ultimate_Blocks_Pro\Inc\Common\Base;

use DOMDocument;
use WP_Error;
use function esc_html__;

/**
 * Base class for block extension view.
 */
abstract class Block_Extension_View_Base {

	/**
	 * Prepare a DomDocument object based on provided HTML content string.
	 *
	 * @param string $content HTML content
	 *
	 * @return DOMDocument|WP_Error DomDocument on success, WP_Error on failure
	 */
	protected static final function get_dom_document( $content ) {
		$handler = new DOMDocument();

		$server_charset = get_bloginfo( 'charset' );
		$status         = @$handler->loadHTML( html_entity_decode( '<?xml encoding="UTF-8">' . $content, ENT_COMPAT, $server_charset ),
			LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD | LIBXML_NOERROR | LIBXML_NOWARNING );

		if ( $status ) {
			return $handler;
		} else {
			return new WP_Error( 500,
				esc_html__( 'failed to convert block content to DomDocument', 'ultimate-blocks-pro' ) );
		}
	}
}
