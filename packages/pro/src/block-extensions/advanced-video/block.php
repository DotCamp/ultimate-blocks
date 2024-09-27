<?php


/**
 * Modify the rendered output of any block.
 *
 * @param string $block_content The normal block HTML that would be sent to the screen.
 * @param array  $block An array of data about the block, and the way the user configured it.
 */
function ubpro_advanced_video_filter($block_content,$block) {
    require_once plugin_dir_path(__FILE__) . '../../icons.php';
    	$attributes = $block['attrs'];
	if( !isset( $attributes['showChannelDetails'] ) ){
		return $block_content;
	}
	$channel_id = $attributes['channelId'];
	$icon_data = Ultimate_Blocks_Pro_IconSet::generate_fontawesome_icon('youtube');
	$channel_thumbnail = isset($attributes['channelDetails']['snippet']['thumbnails']['default']['url'])
	? esc_url($attributes['channelDetails']['snippet']['thumbnails']['default']['url'])
	: '';

	$channel_title = isset($attributes['channelDetails']['snippet']['title'])
	? esc_html($attributes['channelDetails']['snippet']['title'])
	: '';
	$channel_details_markup = sprintf('
		<div class="ub-advanced-video-channel-details">
		<div class="ub-advanced-video-channel-content-wrapper">
			<div class="ub-advanced-video-thumbnail-wrapper">
				<img src="%s" class="ub-advanced-video-thumbnail" />
			</div>
			<div class="ub-advanced-video-title-wrapper">
				<p class="ub-advanced-video-title">%s</p>
			</div>
		</div>
		<div class="ub-advanced-video-channel-subscribe">
			<a href="%7$s" class="ub-advanced-video-channel-subscribe-button">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0, 0, %d, %d">
					<path fill="currentColor" d="%s" />
				</svg>
				<span>%s</span>
			</a>
		</div>
		</div>
    ',
    esc_url($channel_thumbnail), //1
    esc_html($channel_title), //2
    esc_attr($icon_data[0]), //3
    esc_attr($icon_data[1]), //4
    esc_attr($icon_data[2]), //5
    esc_html(__("Subscribe", "ultimate-blocks-pro")), //6
    esc_url("https://www.youtube.com/channel/$channel_id?sub_confirmation=1") //7
    );

    return str_replace('</iframe>', '</iframe>' . $channel_details_markup, $block_content);
	
}