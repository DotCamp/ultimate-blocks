<?php

namespace Ultimate_Blocks_Pro\Inc\Core\Managers;

use Ultimate_Blocks_Pro\Inc\Common\Traits\Manager_Base_Trait;
use function add_filter;
use function apply_filters;
use function wp_localize_script;

/**
 * Class for handling frontend data.
 */
class Frontend_Data_Manager {
	use Manager_Base_Trait;

	/**
	 * Editor data object name.
	 */
	const EDITOR_DATA_ID = 'ubProEditorData';

	/**
	 * Filter hook for editor data.
	 * @var string
	 */
	protected $editor_data_filter_hook = 'ub-pro/filter/editorData';

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		// nothing to do
	}

	/**
	 * Attach editor data to editor script.
	 *
	 * @param string $editor_script_slug editor file enqueue slug
	 *
	 * @return void
	 */
	public function attach_editor_data( $editor_script_slug ) {
		$editor_data = apply_filters( $this->editor_data_filter_hook, [] );

		wp_localize_script( $editor_script_slug, self::EDITOR_DATA_ID, $editor_data );
	}

	/**
	 * Add data to frontend editor.
	 *
	 * @param array $data data
	 *
	 * @return void
	 */
	public function add_editor_data( $data ) {
		add_filter( $this->editor_data_filter_hook, function ( $editor_data ) use ( $data ) {
			return array_merge_recursive( $editor_data, $data );
		} );
	}

	/**
	 * Add editor translation data.
	 *
	 * @param $translation_data
	 *
	 * @return void
	 */
	public function add_editor_translations( $translation_data ) {
		add_filter( $this->editor_data_filter_hook, function ( $editor_data ) use ( $translation_data ) {
			if ( ! isset( $editor_data['translations'] ) && is_array( $translation_data ) ) {
				$editor_data['translations'] = [];
			}

			if ( is_array( $translation_data ) ) {
				$editor_data['translations'] = array_merge( $editor_data['translations'], $translation_data );
			}

			return $editor_data;
		} );
	}
}
