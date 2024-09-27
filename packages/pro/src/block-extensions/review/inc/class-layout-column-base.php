<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc;


use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Renderable;

/**
 * Layout base abstract class for pros/cons block.
 */
abstract class Layout_Column_Base implements I_Renderable {
	/**
	 * @var string column type
	 */
	protected $column_type;

	/**
	 * @var array block attributes
	 */
	protected $attributes;

	/**
	 * Class constructor.
	 *
	 * @param string $column_type column type
	 * @param array $attributes block attributes
	 */
	public function __construct( $column_type, $attributes ) {
		$this->column_type = $column_type;
		$this->attributes  = $attributes;
	}

	/**
	 * Form attribute key name based on column type.
	 *
	 * @param string $attr_key attribute key name
	 *
	 * @return string attribute id
	 */
	protected function form_attribute_id( $attr_key ) {
		return $this->column_type . ucfirst( $attr_key );
	}

	/**
	 * Get attribute value.
	 *
	 * @param string $attr_key attribute key
	 * @param boolean $generate_key whether to generate attribute key based on column type
	 *
	 * @return mixed attribute value
	 */
	protected function get_attribute( $attr_key, $generate_key = true ) {
		$final_attr_key = $this->form_attribute_id( $attr_key );

		if ( ! $generate_key ) {
			$final_attr_key = $attr_key;
		}

		return $this->attributes[ $final_attr_key ];
	}
}
