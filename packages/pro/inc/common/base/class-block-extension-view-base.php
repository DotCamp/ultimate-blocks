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
		libxml_use_internal_errors(true);

		$server_charset = get_bloginfo('charset');

		$content = mb_encode_numericentity($content, [0x80, 0xFFFF, 0, 0xFFFF], $server_charset);

		$status = @$handler->loadHTML(
			'<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html>' . $content,
			LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
		);

		libxml_clear_errors();

		if ($status) {
			return $handler;
		} else {
			return new WP_Error(
				500,
				esc_html__('Failed to convert block content to DOMDocument', 'ultimate-blocks-pro')
			);
		}
	}
}
