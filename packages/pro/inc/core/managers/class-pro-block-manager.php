<?php

namespace Ultimate_Blocks_Pro\Inc\Core\Managers;

use Ultimate_Blocks_Pro\Inc\Common\Base\Pro_Block;
use Ultimate_Blocks_Pro\Inc\Common\Traits\Manager_Base_Trait;
use Ultimate_Blocks_Pro\Src\Blocks\Coupon\Coupon_Block;
use Ultimate_Blocks_Pro\Src\Blocks\Timeline\Timeline_Block;

/**
 * Pro block manager.
 *
 * Manager responsible for pro version block operations.
 */
class Pro_Block_Manager {
	use Manager_Base_Trait;

	/**
	 * Pro blocks to register.
	 * @var array
	 */
	const PRO_BLOCKS_BLUEPRINTS = [
		Coupon_Block::class,
		Timeline_Block::class
	];

	/**
	 * Registered block instances.
	 * @var array
	 */
	private $registered_pro_blocks = [];

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @return void
	 */
	protected function init_process() {
		add_action( 'init', [ $this, 'register_pro_blocks' ] );
	}

	/**
	 * Add registered blocks to registry.
	 *
	 * @param string $pro_block_instance block name
	 *
	 * @return void
	 */
	private function add_as_registered( $pro_block_instance ) {
		$this->registered_pro_blocks[] = $pro_block_instance;
	}

	/**
	 * Get registered block names.
	 * @return array registered block names
	 */
	public function get_registered_block_names() {
		return array_reduce( $this->registered_pro_blocks, function ( $carry, $current ) {
			$carry[] = $current->get_block_name();

			return $carry;
		}, [] );
	}

	/**
	 * Get registered block descriptions.
	 *
	 * @return array associative array with block names as keys and descriptions as values.
	 */
	public function get_registered_block_descriptions() {
		return array_reduce( $this->registered_pro_blocks, function ( $carry, $current ) {
			$carry[ $current->get_block_name() ] = $current->get_block_description();

			return $carry;
		}, [] );
	}

	/**
	 * Register pro blocks.
	 * @return void
	 */
	public function register_pro_blocks() {
		foreach ( self::PRO_BLOCKS_BLUEPRINTS as $pro_block_class ) {
			$class_extends = class_parents( $pro_block_class );

			if ( in_array( Pro_Block::class, $class_extends ) ) {
				$block_instance = new $pro_block_class;
				$block_instance->register();

				$this->add_as_registered( $block_instance );
			}
		}
	}
}
