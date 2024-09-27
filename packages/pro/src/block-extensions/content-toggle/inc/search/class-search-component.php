<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Content_Toggle\Inc\Search;

use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Renderable;
use function esc_attr;
use function esc_html__;

class Search_Component implements I_Renderable {

	/**
	 * Search component related block attributes.
	 * @var boolean
	 */
	private $search_attributes;

	/**
	 * Class constructor.
	 *
	 * @param array $search_attributes search related block attributes
	 */
	public function __construct( $search_attributes ) {
		$this->search_attributes = $search_attributes;
	}

	/**
	 * Get target attribute value.
	 *
	 * @param string $attr_id target attribute id
	 *
	 * @return mixed attribute value
	 */
	private function get_attribute_value( $attr_id ) {
		return $this->search_attributes[ $attr_id ];
	}

	/**
	 * Whether advanced controls are enabled for component or not.
	 * @return boolean status
	 */
	private function is_advanced_controls_enabled() {
		return $this->get_attribute_value( 'searchAdvancedControls' );
	}

	/**
	 * Render enabled toolbox items.
	 *
	 * @return string items HTML
	 */
	private function render_search_toolbox_items() {
		// by default, always render idle toolbox
		$current_item_ids = [ 'idle' ];

		if ( $this->is_advanced_controls_enabled() ) {
			$current_item_ids = array_merge( $current_item_ids, $this->get_attribute_value( 'searchInputFilters' ) );
		}

		$render_string = '';

		foreach ( $current_item_ids as $toolbox_item_id ) {
			$render_string .= Search_Input_Toolbox_Item_Factory::make( $toolbox_item_id );
		}

		return $render_string;
	}

	/**
	 * Prepare Base64 encoded JSON data for search component data HTML attribute.
	 * @return string data attribute
	 */
	private function search_component_data_attribute() {
		return base64_encode( json_encode( $this->search_attributes ) );
	}

	/**
	 * Render input side toolbox items.
	 * @return string toolbox items
	 */
	private function render_search_input_toolbox_items() {
		return Search_Input_Toolbox_Item_Factory::make( 'clear' ) . Search_Input_Toolbox_Item_Factory::make( 'busy' );
	}

	/**
	 * Render as HTML.
	 * @return string HTML content
	 */
	public function render() {
		$input_placeholder = esc_html__( 'Search...', 'ultimate-blocks-pro' );

		$toolbox_items_render        = $this->render_search_toolbox_items();
		$search_input_toolbox_render = $this->render_search_input_toolbox_items();
		$data_attributes             = esc_attr( $this->search_component_data_attribute() );

		return <<<RENDER
<div class="ub-content-toggle-search" data-search="$data_attributes">
	<div class="ub-content-toggle-search-component-wrapper">
		<div class="ub-content-toggle-search-input-wrapper">
			<input class="search-input" type="text" placeholder="$input_placeholder" />
			<div class="ub-content-toggle-search-input-toolbox">
				$search_input_toolbox_render
			</div>
		</div>
		<div class="ub-content-toggle-search-toolbox">
			$toolbox_items_render
		</div>
	</div>
	<div data-visibility="false" class="search-message">message area</div>
</div>
RENDER;
	}
}
