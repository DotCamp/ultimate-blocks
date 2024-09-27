<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Graph;

/**
 * Graph label cell.
 */
class Value_Cell extends Base_Cell {
	private $label_class_names = [ 'ub-graph-value-cell' ];

	/**
	 * Class constructor.
	 *
	 * @param string $children_html HTML content of children elements
	 * @param array $style style array
	 * @param array $html_class_names HTML class names
	 */
	public function __construct( $children_html, $style = [], $html_class_names = [] ) {
		parent::__construct( $children_html, $style, array_merge( $html_class_names, $this->label_class_names ) );
	}
}
