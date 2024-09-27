<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc;

use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_Base;
use function add_filter;
use function esc_html__;

/**
 * Review block extension.
 */
class Review_Block_Extension extends Block_Extension_Base {
	/**
	 * Pros/cons column types
	 */
	const PROS_CONS_COLUMN_TYPES = [
		'PROS' => 'pros',
		'CONS' => 'cons',
	];

	/**
	 * Pros/cons layout types.
	 */
	const PROS_CONS_LAYOUT_TYPES = [
		'BASIC' => 'basic',
		'CARD'  => 'card',
		'GRAPH' => 'graph',
	];

	/**
	 * Class constructor.
	 */
	public function __construct() {
		add_filter( 'ultimate-blocks/filter/review_schema', [ $this, 'review_schema' ], 10, 2 );
	}

	/**
	 * Update review schema for review block.
	 *
	 * @param string $schema schema string
	 * @param array $attributes block attributes
	 *
	 * @return string updated schema
	 */
	public function review_schema( $schema, $attributes ) {
		if ( ! empty( $schema ) ) {
			if ( isset( $attributes['prosConsEnabled'] ) && $attributes['prosConsEnabled'] ) {
				// add extension attributes to block attributes
				$merged_attributes = array_merge( $this->generate_extension_attributes(), $attributes );

				$pros_cons_layout_type = $merged_attributes['prosConsLayout'];
				switch ( $pros_cons_layout_type ) {
					case self::PROS_CONS_LAYOUT_TYPES['BASIC']:
					case self::PROS_CONS_LAYOUT_TYPES['CARD']:
						$schema = $this->basic_card_review_schema( $schema, $merged_attributes );
						break;
					case self::PROS_CONS_LAYOUT_TYPES['GRAPH']:
						$schema = $this->graph_review_schema( $schema, $merged_attributes );
				}
			}
		}

		return $schema;
	}

	/**
	 * Transform graph contents to schema items.
	 *
	 * @param array $graph_content_tuples content tuples array
	 *
	 * @return array Pros_Cons_Schema_Item array
	 */
	private function graph_content_tuples_to_schema_items( $graph_content_tuples ) {
		$schema_items = [];

		foreach ( $graph_content_tuples as $content_index => $content_tuple ) {
			$schema_items[] = new Pros_Cons_Schema_Item( $content_index + 1, $content_tuple[1] );
		}

		return $schema_items;
	}

	/**
	 * Generate schema for pros/cons graph layout.
	 *
	 * @param string $schema schema string
	 * @param array $attributes block attributes
	 *
	 * @return string updated schema
	 */
	private function graph_review_schema( $schema, $attributes ) {
		$pros_graph_content = $attributes['prosGraphContent'];
		$cons_graph_content = $attributes['consGraphContent'];

		$pros_schema_items = $this->graph_content_tuples_to_schema_items( $pros_graph_content );
		$cons_schema_items = $this->graph_content_tuples_to_schema_items( $cons_graph_content );

		$pros_schema_string = $this->generate_schema( $pros_schema_items,
			Pros_Cons_Notes_Schema::PROS_CONS_NOTE_TYPE['PROS'] );
		$cons_schema_string = $this->generate_schema( $cons_schema_items,
			Pros_Cons_Notes_Schema::PROS_CONS_NOTE_TYPE['CONS'] );

		return $this->add_to_main_schema( [ $pros_schema_string, $cons_schema_string ], $schema );
	}

	/**
	 * Add schema properties for pros/cons content.
	 *
	 * @param array $content_array Pros_Cons_Schema_Item array
	 * @param string $type pros/cons type, use Pros_Cons_Notes_Schema::PROS_CONS_NOTE_TYPE for available note types
	 *
	 * @return array generated pros/cons schema
	 */
	private function generate_schema(
		$content_array,
		$type = Pros_Cons_Notes_Schema::PROS_CONS_NOTE_TYPE['PROS']
	) {
		$schema_notes = new Pros_Cons_Notes_Schema( $type, $content_array );

		return $schema_notes->get_final_schema();
	}

	/**
	 * Transform basic/card json object strings to schema items.
	 * This function is compatible with stored item strings for basic/card layouts.
	 *
	 * @param array $content_json_array stored content array in json string
	 *
	 * @return array schema items array
	 */
	private function basic_card_object_to_schema_items( $content_json_array ) {
		$schema_items = [];
		foreach ( $content_json_array as $item_index => $content_json ) {
			$content_assoc_arr = json_decode( $content_json, true );
			$schema_items[]    = new Pros_Cons_Schema_Item( $item_index + 1, $content_assoc_arr['text'] );
		}

		return $schema_items;
	}

	/**
	 * Add generated notes schema to main.
	 *
	 * @param array $schema_notes Pros_Cons_Notes_Schema array
	 * @param string $main_schema target schema string
	 *
	 * @return string updated schema string
	 */
	private function add_to_main_schema( $schema_notes, $main_schema ) {
		$matches = [];
		preg_match( '/{(.+)}/s', $main_schema, $matches );

		if ( $matches[1] ) {
			// $schema_notes_joined = implode( ',', $schema_notes );
			$schema_count = count($schema_notes);
			$final_schema_notes = '';
			for ($i=0; $i < $schema_count; $i++) { 
				$current_schema = $schema_notes[$i];
				if(isset($current_schema['positiveNotes'])){
					$final_schema_notes .= sprintf('"positiveNotes":%s', str_replace( "\'", "'", json_encode( $current_schema['positiveNotes'] )));
				}
				if(isset($current_schema['negativeNotes'])){
					$final_schema_notes .= sprintf(',"negativeNotes":%s', str_replace( "\'", "'", json_encode( $current_schema['negativeNotes'] )));
				}
			}
			$main_schema         = sprintf( '{%s,%s}', $matches[1], $final_schema_notes );
		}

		return $main_schema;
	}

	/**
	 * Add schema properties for basic and card layouts for pros/cons
	 *
	 * @param string $schema schema string
	 * @param array $attributes block attributes
	 *
	 * @return string updated schema
	 */
	private function basic_card_review_schema( $schema, $attributes ) {
		$pros_content = $attributes['prosContent'];
		$cons_content = $attributes['consContent'];

		$pros_schema_items = $this->basic_card_object_to_schema_items( $pros_content );
		$cons_schema_items = $this->basic_card_object_to_schema_items( $cons_content );

		$pros_schema_string = $this->generate_schema( $pros_schema_items,
			Pros_Cons_Notes_Schema::PROS_CONS_NOTE_TYPE['PROS'] );
		$cons_schema_string = $this->generate_schema( $cons_schema_items,
			Pros_Cons_Notes_Schema::PROS_CONS_NOTE_TYPE['CONS'] );

		return $this->add_to_main_schema( [ $pros_schema_string, $cons_schema_string ], $schema );
	}

	/**
	 * Block type of extension.
	 * @return string block type
	 */
	public function get_block_type() {
		return 'ub/review';
	}

	/**
	 * Generate empty pros/cons content for frontend.
	 * @return string empty content
	 */
	private function generate_empty_content() {
		return json_encode( [
			'id'   => uniqid(),
			'text' => ''
		] );
	}

	/**
	 * Extra extension data for editor.
	 *
	 * Override this method to add extra data.
	 * @return array|null extra extension data
	 */
	public function extension_editor_extra_data() {
		return [
			'prosConsLayoutTypes' => self::PROS_CONS_LAYOUT_TYPES,
			'prosConsColumnTypes' => self::PROS_CONS_COLUMN_TYPES
		];
	}

	/**
	 * Extension related translations.
	 *
	 * Override this method to add those translations.
	 * @return array translations associated array
	 */
	public function extension_translations() {
		return [
			self::PROS_CONS_LAYOUT_TYPES['BASIC'] => esc_html__( 'Basic', 'ultimate-blocks-pro' ),
			self::PROS_CONS_LAYOUT_TYPES['CARD']  => esc_html__( 'Card', 'ultimate-blocks-pro' ),
			self::PROS_CONS_LAYOUT_TYPES['GRAPH'] => esc_html__( 'Graph', 'ultimate-blocks-pro' ),
			self::PROS_CONS_COLUMN_TYPES['PROS']  => esc_html__( 'Pros', 'ultimate-blocks-pro' ),
			self::PROS_CONS_COLUMN_TYPES['CONS']  => esc_html__( 'Cons', 'ultimate-blocks-pro' ),
		];
	}

	/**
	 * Extension attributes.
	 *
	 * These are extra block attributes required for extension functionality.
	 * @return array|null
	 */
	public function extension_attributes() {
		return [
			'prosConsEnabled'                  => static::generate_attribute_value( false, 'boolean' ),
			'prosConsColumnMinWidth'           => static::generate_attribute_value( 370, 'number' ),
			'prosConsColumnMinHeight'          => static::generate_attribute_value( 240, 'number' ),
			'prosTitleBg'                      => static::generate_attribute_value( '#4ADE80', 'string' ),
			'prosContentBg'                    => static::generate_attribute_value( '#DCFCE7', 'string' ),
			'consContentBg'                    => static::generate_attribute_value( '#FEE2E2', 'string' ),
			'consTitleBg'                      => static::generate_attribute_value( '#F87171', 'string' ),
			'prosContent'                      => static::generate_attribute_value( [ $this->generate_empty_content() ],
				'array' ),
			'consContent'                      => static::generate_attribute_value( [ $this->generate_empty_content() ],
				'array' ),
			'prosIcon'                         => static::generate_attribute_value( 'check', 'string' ),
			'consIcon'                         => static::generate_attribute_value( 'xmark', 'string' ),
			'iconSize'                         => static::generate_attribute_value( 20, 'number' ),
			'fontSize'                         => static::generate_attribute_value( 20, 'number' ),
			'syncIconFontSize'                 => static::generate_attribute_value( true, 'boolean' ),
			'syncTitleContentFontSize'         => static::generate_attribute_value( true, 'boolean' ),
			'contentToTitleFontSizePercentage' => static::generate_attribute_value( 110, 'number' ),
			'titleFontSize'                    => static::generate_attribute_value( 22, 'number' ),
			'prosConsAdvancedControls'         => static::generate_attribute_value( false, 'boolean' ),
			'prosConsPositionData'             => static::generate_attribute_value( [
				"left"  => "pros",
				"right" => "cons",
			], 'object' ),
			'prosConsLayout'                   => static::generate_attribute_value( self::PROS_CONS_LAYOUT_TYPES['CARD'],
				'string' ),
			'prosConsAdaptiveBorder'           => static::generate_attribute_value( false,
				'boolean' ),
			'bgColor'                          => static::generate_attribute_value( 'transparent', 'string' ),
			'fontColor'                        => static::generate_attribute_value( 'inherit', 'string' ),
			'prosGraphContent'                 => static::generate_attribute_value( [], 'array' ),
			'consGraphContent'                 => static::generate_attribute_value( [], 'array' ),
			'prosGraphWrapperStyle'            => static::generate_attribute_value( '', 'string' ),
			'consGraphWrapperStyle'            => static::generate_attribute_value( '', 'string' ),
			'prosTitle'                      	=> static::generate_attribute_value( 'Pros', 'string' ),
			'consTitle'                      	=> static::generate_attribute_value( 'Cons', 'string' ),
		];
	}

	/**
	 * Get render view for block extension.
	 *
	 * @return string | null view class or null to use base component render
	 */
	public function get_view() {
		return Review_Block_Extension_View::class;
	}

	/**
	 *
	 * Whether to generate attributes from tuples array instead of associative one.
	 * Override this function return value on extended classes for different attribute generation methods.
	 *
	 * @protected
	 *
	 * @return bool status
	 */
	protected function is_generating_attributes_from_tuples() {
		return false;
	}
}
