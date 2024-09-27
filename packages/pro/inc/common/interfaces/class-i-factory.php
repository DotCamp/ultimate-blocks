<?php

namespace Ultimate_Blocks_Pro\Inc\Common\Interfaces;

interface I_Factory {

	/**
	 * Get factory blueprints.
	 *
	 * @param string $blueprint_id target blueprint id
	 *
	 * @return array blueprints array
	 */
	public static function get_blueprint( $blueprint_id );

	/**
	 * Factory make function.
	 *
	 * @param {any} $options make options
	 *
	 * @return mixed output product
	 */
	public static function make( $options );
}
