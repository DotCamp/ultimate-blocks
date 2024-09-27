<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc;

use Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Graph\Graph_Column;

/**
 * Pros/Cons graph layout.
 */
class Pros_Cons_Graph_Layout {
	/**
	 * Block attributes
	 * @var array
	 */
	private $attributes;

	/**
	 * Class constructor.
	 *
	 * @param array $attributes block attributes
	 */
	public function __construct( $attributes ) {
		$this->attributes = $attributes;
	}

	/**
	 * Render layout columns.
	 * @return string columns HTML
	 */
	private function render_columns() {
		$label_translations = [
			'pros' => esc_html__( 'pros', 'ultimate-blocks-pro' ),
			'cons' => esc_html__( 'cons', 'ultimate-blocks-pro' ),
		];

		$columns_html = '';

		foreach ( $this->attributes['prosConsPositionData'] as $column_position => $column_type ) {
			$column_object = new Graph_Column( $label_translations[ $column_type ], $column_position, $column_type,
				$this->attributes );

			$columns_html .= $column_object->render();

		}

		return $columns_html;
	}


	/**
	 * Render layout.
	 * @return string HTML
	 */
	public function render() {
		$columns = $this->render_columns();

		return <<<RENDER
<div class="ub-pros-cons-graph-layout-wrapper">
	$columns
</div>
RENDER;
	}
}
