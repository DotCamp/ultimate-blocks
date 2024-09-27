<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Tabbed_Content\Inc\Views;

use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Renderable;
use Ultimate_Blocks_Pro\Src\Ultimate_Blocks_Pro_Icon_Set;
use function esc_attr;

class Tab_Icon implements I_Renderable {

	/**
	 * Icon name.
	 * @var string
	 */
	private $icon_name;

	/**
	 * Icon size.
	 * @var int
	 */
	private $size;

	/**
	 * Class constructor.
	 *
	 * @param string $icon_name icon name
	 * @param int $size icon size in px
	 */
	public function __construct( $icon_name, $size ) {
		$this->icon_name = $icon_name;
		$this->size      = $size;
	}

	/**
	 * Wrapper styles
	 * @return string
	 */
	private function prepare_wrapper_styles() {
		return sprintf( 'width: %1$dpx; height: %1$dpx', esc_attr( $this->size ) );
	}

	/**
	 * Render as HTML.
	 * @return string HTML content
	 */
	public function render() {
		$icon_name      = $this->icon_name;
		$wrapper_styles = $this->prepare_wrapper_styles();
		$icon_element   = Ultimate_Blocks_Pro_Icon_Set::generate_icon_html( $this->icon_name, $this->size, null,
			'ultimate-blocks-icon-component-svg-base' );

		return <<<RENDER
<div class="ub-pro-tab-title-icon" style="$wrapper_styles">
	$icon_element
</div>
RENDER;
	}
}
