<?php

namespace Ultimate_Blocks_Pro\Inc\Common\Base;

/**
 * Base class for standalone pro version blocks.
 */
abstract class Pro_Block {
	/**
	 * Main registration logic for the pro block.
	 *
	 * @return void
	 */
	abstract protected function register_logic();

	/**
	 * Get block name.
	 * @return string block name
	 */
	abstract public function get_block_name();

	/**
	 * Short description for the pro block.
	 * @return string block description
	 */
	abstract public function get_block_description();

	/**
	 * Register pro block.
	 * @return void
	 */
	public function register() {
		$this->register_logic();
	}
}
