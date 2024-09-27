<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Graph;

/**
 * Graph cell.
 */
class Graph_Cell extends Value_Cell {
	/**
	 * Graph related style names.
	 * @var string[]
	 */
	private $graph_class_names = [ 'ub-graph-cell' ];

	/**
	 * Graph value.
	 * @var int
	 */
	private $graph_value;

	/**
	 * Graph related color.
	 * @var string
	 */
	private $graph_color;

	/**
	 * Minimum value graph can take.
	 * @var int
	 */
	private $min_val = 1;

	/**
	 * Maximum value graph can take.
	 * @var int
	 */
	private $max_val = 10;

	/**
	 * Class constructor.
	 *
	 * @param int $graph_value graph value
	 * @param string $graph_color graph color
	 * @param array $style style array
	 * @param array $html_class_names HTML class names
	 */
	public function __construct( $graph_value, $graph_color, $style = [], $html_class_names = [] ) {
		$this->graph_value = intval( $graph_value, 10 );
		$this->graph_color = $graph_color;

		parent::__construct( '', $style, array_merge( $html_class_names, $this->graph_class_names ) );
	}

	/**
	 * Calculate graph width in percent.
	 * @return int width in percent
	 */
	private function calculate_graph_width() {
		$value_to_use = $this->graph_value;
		if ( $this->min_val > $value_to_use ) {
			$value_to_use = $this->min_val;
		}

		if ( $this->max_val < $value_to_use ) {
			$value_to_use = $this->max_val;
		}

		return ( $value_to_use * 100 ) / 10;
	}

	/**
	 * Render graph.
	 * @return string HTML string
	 */
	private function render_graph() {
		$style = sprintf( 'background-color: %s; width: %s', $this->graph_color, $this->calculate_graph_width() . '%' );

		return <<< RENDER_GRAPH
<div style="$style" class="ub-graph-line">
	$this->graph_value
</div>
RENDER_GRAPH;


	}

	/**
	 * Render as HTML.
	 * @return string HTML content
	 */
	public function render() {
		$this->update_children( $this->render_graph() );

		return parent::render();
	}

}
