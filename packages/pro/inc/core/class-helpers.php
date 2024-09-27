<?php

namespace Ultimate_Blocks_Pro\Inc\Core;

use Ultimate_Blocks_Pro as NS_PRO;
use function trailingslashit;
use function wp_enqueue_script;
use function wp_enqueue_style;

/**
 * Helper functions.
 */
class Helpers {
	/**
	 * Check whether current environment is development for Ultimate Blocks Pro.
	 * @return boolean is development or not
	 */
	public static function is_development_env() {
		return filter_var( getenv( 'UB_PRO_DEBUG' ), FILTER_VALIDATE_BOOLEAN );
	}

	/**
	 * Enqueue assets.
	 *
	 * Only supports js and css files.
	 *
	 * @param String $file_path file path relative to plugin root, without trailing slash
	 * @param String $handler handler name, if not supplied a handler name will be generated based on filename and extension
	 * @param array $depends assets this one depends on
	 * @param boolean $in_footer whether to enqueue this asset in footer or header
	 *
	 * @return String | null name of the handler or null if operation is failed
	 */
	public static function enqueue_asset( $file_path, $handler = null, $depends = [], $in_footer = false ) {
		$target_file_path = trailingslashit( NS_PRO\ULTIMATE_BLOCKS_PRO_DIR ) . $file_path;
		$target_file_url  = trailingslashit( NS_PRO\ULTIMATE_BLOCKS_PRO_URL ) . $file_path;

		$file_info = pathinfo( $target_file_path );

		$handler_name  = is_null( $handler ) ? str_replace( '.', '_', $file_info['basename'] ) : $handler;
		$asset_version = static::is_development_env() ? filemtime( $target_file_path ) : NS_PRO\ULTIMATE_BLOCKS_PRO_VERSION;

		switch ( $file_info['extension'] ) {
			case 'js' :
				wp_enqueue_script( $handler_name, $target_file_url, $depends, $asset_version, $in_footer );

				return $handler_name;
			case 'css' :
				wp_enqueue_style( $handler_name, $target_file_url, $depends, $asset_version, 'all' );

				return $handler_name;
		}

		return null;
	}
}
