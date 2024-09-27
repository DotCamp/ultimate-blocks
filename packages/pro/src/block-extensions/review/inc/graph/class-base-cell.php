<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Graph;


use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Renderable;

/**
 * Graph base cell.
 */
class Base_Cell implements I_Renderable {
	/**
	 * HTML class names.
	 * @var array
	 */
	protected $class_names = [ 'ub-base-cell' ];

	/**
	 * Style array.
	 * @var array
	 */
	private $style_array;

	/**
	 * Children HTML content.
	 * @var string
	 */
	private $children;


	/**
	 * Class constructor.
	 *
	 * @param string $children_html HTML content of children elements
	 * @param array $style style array
	 * @param array $html_class_names HTML class names
	 */
	public function __construct( $children_html, $style = [], $html_class_names = [] ) {
		$this->style_array = $style;
		$this->class_names = array_merge( $this->class_names, $html_class_names );
		$this->children    = $children_html;
	}

	/**
	 * Update cell children.
	 *
	 * @param string $new_children new children HTML string
	 *
	 * @return void
	 */
	protected function update_children( $new_children ) {
		$this->children = $new_children;
	}

	/**
	 * Generate class names.
	 * @return string class names
	 */
	private function generate_class_names() {
		return trim( implode( " ", array_map( 'esc_attr', $this->class_names ) ) );
	}

	/**
	 * Generate HTML styles.
	 * @return string generated styles
	 */
	private function generate_styles() {
		$generated_style = '';

		foreach ( $this->style_array as $style_name => $style_value ) {
			$style_segment = sprintf( '%s: %s;', esc_attr( $style_name ), esc_attr( $style_value ) );

			$generated_style .= $style_segment;
		}

		return $generated_style;
	}


	/**
	 * Render as HTML.
	 * @return string HTML content
	 */
	public function render() {
		$generated_class_names = $this->generate_class_names();
		$generated_html_styles = $this->generate_styles();

		return <<<RENDER
<div class="$generated_class_names" style="$generated_html_styles">
	$this->children
</div>
RENDER;


	}
}
