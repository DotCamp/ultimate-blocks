<?php
/**
 * Handle Visibility control frontend.
 */
class Ultimate_Blocks_Animation {
    public function __construct() {
        add_filter("render_block", array($this, 'ub_render_animation'), 999, 2);
    }
    
    public function ub_render_animation($block_content, $block) {
        $block_name = isset($block['blockName']) ? esc_attr($block['blockName']) : "";
        if (strpos($block_name, 'ub/') !== 0) {
            return $block_content;
        }

        $attributes             = isset($block['attrs']) ? $block['attrs'] : array();
        $is_animation_selected  = !empty($attributes['selectedAnimation']) && $attributes['selectedAnimation'] !== "none";

        // Find the first HTML tag in the block content
        $first_tag_start_pos = strpos($block_content, '<');
        $first_tag_end_pos   = strpos($block_content, '>', $first_tag_start_pos);
        $first_tag           = substr($block_content, $first_tag_start_pos, $first_tag_end_pos - $first_tag_start_pos + 1);
        
        if ($is_animation_selected) {
            $classes = array("animated");
            $styles  = array();
            $is_animation_repeat = isset($attributes['animationRepeat']) ? esc_attr($attributes['animationRepeat']) : "repeat";

            if (isset($attributes['selectedAnimation'])) {
                $classes[] = esc_attr($attributes['selectedAnimation']);
            }
            if ($is_animation_repeat) {
                $classes[] = esc_attr($is_animation_repeat);
            } else {
                $classes[] = "repeat";
            }

            if ($is_animation_selected && isset($attributes['animationRepeatCount']) && $is_animation_repeat === "repeat") {
                $styles["--animate-repeat"] = esc_attr($attributes['animationRepeatCount']);
            }

            if (isset($attributes['animationDuration']) && is_numeric($attributes['animationDuration'])) {
                $styles["--animate-duration"] = esc_attr($attributes['animationDuration']) . "s";
            }

            if (isset($attributes['animationDelay']) && is_numeric($attributes['animationDelay'])) {
                $styles["--animate-delay"] = esc_attr($attributes['animationDelay']) . "s";
            }
            
            // Check if style attribute already exists
            if (preg_match('/style="([^"]*)"/i', $first_tag, $matches)) {
                // Append styles to existing style attribute
                $existing_styles  = rtrim($matches[1], '; '); // Remove trailing semicolon and spaces
                $style_attribute  = ' style="' . esc_attr($existing_styles) . ';';
                foreach ($styles as $key => $value) {
                    $style_attribute .= " " . esc_attr($key) . ":" . esc_attr($value) . ";";
                }
                $style_attribute .= '"';
                $first_tag_replaced = str_replace($matches[0], $style_attribute, $first_tag);
            } else {
                // Add new style attribute
                $style_attribute = ' style="';
                foreach ($styles as $key => $value) {
                    $style_attribute .= " " . esc_attr($key) . ":" . esc_attr($value) . ";";
                }
                $style_attribute .= '"';
                $first_tag_replaced = substr_replace($first_tag, $style_attribute, strlen($first_tag) - 1, 0);
            }

            $first_tag_replaced = preg_replace('/class="([^"]*)"/', 'class="' . esc_attr(implode(' ', $classes)) . ' $1"', $first_tag_replaced);

            $block_content = substr_replace($block_content, $first_tag_replaced, $first_tag_start_pos, $first_tag_end_pos - $first_tag_start_pos + 1);
        }

        return $block_content;
    }
}
new Ultimate_Blocks_Animation();
