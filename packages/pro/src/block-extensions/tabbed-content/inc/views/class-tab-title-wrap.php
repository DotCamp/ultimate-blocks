<?php

namespace Ultimate_Blocks_Pro\Src\Block_Extensions\Tabbed_Content\Inc\Views;

use DOMDocument;
use DOMElement;
use function esc_url;

/**
 * Tab title wrapper component.
 */
class Tab_Title_Wrap {

	/**
	 * Wrapper dom element.
	 * @var DOMElement
	 */
	private $wrapper;

	/**
	 * DOMDocument handler
	 *
	 * @var DOMDocument
	 */
	private $dom_document_handler;

	/**
	 * Class constructor.
	 *
	 * @param DOMElement $tab_title_wrapper_dom_document title wrapper dom document element
	 * @param DOMDocument $dom_document_handler DOMDocument handler instance
	 */
	public function __construct( $tab_title_wrapper_dom_document, $dom_document_handler ) {
		$this->dom_document_handler = $dom_document_handler;
		$this->wrapper              = $tab_title_wrapper_dom_document;

		$this->prepare_wrapper();
	}

	/**
	 * Prepare wrapper for extension functionality.
	 * @return void
	 */
	private function prepare_wrapper() {
		$current_classes = $this->wrapper->getAttribute( 'class' );
		$classes_to_add  = 'ub-tabbed-content-with-sub-title';

		$this->wrapper->setAttribute( 'class', implode( ' ', [ $current_classes, $classes_to_add ] ) );
	}

	/**
	 * Add sub text to title.
	 *
	 * @param string $content text content
	 *
	 * @return void
	 */
	public function add_sub_text( $content ) {
		$sub_title_component = new Tab_Sub_Title( $content );

		$sub_text_fragment = $this->dom_document_handler->createDocumentFragment();
		$sub_text_fragment->appendXML( $sub_title_component->render() );

		$this->wrapper->appendChild( $sub_text_fragment );
	}


	/**
	 * Add icon to tab.
	 *
	 * @param string $icon_name target icon name
	 * @param int $size icon size
	 *
	 * @return void
	 */
	public function add_icon( $icon_name, $size ) {
		$tab_title_icon_component = new Tab_Icon( $icon_name, $size );

		$icon_fragment = $this->dom_document_handler->createDocumentFragment();
		$icon_fragment->appendXML( $tab_title_icon_component->render() );

		$this->wrapper->insertBefore( $icon_fragment, $this->wrapper->firstChild );
	}
	/**
	 * Add image to tab.
	 *
	 * @param array $image target image
	 * @param string $width image width
	 * @param string $height image height
	 *
	 * @return void
	 */
	public function add_image( $image, $width, $height ) {
		$has_image = !empty($image) && !empty($image['url']); 

		if( !$has_image ){
			return "";
		}

		$tab_title_image_component = new Tab_Image( $image, $width, $height );

		$image_fragment = $this->dom_document_handler->createDocumentFragment();
		$image_fragment->appendXML( $tab_title_image_component->render() );

		$this->wrapper->appendChild( $image_fragment );
	}

	/**
	 * Change current title to a call-to-action tab.
	 *
	 * @param string $cta_link link url
	 *
	 * @return void
	 */
	public function change_to_cta( $cta_link ) {
		$cta_wrapper_fragment = $this->dom_document_handler->createDocumentFragment();

		$this->wrapper->setAttribute( 'data-ub-pro-cta', 'true' );

		// outerHTML of current wrapper
		$wrapper_outer_html = $this->dom_document_handler->saveHTML( $this->wrapper );

		$final_link = esc_url( $cta_link );

		$cta_xml = <<<RENDER
<div class="ultimate-blocks-pro-cta-wrap">
	<div class="ultimate-blocks-pro-cta-overlay">
		<a class="ultimate-blocks-pro-cta-link" href="$final_link" target="_blank"></a>
	</div>
	$wrapper_outer_html
</div>
RENDER;
		$cta_wrapper_fragment->appendXML( $cta_xml );

		// replace current wrapper with cta one
		$this->wrapper->parentNode->replaceChild( $cta_wrapper_fragment, $this->wrapper );

		// update wrapper with cta one
		$this->wrapper = $cta_wrapper_fragment;
	}
}
