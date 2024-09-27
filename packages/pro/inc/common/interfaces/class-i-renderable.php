<?php

namespace Ultimate_Blocks_Pro\Inc\Common\Interfaces;

/**
 * Interface for renderable content
 */
interface I_Renderable {

	/**
	 * Render as HTML.
	 * @return string HTML content
	 */
	public function render();
}
