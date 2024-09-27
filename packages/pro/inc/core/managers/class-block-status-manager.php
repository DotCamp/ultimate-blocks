<?php

namespace Ultimate_Blocks_Pro\Inc\Core\Managers;

use Ultimate_Blocks_Pro\Inc\Common\Traits\Manager_Base_Trait;
use function get_option;
use function rest_sanitize_boolean;
use function update_option;

/**
 * Manager responsible for active status operations of pro blocks.
 */
class Block_Status_Manager {
	use Manager_Base_Trait;

	/**
	 * Option name for status operations.
	 * @var string
	 */
	const STATUS_OPTION_NAME = 'ub-pro-block-status-option';

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		$this->add_status_data_to_editor();
	}

	/**
	 * Add status data to editor.
	 * @return void
	 */
	private function add_status_data_to_editor() {
		$status_data = [
			'block' => [
				'statusData' => self::get_block_statuses()
			]
		];

		Frontend_Data_Manager::get_instance()->add_editor_data( $status_data );
	}

	/**
	 * Generate status for target block.
	 *
	 * @param string $block_name target block name
	 * @param boolean $status block status
	 *
	 * @return array generated status assoc array
	 */
	public static function generate_status( $block_name, $status ) {
		return [
			'name'   => $block_name,
			'active' => $status
		];
	}

	/**
	 * Update block active status.
	 *
	 * @param string $block_name name of target block
	 * @param boolean $status active status
	 *
	 * @return void
	 */
	public static function update_block_status( $block_name, $status ) {
		$registered_pro_blocks = Pro_Block_Manager::get_instance()->get_registered_block_names();

		// check if target block is part of pro version
		if ( in_array( $block_name, $registered_pro_blocks ) ) {
			$current_status_list = self::get_block_statuses();

			$target_status_index = array_search( $block_name, array_column( $current_status_list, 'name' ) );

			if ( $target_status_index !== false ) {
				$current_status_list[ $target_status_index ]['active'] = rest_sanitize_boolean( $status );
				update_option( self::STATUS_OPTION_NAME, $current_status_list );
			}
		}
	}

	/**
	 * Get status of pro blocks.
	 *
	 * @return array status array
	 */
	public static function get_block_statuses() {
		$raw_status_report = get_option( self::STATUS_OPTION_NAME, [] );

		if ( ! is_array( $raw_status_report ) ) {
			$raw_status_report = [];
		}

		$registered_pro_blocks = Pro_Block_Manager::get_instance()->get_registered_block_names();

		// list pro block names in the report
		$in_report_block_names = array_column( $raw_status_report, 'name' );

		$final_report = array_merge( $raw_status_report, [] );

		// if a pro block is not already in the report, add it as active
		// this is a countermeasure for not toggled or new added pro blocks between updates
		foreach ( $registered_pro_blocks as $registered_block_name ) {
			if ( ! in_array( $registered_block_name, $in_report_block_names ) ) {
				$final_report[] = self::generate_status( $registered_block_name, true );
			}
		}

		return $final_report;
	}
}
