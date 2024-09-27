<?php

class Ultimate_Blocks_Pro_Extension_Manager{

	protected $extension_dir_path;

	public function is_extension_enabled($extension_name) {
        $ub_extensions =  get_option( 'ultimate_blocks_extensions', false );
        if (!$ub_extensions) {
                return false;
        }

        $extension = null;
        foreach ($ub_extensions as $extensions) {
            if ($extensions['name'] === $extension_name) {
                $extension = $extensions;
                break;
            }
        }

        return $extension && $extension['active'];
    }
	/**
	 * Initialize and define the core functionality of the plugin.
	 */
	 public function __construct() {  
		 
		$extension_dir_path =  dirname(dirname(dirname(dirname(__FILE__)))) . '/src/extensions';
		if ( $this->is_extension_enabled('visibility-control')) {
			require_once $extension_dir_path . '/visibility-control/class-visibility-control.php';
		}
		if ( $this->is_extension_enabled('animation')) {
			require_once $extension_dir_path . '/animation/class-animation.php';
		}

	}

}
new Ultimate_Blocks_Pro_Extension_Manager();