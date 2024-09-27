<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc;

use function wp_filter_nohtml_kses;

/**
 * Constructed data schema for individual pros/cons schema item.
 */
class Pros_Cons_Schema_Item {
	/**
	 * Item position.
	 * @var int
	 */
	private $position;

	/**
	 * Item name.
	 * @var string
	 */
	private $name;

	/**
	 * Class constructor.
	 *
	 * @param int $position item position
	 * @param string $name item name
	 */
	public function __construct( $position, $name ) {
		$this->position = $position;
		$this->name     = $name;
	}

	/**
	 * Sanitize string for schema.
	 * @return string
	 */
	private function sanitize_string( $val ) {
		return str_replace("\'", "'", wp_filter_nohtml_kses($val));
	}

	/**
	 * Get schema array for item.
	 * @return array schema array
	 */
	public function get_schema_array() {
		return [
			'@type'    => 'ListItem',
			'position' => $this->position,
			'name'     => $this->sanitize_string( $this->name )
		];
	}
}
