<?php
/**
 * PromoteInfo class.
 *
 * @package DotCamp\Promoter
 */

namespace DotCamp\Promoter;

/**
 * Promotion class.
 *
 * This class will be responsible for all individual promotion information.
 */
class Promotion {
	/**
	 * Name of plugin responsible for promotion.
	 *
	 * @var string
	 */
	public $promoter_plugin_name;

	/**
	 * ID of plugin responsible for promotion.
	 *
	 * @var string
	 */
	public $promoter_plugin_id;

	/**
	 * Name of plugin being promoted.
	 *
	 * @var string
	 */
	public $promotion_target_name;

	/**
	 * ID of plugin being promoted.
	 *
	 * @var string
	 */
	public $promotion_target_id;

	/**
	 * Description of the promotion.
	 *
	 * @var string
	 */
	public $description;

	/**
	 * Blocks to use for promotion.
	 *
	 * @var array
	 */
	public $blocks_to_use;

	/**
	 * Class constructor.
	 *
	 * @param string $promoter_plugin_name Name of plugin responsible for promotion.
	 * @param string $promoter_plugin_id ID of plugin responsible for promotion. This id is the entry file of the plugin.
	 * @param string $promotion_target_name Name of plugin being promoted.
	 * @param string $promotion_target_id ID of plugin being promoted. This id is the entry file of the plugin.
	 * @param string $description Description of the promotion.
	 * @param array  $blocks_to_use Blocks to use for promotion.
	 */
	public function __construct( $promoter_plugin_name, $promoter_plugin_id, $promotion_target_name, $promotion_target_id, $description, $blocks_to_use ) {
		$this->promoter_plugin_name  = $promoter_plugin_name;
		$this->promoter_plugin_id    = $promoter_plugin_id;
		$this->promotion_target_name = $promotion_target_name;
		$this->promotion_target_id   = $promotion_target_id;
		$this->description           = $description;
		$this->blocks_to_use         = $blocks_to_use;
	}
}
