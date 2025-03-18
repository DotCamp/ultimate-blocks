<?php
use function Ultimate_Blocks\includes\is_undefined;

/**
 * Handle Visibility control frontend.
 */
class Ultimate_Blocks_Visibility_Control {
    public function __construct() {
        add_filter("render_block", array($this, 'ub_render_visibility_control'), 999, 2);
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_script'));
    }

    public function enqueue_frontend_script() {
        wp_enqueue_script(
            'ub-visibility-control-frontend-script',
            esc_url(plugins_url('visibility-control/front.js', dirname(__FILE__))),
            array(),
            esc_attr(Ultimate_Blocks_Pro_Constants::plugin_version()),
            true
        );
    }

    public function ub_render_visibility_control($content, $block) {
        // Check if the block name starts with 'ub/'
        $block_name = isset($block['blockName']) ? esc_attr($block['blockName']) : "";
        if (strpos($block_name, 'ub/') !== 0) {
            return $content;
        }

        $attrs                           = isset($block['attrs']) ? $block['attrs'] : array();
        $is_block_hide                   = isset($attrs['isBlockHide']) ? (bool) $attrs['isBlockHide'] : false;
        $hide_block_user_role            = isset($attrs['hideBlockUserRole']) ? array_map('esc_attr', (array) $attrs['hideBlockUserRole']) : array();
        $hide_block_from_role            = isset($attrs['hideBlockFromRole']) ? esc_attr($attrs['hideBlockFromRole']) : 'public';
        $hide_block_from_time            = isset($attrs['hideBlockFromTime']) ? esc_attr($attrs['hideBlockFromTime']) : "";
        $hide_block_to_time              = isset($attrs['hideBlockToTime']) ? esc_attr($attrs['hideBlockToTime']) : "";
        $hide_when_time_schedule_applied = isset($attrs['hideWhenTimeScheduleApplied']) ? (bool) $attrs['hideWhenTimeScheduleApplied'] : false;
        $is_schedule_enable              = isset($attrs['isScheduleEnable']) ? (bool) $attrs['isScheduleEnable'] : false;

        if ($is_block_hide) {
            return '';
        }

        $current_time    = esc_attr(date_i18n('Y-m-d H:i:s', current_time('timestamp')));
        $user_logged_in  = is_user_logged_in();

        if ($is_schedule_enable) {
            $data_attributes = sprintf(
                'data-hide-when-schedule-applied="%1$s" data-current-time="%2$s" data-hide-block-from-time="%3$s" data-hide-block-to-time="%4$s" data-is-schedule-enabled="%5$s"',
                esc_attr($hide_when_time_schedule_applied ? "true" : "false"),
                esc_attr($current_time),
                esc_attr($hide_block_from_time),
                esc_attr($hide_block_to_time),
                esc_attr($is_schedule_enable ? 'true' : 'false')
            );

            $content = preg_replace('/<(\w+)(.*?)>/', '<$1 $2 ' . $data_attributes . '>', $content, 1);
        }

        if ($hide_block_from_role === 'logged-in' && !$user_logged_in) {
            return "";
        } elseif ($hide_block_from_role === 'logged-out' && $user_logged_in) {
            return "";
        }

        if ($user_logged_in && $hide_block_from_role === 'user') {
            $current_user      = wp_get_current_user();
            $current_user_name = esc_attr($current_user->data->display_name);
            if (!empty($hide_block_user_role) && !in_array($current_user_name, $hide_block_user_role, true)) {
                return "";
            }
        } elseif (!$user_logged_in && $hide_block_from_role === 'user') {
            return "";
        }

        if ($user_logged_in && $hide_block_from_role === 'user-role') {
            $current_user      = wp_get_current_user();
            $current_user_role = isset($current_user->roles[0]) ? esc_attr($current_user->roles[0]) : '';
            if (!empty($hide_block_user_role) && !in_array(ucfirst($current_user_role), $hide_block_user_role, true)) {
                return "";
            }
        } elseif (!$user_logged_in && $hide_block_from_role === 'user-role') {
            return "";
        }

        return $content;
    }
}

new Ultimate_Blocks_Visibility_Control();
