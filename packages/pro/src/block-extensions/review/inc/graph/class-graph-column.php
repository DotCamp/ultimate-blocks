<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Graph;

use Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Layout_Column_Base;

/**
 * Graph column layout.
 */
class Graph_Column extends Layout_Column_Base {
	/**
	 * Column relative position to its wrapper.
	 * @var string
	 */
	private $position;

	/**
	 * Column title.
	 * @var string
	 */
	private $title;

	/**
	 * Class constructor.
	 *
	 * @param string $title column title
	 * @param string $position column relative position to its wrapper
	 * @param string $column_type column type
	 * @param array $attributes block attributes
	 */
	public function __construct( $title, $position, $column_type, $attributes ) {
		parent::__construct( $column_type, $attributes );
		$this->position = $position;
		$this->title    = $title;
	}

	/**
	 * Calculate total value of graphs in column.
	 * @return int total value
	 */
	private function calculate_total_value() {
		$graph_content = $this->get_attribute( 'graphContent' );

		return array_reduce( $graph_content, function ( $carry, $tuple_data ) {
			$tuple_value = intval( $tuple_data[2], 10 );

			return $tuple_value + $carry;

		}, 0 );
	}

	/**
	 * Render graph content.
	 * @return string HTML content
	 */
	private function render_content() {
		$graph_content = $this->get_attribute( 'graphContent' );

		$content_html = '';

		foreach ( $graph_content as $index => $current ) {
			$id          = $current[0];
			$label       = $current[1];
			$value       = $current[2];
			$graph_color = $this->get_attribute( 'titleBg' );

			$content_line = new Graph_Content_Line( $id, $label, $value, $graph_color, $index );

			$content_html .= $content_line->render();
		}

		return $content_html;
	}


	/**
	 * Render layout.
	 * @return string HTML string
	 */
	public function render() {
		$wrapper_styles  = esc_attr( $this->get_attribute( 'graphWrapperStyle' ) );
		$column_type     = esc_attr( $this->column_type );
		$column_position = esc_attr( $this->position );

		$header_label_cell        = new Label_Cell( esc_attr( $this->title ),
			[ 'background-color' => $this->get_attribute( 'titleBg' ), 'color' => '#FFF' ] );
		$header_label_cell_render = $header_label_cell->render();

		$total_graph_value        = $this->calculate_total_value();
		$header_value_cell        = new Value_Cell( esc_attr( $total_graph_value ),
			[ 'background-color' => $this->get_attribute( 'contentBg' ) ] );
		$header_value_cell_render = $header_value_cell->render();

		$graph_content = $this->render_content();


		return <<<RENDER
<div class="ub-pros-cons-graph-column-table" data-column-type="$column_type" data-column-position="$column_position" style="$wrapper_styles">
	$header_label_cell_render
	$header_value_cell_render
	$graph_content
</div>
RENDER;
	}
}
