<?php

/**
 * Render the expand portion block.
 *
 * @param string $content Block content.
 * @param array  $attributes Block attributes.
 * @return string Modified content.
 */
function ubpro_render_expand_portion_block($content, $attributes) {

	// Extract display type from attributes or use default
	$displayType = isset($attributes['displayType']) ? $attributes['displayType'] : '';

	// Check if display type is partial and fade is enabled
	if ($displayType === 'partial' && isset($attributes['fade']) && $attributes['fade'] === true) {
		$content = "<div class='ub-fade'>" . $content . "</div>";
	}
	return $content;
}