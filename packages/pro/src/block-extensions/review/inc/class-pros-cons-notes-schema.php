<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc;

/**
 * Pros/cons structured data notes wrapper.
 */
class Pros_Cons_Notes_Schema {
	/**
	 * Wrapper schema key.
	 * @var string
	 */
	private $wrapper_key;

	/**
	 * Content items.
	 * @var array
	 */
	private $content_items;

	/**
	 * Notes schema types.
	 */
	const PROS_CONS_NOTE_TYPE = [
		'PROS' => 'positiveNotes',
		'CONS' => 'negativeNotes',
	];

	/**
	 * Class constructor.
	 *
	 * @param string $note_type type of note, use PROS_CONS_NOTE_TYPE for available types
	 * @param array $content_items Pros_Cons_Schema_Item array related to this note
	 */
	public function __construct( $note_type, $content_items ) {
		$this->wrapper_key   = $note_type;
		$this->content_items = $content_items;
	}

	/**
	 * Get schema array for notes.
	 * @return array schema array
	 */
	private function get_schema_array() {
		$content_item_schema_array = [];

		foreach ( $this->content_items as $schema_item ) {
			$content_item_schema_array[] = $schema_item->get_schema_array();
		}

		return [
			$this->wrapper_key => [
				"@type"		   => "ItemList",
				"itemListElement" => $content_item_schema_array
			]
		];
	}

	/**
	 * Get schema for note.
	 * @return array schema array
	 */
	public function get_final_schema() {
		$schema_array = $this->get_schema_array();

		return $schema_array;
	}
}
