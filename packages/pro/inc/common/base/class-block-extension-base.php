<?php

namespace Ultimate_Blocks_Pro\Inc\Common\Base;

/**
 * Base class for block extensions.
 */
abstract class Block_Extension_Base {
	/**
	 * Whether to switch base block script with supplied one.
	 * @var bool status
	 */
	public $switch_block_script = false;

	/**
	 * Class constructor.
	 */
	public function __construct() {
		// nothing here...
	}

	/**
	 * Get render view for block extension.
	 *
	 * @return string | null view class or null to use base component render
	 */
	public abstract function get_view();

	/**
	 * Extra extension data for editor.
	 *
	 * Override this method to add extra data.
	 * @return array|null extra extension data
	 */
	public function extension_editor_extra_data() {
		return null;
	}

	/**
	 * Generate attribute value.
	 *
	 * @protected
	 * @final
	 *
	 * @param mixed $default_val attribute default value
	 * @param string $type type
	 *
	 * @return array attribute value
	 */
	protected final static function generate_attribute_value( $default_val, $type ) {
		return [
			'default' => $default_val,
			'type'    => $type,
		];
	}

	/**
	 * Transform tuples array into compatible associative attributes array.
	 *
	 * @protected
	 * @final
	 *
	 * @param array $attr_tuples_array tuples array, key => attribute name, value => [default_value, value type]
	 *
	 * @return array associative array
	 */
	protected final static function tuples_to_assoc_attributes( $attr_tuples_array ) {
		return array_reduce( array_keys( $attr_tuples_array ),
			function ( $carry, $current ) use ( $attr_tuples_array ) {
				$target_tuples     = $attr_tuples_array[ $current ];
				$carry[ $current ] = static::generate_attribute_value( $target_tuples[0], $target_tuples[1] );

				return $carry;
			}, [] );
	}

	/**
	 * Generate extension attributes compatible with block attributes.
	 *
	 * @final
	 *
	 * @return array extension attributes
	 */
	public final function generate_extension_attributes() {
		$extension_attributes = $this->get_registered_extension_attribute_data();

		return array_reduce( array_keys( $extension_attributes ),
			function ( $carry, $attr_key ) use ( $extension_attributes ) {
				$carry[ $attr_key ] = $extension_attributes[ $attr_key ]['default'];

				return $carry;
			}, [] );
	}

	/**
	 * Get extension attributes registered with block compatible format.
	 * This function will return the attributes with their default value and target type.
	 *
	 * @return array extension attribute data
	 */
	public final function get_registered_extension_attribute_data() {
		$extension_attributes = $this->extension_attributes();

		if ( ! is_array( $extension_attributes ) ) {
			$extension_attributes = [];
		}

		// generate the attributes from tuples instead of associative array
		if ( $this->is_generating_attributes_from_tuples() ) {
			$extension_attributes = static::tuples_to_assoc_attributes( $extension_attributes );
		}

		return $extension_attributes;
	}

	/**
	 * Block type of extension.
	 *
	 * @return string block type
	 */
	abstract public function get_block_type();

	/**
	 * Extension attributes.
	 *
	 * These are extra block attributes required for extension functionality.
	 *
	 * @return array|null extension attributes, null if no attribute will be supplied
	 */
	abstract public function extension_attributes();

	/**
	 * Extension related translations.
	 *
	 * Override this method to add those translations.
	 * @return array translations associative array
	 */
	public function extension_translations() {
		return [];
	}

	/**
	 * Whether to generate attributes from tuples array instead of associative one.
	 * Override this function return value on extended classes for different attribute generation methods.
	 *
	 * @protected
	 *
	 * @return bool status
	 */
	protected function is_generating_attributes_from_tuples() {
		return true;
	}

	/**
	 * Relative path to plugin source root for frontend scripts.
	 * @return null | string script path
	 */
	public function frontend_script_path() {
		return null;
	}

	/**
	 * Frontend script handler name.
	 * @return string | null handler name
	 */
	public function frontend_script_handler() {
		return null;
	}
}
