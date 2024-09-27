<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Basic_Card;

use Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Layout_Column_Base;
use function esc_attr;
use function esc_html;

/**
 * Pros/Cons column.
 */
class Pros_Cons_Column extends Layout_Column_Base {
	/**
	 * Column label.
	 * @var string
	 */
	private $label;

	/**
	 * Column position.
	 * @var string
	 */
	private $column_position;

	/**
	 * Class constructor.
	 *
	 * @param string $label column label
	 * @param string $column_type column type
	 * @param string $position column position
	 * @param array $attributes block attributes
	 */
	public function __construct( $label, $column_type, $position, $attributes ) {
		parent::__construct( $column_type, $attributes );
		$this->column_position = $position;
		$this->label           = esc_html( $label );
	}

	/**
	 * Title style.
	 * @return string title style
	 */
	private function title_style() {
		$sync_title_content_font_size = $this->get_attribute( 'syncTitleContentFontSize', false );
		$title_font_size              = $this->get_attribute( 'titleFontSize', false );

		if ( $sync_title_content_font_size ) {
			$content_font_size           = $this->get_attribute( 'fontSize', false );
			$content_to_title_percentage = $this->get_attribute( 'contentToTitleFontSizePercentage', false );
			$title_font_size             = ( $content_font_size / 100 ) * $content_to_title_percentage;
		}

		return sprintf( 'background-color: %s; font-size: %spx', esc_attr( $this->get_attribute( 'titleBg' ) ),
			esc_attr( $title_font_size ) );
	}

	/**
	 * Content style.
	 * @return string content style
	 */
	private function content_style() {
		return sprintf( 'background-color: %s', esc_attr( $this->get_attribute( 'contentBg' ) ) );
	}

	/**
	 * Render column content.
	 * @return string content HTML
	 */
	private function render_content() {
		$content_html = '';

		foreach ( $this->get_attribute( 'content' ) as $raw_content_line_data ) {
			$decoded_content_line_data = json_decode( $raw_content_line_data, true );
			$content_line_object       = new Pros_Cons_Content_Line( $decoded_content_line_data['text'],
				$decoded_content_line_data['id'],
				$this->get_attribute( 'titleBg' ),
				$this->get_attribute( 'icon' ), $this->get_attribute( 'iconSize', false ) );

			$content_html .= $content_line_object->render_line();
		}

		return $content_html;
	}

	/**
	 * Generate wrapper styles.
	 * @return string wrapper styles
	 */
	private function wrapper_styles() {
		$style_string = '';

		$advanced_control_status = $this->get_attribute( 'prosConsAdvancedControls', false );
		$adaptive_border_status  = $this->get_attribute( 'prosConsAdaptiveBorder', false );

		if ( $advanced_control_status && $adaptive_border_status ) {
			$title_bg_color = $this->get_attribute( 'titleBg' );
			$border_styles  = sprintf( 'border: 1px solid %s', esc_attr( $title_bg_color ) );
			$style_string   .= $border_styles;
		}

		return $style_string;
	}

	/**
	 * Render column element.
	 * @return string HTML string.
	 */
	public function render() {
		$generated_title_style    = $this->title_style();
		$generated_content_style  = $this->content_style();
		$rendered_content         = $this->render_content();
		$generated_wrapper_styles = $this->wrapper_styles();

		return <<<RENDER
<div data-pos="$this->column_position" style="$generated_wrapper_styles" data-column-type="$this->column_type" class="ub-pros-cons-column">
	<div class="column-title" style="$generated_title_style">
		<span>
			$this->label
		</span>
	</div>
	<div class="column-content" style="$generated_content_style">
		<table class="content-table">
			$rendered_content	
		</table>
	</div>
</div>
RENDER;
	}
}
