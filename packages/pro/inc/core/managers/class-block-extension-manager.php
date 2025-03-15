<?php
/**
 * Block extension manager.
 *
 * @package ultimate-blocks-pro
 */

namespace Ultimate_Blocks_Pro\Inc\Core\Managers;

use Ultimate_Blocks_Pro\Inc\Common\Base\Block_Extension_Base;
use Ultimate_Blocks_Pro\Inc\Common\Interfaces\I_Block_Extension_View;
use Ultimate_Blocks_Pro\Inc\Common\Traits\Manager_Base_Trait;
use Ultimate_Blocks_Pro\Src\Block_Extensions\Content_Toggle\Inc\Content_Toggle_Extension;
use Ultimate_Blocks_Pro\Src\Block_Extensions\Content_Toggle\Inc\Content_Toggle_Panel_Extension;
use Ultimate_Blocks_Pro\Src\Block_Extensions\Review\Inc\Review_Block_Extension;
use Ultimate_Blocks_Pro\Src\Block_Extensions\Tabbed_Content\Inc\Tabbed_Content_Extension;
use Ultimate_Blocks_Pro as NS;
use function add_action;
use function wp_dequeue_script;
use function wp_deregister_script;
use function wp_enqueue_script;

/**
 * Block extension manager.
 *
 * This manager class will work on classes extended from Block_Extension_Base.
 * Add extension classes to $block_extensions property and manager will handle them from there on.
 */
class Block_Extension_Manager {
	use Manager_Base_Trait;

	/**
	 * Block extensions to register.
	 *
	 * Will only work on classes extended from Block_Extension_Base.
	 *
	 * @private
	 * @var array
	 */
	private $block_extensions = array(
		Review_Block_Extension::class,
		Content_Toggle_Extension::class,
		Content_Toggle_Panel_Extension::class,
		Tabbed_Content_Extension::class,
	);

	/**
	 * Associated array for block extensions keys for block name and values for extension classes.
	 *
	 * This property will be populated by manager, DO NOT ADD ANY DEFAULT VALUES.
	 *
	 * @private
	 * @var array
	 */
	private $block_extensions_assoc = array();

	/**
	 * Main process that will be called during initialization of manager.
	 *
	 * @protected
	 *
	 * @return void
	 */
	protected function init_process() {
		$this->register_block_extensions();

		add_filter( 'render_block', array( $this, 'render_block_extension' ), 100, 3 );
	}

	/**
	 * Render block filter hook callback.
	 *
	 * @param String $block_content the block content about to be appended.
	 * @param array  $block the full block, including name and attributes.
	 *
	 * @return String block HTML string
	 */
	public function render_block_extension( $block_content, $block, $block_instance = null ) {
		$target_block_name        = $block['blockName'];
		$block_extension_instance = $this->get_registered_block_extension( $target_block_name );

		if ( ! is_null( $block_extension_instance ) ) {
			// enqueue client side extension script.
			if ( ! $block_extension_instance->switch_block_script ) {
				$this->enqueue_extension_frontend_script( $block_extension_instance );
			}

			// add extension attributes to base attributes.
			$block_attributes               = $block['attrs'];
			$generated_extension_attributes = $block_extension_instance->generate_extension_attributes();
			$block_attributes               = array_merge( $generated_extension_attributes, $block_attributes );

			$extension_view = $block_extension_instance->get_view();
			if ( ! is_null( $extension_view ) ) {
				// Block_Extension_Render_Interface should be implemented for extension views to operate.
				if ( in_array( I_Block_Extension_View::class, class_implements( $extension_view ), true ) ) {
					$extension_rendered_view = $extension_view::render( $block_content, $block_attributes, $block_instance );

					if ( ! is_null( $extension_rendered_view ) ) {
						return $extension_rendered_view;
					}
				}
			}
		}

		return $block_content;
	}

	/**
	 * Enqueue extension related frontend script.
	 *
	 * @private
	 *
	 * @param Block_Extension_Base $block_extension_instance block extension base.
	 *
	 * @return void
	 */
	private function enqueue_extension_frontend_script( $block_extension_instance ) {
		$script_path = $block_extension_instance->frontend_script_path();

		if ( ! is_null( $script_path ) ) {
			$file_path = path_join( NS\ULTIMATE_BLOCKS_PRO_DIR, $script_path );

			if ( file_exists( $file_path ) ) {
				$url_path = path_join( NS\ULTIMATE_BLOCKS_PRO_URL, $script_path );
				$version  = filemtime( $file_path );

				$overridden_handler_name = $block_extension_instance->frontend_script_handler();
				$handler_name            = is_null( $overridden_handler_name ) ? $block_extension_instance->get_block_type() . '-pro-extension' : $overridden_handler_name;

				wp_enqueue_script( $handler_name, $url_path, array(), $version, true );
			}
		}
	}

	/**
	 * Get registered block extension instance.
	 *
	 * @private
	 *
	 * @param string $block_name block name.
	 *
	 * @return null | Block_Extension_Base block extension, or null if none registered with supplied name
	 */
	private function get_registered_block_extension( $block_name ) {
		if ( isset( $this->block_extensions_assoc[ $block_name ] ) ) {
			return $this->block_extensions_assoc[ $block_name ];
		}

		return null;
	}

	/**
	 * Register block extensions.
	 *
	 * @private
	 *
	 * @return void
	 */
	private function register_block_extensions() {
		foreach ( $this->block_extensions as $block_extension ) {
			$parents = class_parents( $block_extension );

			if ( in_array( Block_Extension_Base::class, $parents, true ) ) {
				$extension_instance = new $block_extension();
				$this->add_extension_editor_data( $extension_instance );

				// save block extension instance.
				$this->block_extensions_assoc[ $extension_instance->get_block_type() ] = $extension_instance;

				// run additional extension related jobs.
				$this->additional_extension_jobs( $extension_instance );
			}
		}
	}

	/**
	 * Handle additional extension jobs before render operations.
	 *
	 * @private
	 *
	 * @param Block_Extension_Base $extension_instance extension instance.
	 *
	 * @return void
	 */
	private function additional_extension_jobs( $extension_instance ) {
		if ( $extension_instance->switch_block_script ) {
			$this->override_base_script( $extension_instance );
		}
	}

	/**
	 * Override base version script with extension one.
	 *
	 * @param Block_Extension_Base $extension_instance extension instance.
	 *
	 * @return void
	 */
	private function override_base_script( $extension_instance ) {
		$manager_context = $this;
		add_action(
			'wp_enqueue_scripts',
			function () use ( $extension_instance, $manager_context ) {
				$base_script_handler = $extension_instance->frontend_script_handler();

				if ( ! is_null( $base_script_handler ) ) {
					wp_dequeue_script( $base_script_handler );
					wp_deregister_script( $base_script_handler );

					// switch dequeued and deregistered script with extension one.
					$manager_context->enqueue_extension_frontend_script( $extension_instance );
				}
			},
			20
		);
	}

	/**
	 * Add extension related data to frontend editor.
	 *
	 * @private
	 *
	 * @param Block_Extension_Base $extension_instance extension instance.
	 *
	 * @return void
	 */
	private function add_extension_editor_data( $extension_instance ) {
		$extension_editor_data  = array();
		$block_type             = $extension_instance->get_block_type();
		$extension_attributes   = $extension_instance->get_registered_extension_attribute_data();
		$extra_data             = $extension_instance->extension_editor_extra_data();
		$extension_translations = $extension_instance->extension_translations();

		if ( is_array( $extension_attributes ) ) {
			$extension_editor_data['extensionAttributes'] = array(
				$block_type => $extension_attributes,
			);
		}

		if ( is_array( $extra_data ) ) {
			$extension_editor_data['extraData'] = array(
				$block_type => $extra_data,
			);
		}

		if ( is_array( $extension_translations ) && ! empty( $extension_translations ) ) {
			Frontend_Data_Manager::get_instance()->add_editor_translations( $extension_translations );
		}

		Frontend_Data_Manager::get_instance()->add_editor_data( $extension_editor_data );
	}
}
