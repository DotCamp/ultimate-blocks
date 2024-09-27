<?php

namespace Ultimate_Blocks_Pro\Inc\Common\Factory;

// if called directly, abort the process
use WP_Block_Type_Registry;

if ( ! defined( 'WPINC' ) ) {
	die();
}


/**
 * Render factory for plugin blocks.
 *
 * This factory can be used for blocks whose `save` functionality is defined on server side instead of frontend.
 */
class Block_Render_Factory {

	/**
	 * Check availability of registered plugin block.
	 *
	 * This function will only check for plugin blocks.
	 *
	 * @return boolean availability status
	 */
	public static function is_block_registered( $block_type ) {
		$status = false;

		if ( preg_match( '/ub\/(\w+)/', $block_type ) ) {
			$status = WP_Block_Type_Registry::get_instance()->is_registered( $block_type );
		}

		return $status;
	}

	/**
	 * Render plugin block.
	 *
	 * @param string $block_type block type
	 * @param array $attributes block attributes
	 *
	 * @return string|null  string representation of rendered block HTML
	 */
	public static function render_block( $block_type, $attributes = [] ) {
		if ( static::is_block_registered( $block_type ) ) {
			return WP_Block_Type_Registry::get_instance()->get_registered( $block_type )->render( $attributes );
		}

		return null;

	}
}

