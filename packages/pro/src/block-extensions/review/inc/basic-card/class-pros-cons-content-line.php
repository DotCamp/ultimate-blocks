<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Basic_Card;

use Ultimate_Blocks_Pro\Src\Ultimate_Blocks_Pro_Icon_Set;
use Ultimate_Blocks_Pro_IconSet;

/**
 * Pros/Cons content line.
 */
class Pros_Cons_Content_Line {
	/**
	 * Line id.
	 * @var string
	 */
	private $id;

	/**
	 * Icon color.
	 * @var string
	 */
	private $icon_color;

	/**
	 * Icon name.
	 * @var string
	 */
	private $icon_name;

	/**
	 * Icon size.
	 * @var int
	 */
	private $icon_size;

	/**
	 * Content text.
	 * @var string
	 */
	private $content_text;

	/**
	 * Class constructor.
	 *
	 * @param string $content_text content text
	 * @param string $content_id content id
	 * @param string $icon_color icon color
	 * @param string $icon_name icon name
	 * @param string $icon_size icon size
	 */
	public function __construct( $content_text, $content_id, $icon_color, $icon_name, $icon_size ) {
		$this->id           = $content_id;
		$this->icon_color   = $icon_color;
		$this->icon_name    = $icon_name;
		$this->icon_size    = $icon_size;
		$this->content_text = $content_text;
	}

	/**
	 * Generate icon style.
	 *
	 * @return string icon style
	 */
	private function generate_icon_style() {
		return sprintf( 'color: %s', esc_attr( $this->icon_color ) );
	}

	/**
	 * Render content line icon.
	 *
	 * @return string icon HTML
	 */
	private function render_icon() {
		return Ultimate_Blocks_Pro_Icon_Set::generate_icon_html( $this->icon_name, $this->icon_size );
	}

	/**
	 * Render content line.
	 *
	 * @return string line HTML
	 */
	public function render_line() {
		$icon_style             = $this->generate_icon_style();
		$icon_html              = $this->render_icon();
		$sanitized_content_text = esc_html( $this->content_text );
		$sanitized_content_id   = esc_attr( $this->id );

		return <<<RENDER
<tr class="content-row" id="$this->id">
	<td>
		<div class="icon-component" style="$icon_style">
			$icon_html
		</div>
	</td>
	<td>
		<div class="content-line" id="$sanitized_content_id">
			<div class="content-text">
				$sanitized_content_text
			</div>
		</div>
	</td>
</tr>
RENDER;
	}
}
