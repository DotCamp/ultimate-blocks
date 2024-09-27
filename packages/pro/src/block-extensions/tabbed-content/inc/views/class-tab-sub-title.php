<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Tabbed_Content\Inc\Views;

use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Renderable;

/**
 * Secondary text title component.
 */
class Tab_Sub_Title implements I_Renderable {
	/**
	 * Text content.
	 * @var string
	 */
	private $text_content;

	/**
	 * Class constructor.
	 *
	 * @param string $text_content component text content
	 */
	public function __construct( $text_content ) {
		$this->text_content = $text_content;
	}

	/**
	 * Render as HTML.
	 *
	 * @return string HTML content
	 */
	public function render() {
		$component_text_title = esc_html__( $this->text_content );

		return <<<RENDER
<div class="tab-sub-title">
	$component_text_title
</div>
RENDER;
	}
}
