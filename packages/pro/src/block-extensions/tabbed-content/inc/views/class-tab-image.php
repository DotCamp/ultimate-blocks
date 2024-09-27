<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Tabbed_Content\Inc\Views;

use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Renderable;
use function esc_attr;

class Tab_Image implements I_Renderable {

	/**
	 * Image.
	 * @var array
	 */
	private $image;

	/**
	 * Image width.
	 * @var int
	 */
	private $width;

	/**
	 * Image height.
	 * @var int
	 */
	private $height;

	/**
	 * Class constructor.
	 *
	 * @param array $image image
	 * @param string $width image width in px
	 * @param string $height image height in px
	 */
	public function __construct( $image, $width, $height ) {
		$this->image = $image;
		$this->width      = $width;
		$this->height      = $height;
	}

	/**
	 * Wrapper styles
	 * @return string
	 */
	private function prepare_wrapper_styles() {
		return sprintf( 'width: %1$s; height: %2$s', esc_attr( $this->width ), esc_attr( $this->height ) );
	}

	/**
	 * Render as HTML.
	 * @return string HTML content
	 */
	public function render() {
		$image              = $this->image;
		$wrapper_styles     = $this->prepare_wrapper_styles();
          $image_url          = $image['url'];

		return <<<RENDER
<div class="ub-pro-tab-title-image" style="$wrapper_styles">
	<figure><img src="$image_url" /></figure>
</div>
RENDER;
	}
}
