<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Content_Toggle\Inc\Search;

use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Factory;
use function esc_html__;

/**
 * Toolbox item factory.
 */
class Search_Input_Toolbox_Item_Factory implements I_Factory {

	/**
	 * Create toolbox item data in associative array format.
	 *
	 * @param string | null $icon_name icon name, if null is supplied, override_icon_html string will be used instead
	 * @param string $title title
	 * @param boolean $is_active active status
	 * @param string | null $override_icon_html instead of using icon, use HTML code supplied for toolbox item icon
	 *
	 * @return array assoc data array
	 */
	private static function create_toolbox_item_assoc_array(
		$icon_name,
		$title,
		$is_active = false,
		$override_icon_html = null
	) {
		return [
			'icon_name'          => $icon_name,
			'title'              => $title,
			'is_active'          => $is_active,
			'override_icon_html' => $override_icon_html
		];
	}

	/**
	 * Get factory blueprints.
	 *
	 * @param string $blueprint_id target blueprint id
	 *
	 * @return array | null blueprints array, null if no blueprint is found
	 */
	public static function get_blueprint( $blueprint_id ) {
		$all_blueprints = [
			'idle'      => static::create_toolbox_item_assoc_array( 'magnifying-glass', '', true ),
			'matchCase' => static::create_toolbox_item_assoc_array( null, esc_html__( 'match case' ), false, 'Cc' ),
			'clear'     => static::create_toolbox_item_assoc_array( 'square-xmark',
				esc_html__( 'clear input', 'ultimate-blocks-pro' ) ),
			'busy'      => static::create_toolbox_item_assoc_array( 'rotate',
				esc_html__( 'working', 'ultimate-blocks-pro' ) ),
		];

		if ( isset( $all_blueprints[ $blueprint_id ] ) ) {
			return $all_blueprints[ $blueprint_id ];
		}

		return null;
	}

	/**
	 * Factory make function.
	 *
	 * @param {string} $item_id target item id to be generated
	 *
	 * @return string item HTML, an empty string will be returned if no item is found with the given id
	 */
	public static function make( $item_id ) {
		$blueprint = static::get_blueprint( $item_id );

		if ( ! is_null( $blueprint ) ) {

			extract( $blueprint );

			$toolbox_item_instance = new Input_Toolbox_Item( $icon_name, $item_id, $title, 16, $is_active,
				$override_icon_html );

			return $toolbox_item_instance->render();
		}

		return '';
	}
}
