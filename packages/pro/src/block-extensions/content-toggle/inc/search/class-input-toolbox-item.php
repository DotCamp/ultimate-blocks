<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Content_Toggle\Inc\Search;

use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Renderable;
use Ultimate_Blocks_Pro\Src\Ultimate_Blocks_Pro_Icon_Set;

/**
 * Search input toolbox item component.
 */
class Input_Toolbox_Item implements I_Renderable {
	/**
	 * Toolbox icon name.
	 * @var string
	 */
	private $icon_name;

	/**
	 * Identification of toolbox item.
	 * @var string
	 */
	private $item_id;

	/**
	 * Toolbox title.
	 * @var string
	 */
	private $title;

	/**
	 * Toolbox icon size.
	 * @var int
	 */
	private $icon_size;

	/**
	 * Item active status.
	 * @var boolean
	 */
	private $is_active;

	/**
	 * Override icon html.
	 * @var  string | null
	 */
	private $override_icon_html;


	/**
	 * Class constructor.
	 *
	 * @param string $icon_name tool box icon name, this name should be compatible and available in FontAwesome icon library
	 * @param string $item_id toolbox id, this id will be the same as the functionality id which this toolbox item is assigned to
	 * @param string $title title of what this toolbox item actually does
	 * @param number $icon_size size of icon in px
	 * @param boolean $is_active whether this item is active on render or not
	 * @param string $override_icon_html icon html to use instead of icon
	 */
	public function __construct(
		$icon_name,
		$item_id,
		$title,
		$icon_size,
		$is_active = false,
		$override_icon_html = null
	) {
		$this->icon_name          = $icon_name;
		$this->item_id            = esc_attr( $item_id );
		$this->title              = esc_attr( $title );
		$this->icon_size          = $icon_size;
		$this->is_active          = esc_attr( $is_active ? 'true' : 'false' );
		$this->override_icon_html = wp_strip_all_tags( $override_icon_html );
	}

	/**
	 * Render toolbox icon.
	 *
	 * @return string icon HTML
	 */
	private function render_icon() {
		return empty( $this->override_icon_html ) && ! is_null( $this->icon_name ) ? Ultimate_Blocks_Pro_Icon_Set::generate_icon_html( $this->icon_name,
			$this->icon_size ) : wp_strip_all_tags( $this->override_icon_html );
	}

	/**
	 * Render as HTML.
	 * @return string HTML content
	 */
	public function render() {
		$icon_html = $this->render_icon();

		return <<<RENDER
<div data-active="$this->is_active" data-filter-type="$this->item_id" title="$this->title"  class="toolbox-item">
	$icon_html
</div>

RENDER;

	}
}
