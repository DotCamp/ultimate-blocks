<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Graph;

use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Renderable;

/**
 * Graph content line.
 */
class Graph_Content_Line implements I_Renderable {
	/**
	 * Content id.
	 * @var string
	 */
	private $id;

	/**
	 * Content label.
	 * @var string
	 */
	private $label;

	/**
	 * Content value.
	 * @var string
	 */
	private $value;

	/**
	 * Graph color.
	 * @var string
	 */
	private $graph_color;

	/**
	 * Content index.
	 * @var int
	 */
	private $content_index;

	/**
	 * Class constructor.
	 *
	 * @param string $id content id
	 * @param string $label content label
	 * @param string $value content value
	 * @param string $graph_color graph color
	 * @param string $content_index index
	 */
	public function __construct( $id, $label, $value, $graph_color, $content_index ) {
		$this->id            = $id;
		$this->label         = $label;
		$this->value         = $value;
		$this->graph_color   = $graph_color;
		$this->content_index = $content_index;
	}

	/**
	 * Generate HTML cell styles.
	 *
	 * @param string cell type
	 *
	 * @return array cell styles
	 */
	private function generate_cell_styles( $cell_type = 'label' ) {
		$index = $this->content_index + 1;

		return [ 'grid-area' => $cell_type . $index ];
	}

	/**
	 * Generate HTML cell class names.
	 * @return array class names
	 */
	private function generate_cell_class_names() {
		$class_names = [];

		if ( $this->content_index % 2 === 0 ) {
			$class_names[] = 'ub-graph-odd-row';
		}

		return $class_names;
	}

	/**
	 * Render as HTML.
	 * @return string HTML content
	 */
	public function render() {
		$label_cell          = new Label_Cell( $this->label, $this->generate_cell_styles(),
			$this->generate_cell_class_names() );
		$label_cell_rendered = $label_cell->render();

		$graph_cell          = new Graph_Cell( $this->value, $this->graph_color,
			$this->generate_cell_styles( 'value' ),
			$this->generate_cell_class_names() );
		$graph_cell_rendered = $graph_cell->render();

		return <<<RENDER
$label_cell_rendered
$graph_cell_rendered

RENDER;
	}
}
