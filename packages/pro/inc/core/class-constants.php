<?php

class Ultimate_Blocks_Pro_Constants {

    const PLUGIN_VERSION = '3.2.3';

    const PLUGIN_NAME = 'ultimate-blocks-pro';

    /**
     * Get Plugin version
     *
     * @return string
     */
    public static function plugin_version() {
        return self::PLUGIN_VERSION;
    }

    /**
     * Get Plugin name
     *
     * @return string
     */
    public static function plugin_name() {
        return self::PLUGIN_NAME;
    }

    /**
     * Get Plugin URL
     *
     * @return string
     */
    public static function plugin_path() {
        return WP_PLUGIN_DIR . '/' . self::plugin_name() . '/';
    }

    /**
     * Get Plugin URL
     *
     * @return string
     */
    public static function plugin_url() {
        return plugin_dir_url( dirname( __FILE__ ) );
    }

    /**
     * Get Plugin TEXT DOMAIN
     *
     * @return string
     */
    public static function text_domain() {
        return 'ultimate-blocks-pro';
    }
}
