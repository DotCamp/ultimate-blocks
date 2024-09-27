<?php

namespace Ultimate_Blocks_Pro\Inc\Core\Managers;

use Ultimate_Blocks_Pro\Inc\Common\Traits\Manager_Base_Trait;
use Ultimate_Blocks_Pro\Inc\Core\Helpers;
use function add_action;

/**
 * Settings menu manager.
 *
 * This manager will be responsible for any integration with plugin admin settings menus.
 */
class Settings_Menu_Manager {
	use Manager_Base_Trait;

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		add_action( 'ub/action/settings_menu_block_registry', [ $this, 'enqueue_block_registry' ] );

		add_filter( 'ub/filter/admin_settings_menu_data', [ $this, 'add_settings_menu_data' ], 10, 1 );

		add_action( 'ub/action/block_toggle_ajax_before_exist_check', [ $this, 'menu_block_status_toggle' ], 10, 2 );
	}

	/**
	 * Block status toggle operation hook callback.
	 *
	 * @param string $target_block_name target block name
	 * @param boolean $status status value
	 *
	 * @return void
	 */
	public function menu_block_status_toggle( $target_block_name, $status ) {
		Block_Status_Manager::update_block_status( $target_block_name, $status );
	}

	/**
	 * Add settings menu related data to client.
	 *
	 * @param array $data menu data
	 *
	 * @return array menu data
	 */
	public function add_settings_menu_data( $data ) {
		$pro_block_status_report = Block_Status_Manager::get_block_statuses();
		$pro_block_descriptions  = Pro_Block_Manager::get_instance()->get_registered_block_descriptions();

		// data compatibility operation for settings menu for block descriptions
		$pro_block_descriptions = array_map( function ( $desc ) {
			return [ $desc ];
		}, $pro_block_descriptions );


		// update status data for pro blocks
		$data['blocks']['statusData'] = array_merge( $data['blocks']['statusData'], $pro_block_status_report );

		// add pro block descriptions
		$data['blocks']['info'] = array_merge( $pro_block_descriptions, $data['blocks']['info'] );

		return $data;
	}

	/**
	 * Enqueue block registry files for settings menu.
	 * @return void
	 */
	public function enqueue_block_registry() {
		Helpers::enqueue_asset( 'inc/admin/js/ultimate-blocks-pro-admin.js', null, [], true );
	}
}
