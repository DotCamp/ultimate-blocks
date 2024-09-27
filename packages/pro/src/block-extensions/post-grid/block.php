<?php
/**
 * Server-side rendering for the post grid block
 */


require_once dirname(dirname(__DIR__)) . '/ultimate-blocks-pro-styles-css-generator.php';

function ubpro_get_post_grid_styles( $attributes ) {
	$padding = Ultimate_Blocks_Pro\CSS_Generator\get_spacing_css( isset($attributes['padding']) ? $attributes['padding'] : array() );
	$margin = Ultimate_Blocks_Pro\CSS_Generator\get_spacing_css( isset($attributes['margin']) ? $attributes['margin'] : array() );
    $taxonomy_gradient =  isset($attributes['taxonomyBackgroundGradient']) ? $attributes['taxonomyBackgroundGradient'] : "";
    $number_pagination_background = !empty($attributes['paginationBackground']) ? $attributes['paginationBackground'] : $attributes['paginationGradient'];
    $load_more_gradient = isset($attributes['loadMoreBackgroundGradient']) ? $attributes['loadMoreBackgroundGradient'] : '';
    $load_more_pagination_background = !empty($attributes['loadMoreBackground']) ? $attributes['loadMoreBackground'] : $load_more_gradient;
    $load_more_border = Ultimate_Blocks_Pro\CSS_Generator\get_border_variables_css(
			isset($attributes['loadMoreBorder']) ? $attributes['loadMoreBorder'] : array(),
			'load-more'
    );
    $border_radius = array(
			"--ub-load-more-top-left-radius" => !empty( $attributes['loadMoreBorderRadius']['topLeft'] ) ? $attributes['loadMoreBorderRadius']['topLeft'] : "",
			"--ub-load-more-top-right-radius" => !empty( $attributes['loadMoreBorderRadius']['topRight'] ) ? $attributes['loadMoreBorderRadius']['topRight'] : "",
			"--ub-load-more-bottom-left-radius" => !empty( $attributes['loadMoreBorderRadius']['bottomLeft'] ) ? $attributes['loadMoreBorderRadius']['bottomLeft'] : "",
			"--ub-load-more-bottom-right-radius" => !empty( $attributes['loadMoreBorderRadius']['bottomRight'] ) ? $attributes['loadMoreBorderRadius']['bottomRight'] : "",
		);
    $load_more_color = isset($attributes['loadMoreColor']) ? $attributes['loadMoreColor'] : ''; 
    $pagination_type = isset($attributes['paginationType']) ? $attributes['paginationType'] : "number-pagination";
    $load_more_hover_background = isset($attributes['loadMoreHoverBackgroundGradient']) ? $attributes['loadMoreHoverBackgroundGradient'] : "";
    $load_more_hover_background = isset($attributes['loadMoreHoverBackgroundGradient']) ? $attributes['loadMoreHoverBackgroundGradient'] : "";

	$styles = array(
		'padding-top'         => isset($padding['top']) ? $padding['top'] : "",
		'padding-left'        => isset($padding['left']) ? $padding['left'] : "",
		'padding-right'       => isset($padding['right']) ? $padding['right'] : "",
		'padding-bottom'      => isset($padding['bottom']) ? $padding['bottom'] : "",
		'margin-top'         => !empty($margin['top']) ? $margin['top'] . " !important" : "",
		'margin-left'        => !empty($margin['left']) ? $margin['left'] . " !important" : "",
		'margin-right'       => !empty($margin['right']) ? $margin['right'] . " !important" : "",
		'margin-bottom'      => !empty($margin['bottom']) ? $margin['bottom'] . " !important" : "",
        "--ub-pagination-color" => 'number-pagination' === $pagination_type ?  $attributes['paginationColor'] : $load_more_color,
        "--ub-hover-pagination-color" => isset($attributes['loadMoreHoverColor'] ) ? $attributes['loadMoreHoverColor'] : "",
        "--ub-active-pagination-color" => $attributes['activePaginationColor'],
        "--ub-pagination-background" => 'number-pagination' === $pagination_type ? $number_pagination_background : $load_more_pagination_background,
        "--ub-active-pagination-background" => !empty($attributes['activePaginationBackground']) ? $attributes['activePaginationBackground'] : $attributes['activePaginationGradient'],
        "--ub-hover-pagination-background" => !empty($attributes['loadMoreHoverBackground']) ? $attributes['loadMoreHoverBackground'] : $load_more_hover_background,
        "--ub-post-grid-taxonomy-background"  => !empty($attributes['taxonomyBackgroundColor']) ? $attributes['taxonomyBackgroundColor'] : $taxonomy_gradient,
        "--ub-post-grid-taxonomy-color" => isset($attributes['taxonomyColor']) ? $attributes['taxonomyColor'] : "",
        "--ub-load-more-top-left-radius" => isset($attributes['loadMoreBorderRadius']['topLeft']) ? $attributes['loadMoreBorderRadius']['topLeft'] : "",
        "--ub-load-more-top-right-radius" => isset($attributes['loadMoreBorderRadius']['topRight']) ? $attributes['loadMoreBorderRadius']['topRight'] : "",
        "--ub-load-more-bottom-left-radius" => isset($attributes['loadMoreBorderRadius']['bottomLeft']) ? $attributes['loadMoreBorderRadius']['bottomLeft'] : "",
        "--ub-load-more-bottom-right-radius" => isset($attributes['loadMoreBorderRadius']['bottomRight']) ? $attributes['loadMoreBorderRadius']['bottomRight'] : "",
	);
    $styles = array_merge($styles, $load_more_border, $border_radius);

	return Ultimate_Blocks_Pro\CSS_Generator\generate_css_string( $styles );
}
function ubpro_query_post( $attributes ){
    /**
     * Global post object.
     * Used for excluding the current post from the grid.
     *
     * @var WP_Post
     */
    global $post;

	$page     = empty($_GET['ub-page']) ? 1 : (int) $_GET['ub-page'];
    $includedCategories = isset($attributes['categories']) && $attributes['categories'] != '' ? $attributes['categories'] :
                    (isset($attributes['categoryArray']) ?
                        join(',',array_map(function($c){return $c['id'];}, $attributes['categoryArray'])) : '');
    
    $excludedCategories = isset($attributes['excludedCategories']) ?
                join(',',array_map(function($c){return $c['id'];}, $attributes['excludedCategories'])) : '';
            
    /* Setup the query */
    $query = new WP_Query(array(
            'paged' => $page,
            'posts_per_page' => $attributes['amountPosts'],
            'post_status' => 'publish',
            'order' => $attributes['order'],
            'orderby' => $attributes['orderBy'],
            'cat' => $includedCategories,
            'category__not_in' => $excludedCategories,
            'post_type' => $attributes['postType'],
            'ignore_sticky_posts' => 1,
            'post__not_in' => array(absint($post->ID)), // Exclude the current post from the grid.
            'tag__in' => $attributes['tagArray'],
            'author__in' => $attributes['authorArray']
        ));

    return $query;

}

function ubpro_render_post_grid_block( $content, $block, $block_instance = null ){
    $attributes = isset($block['attrs']) ? $block['attrs'] : array(); 

    /* get posts */

    $query = ubpro_query_post( $attributes );

    $total_pages = ceil($query->found_posts / $attributes['amountPosts']);
    /* Start the loop */
	$page     = empty($_GET['ub-page']) ? 1 : (int) $_GET['ub-page'];
    $post_grid = '';
    $pagination = '';
    
    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            
            /* Setup the post ID */
            $post_id = get_the_ID();
            
            /* Setup the featured image ID */
            $post_thumb_id = get_post_thumbnail_id( $post_id );

            /* Setup the post classes */
            $post_classes = 'ub-post-grid-item';
            $taxonomy_slug          = isset($attributes['taxonomyType']) ? $attributes['taxonomyType'] : "";
		    $terms                  = get_the_terms($post_id, $taxonomy_slug );
            $is_display_taxonomy    = isset($attributes['displayTaxonomy']) && $attributes['displayTaxonomy'];
            $is_show_taxonomy       = $is_display_taxonomy && !empty($terms);
            $taxonomy_position      = isset($attributes['taxonomyPosition']) ? $attributes['taxonomyPosition'] : "with-meta";
            /* Join classes together */
            $post_classes = join( ' ', get_post_class( $post_classes, $post_id ) );

            /* Start the markup for the post */
            $post_grid .= sprintf(
                '<article id="post-%1$s" class="%2$s">',
                esc_attr( $post_id ),
                esc_attr( $post_classes )
            );

            /* Get the featured image */
            if ( isset( $attributes['checkPostImage'] ) && $attributes['checkPostImage'] && $post_thumb_id ) {

                /* Output the featured image */
                $post_grid .= sprintf(
                    '<div class="ub-block-post-grid-image"><a href="%1$s" rel="bookmark" aria-hidden="true" tabindex="-1">%2$s</a></div>',
                    esc_url( get_permalink( $post_id ) ),
                    wp_get_attachment_image( $post_thumb_id, array($attributes['postImageWidth'], $attributes['preservePostImageAspectRatio'] ? 0 : $attributes['postImageHeight']) )//use array 
                );
            }
           
           
            /* Wrap the text content */
            $post_grid .= sprintf(
                '<div class="ub-block-post-grid-text">'
            );
            if($is_show_taxonomy && $taxonomy_position === 'above-title'){
                $post_grid .= '<div class="ub-block-post-grid-taxonomies ub-taxonomies-above-title">';
                foreach ( $terms as $term ) {
                        $post_grid .= sprintf( '<a class="ub-block-post-grid-taxonomy" href="%1$s">%2$s</a>',
                        esc_url( get_term_link( $term->slug, $taxonomy_slug ) ),
                        esc_html( $term->name )
                    );
                }
                $post_grid .= '</div>';
            }
            $post_grid .= sprintf(
                '<header class="ub-block-post-grid-header">'
            );

            /* Get the post title */
            $title = get_the_title( $post_id );

            if ( ! $title ) {
                $title = __( 'Untitled', 'ultimate-blocks' );
            }

            if ( isset( $attributes['checkPostTitle'] ) && $attributes['checkPostTitle'] ) {

                if ( isset( $attributes['postTitleTag'] ) ) {
                    $post_title_tag = $attributes['postTitleTag'];
                } else {
                    $post_title_tag = 'h2';
                }

                if (!in_array($post_title_tag, ['h2', 'h3', 'h4'])) {
                    $post_title_tag = 'h2';
                }

                $post_grid .= sprintf(
                    '<%3$s class="ub-block-post-grid-title"><a href="%1$s" rel="bookmark">%2$s</a></%3$s>',
                    esc_url( get_permalink( $post_id ) ),
                    esc_html( $title ),
                    $post_title_tag
                );
            }

            /* Get the post author */
            if ( isset( $attributes['checkPostAuthor'] ) && $attributes['checkPostAuthor'] ) {
                $post_grid .= sprintf(
                    '<div class="ub-block-post-grid-author" itemprop="author"><a class="ub-text-link" href="%2$s" itemprop="url" rel="author"><span itemprop="name">%1$s</span></a></div>',
                    esc_html( get_the_author_meta( 'display_name', get_the_author_meta( 'ID' ) ) ),
                    esc_html( get_author_posts_url( get_the_author_meta( 'ID' ) ) )
                );
            }

            /* Get the post date */
            if ( isset( $attributes['checkPostDate'] ) && $attributes['checkPostDate'] ) {
                $post_grid .= sprintf(
                    '<time datetime="%1$s" class="ub-block-post-grid-date" itemprop="datePublished">%2$s</time>',
                    esc_attr( get_the_date( 'c', $post_id ) ),
                    esc_html( get_the_date( '', $post_id ) )
                );
            }
            if($is_show_taxonomy && $taxonomy_position === 'with-meta'){
                $post_grid .= '<div class="ub-block-post-grid-taxonomies ub-taxonomies-with-meta">';
                foreach ( $terms as $term ) {
                        $post_grid .= sprintf( '<a class="ub-block-post-grid-taxonomy" href="%1$s">%2$s</a>',
                        esc_url( get_term_link( $term->slug, $taxonomy_slug ) ),
                        esc_html( $term->name )
                    );
                }
                $post_grid .= '</div>';
            }
            /* Close the header content */
            $post_grid .= sprintf(
                '</header>'
            );

            /* Wrap the excerpt content */
            $post_grid .= sprintf(
                '<div class="ub-block-post-grid-excerpt">'
            );

            /* Get the excerpt */

            $excerpt = apply_filters( 'the_excerpt',
                get_post_field(
                    'post_excerpt',
                    $post_id,
                    'display'
                )
            );

            if ( empty( $excerpt ) && isset( $attributes['excerptLength'] ) ) {
                $excerpt = apply_filters( 'the_excerpt',
                    wp_trim_words(
                        preg_replace(
                            array(
                                '/\<figcaption>.*\<\/figcaption>/',
                                '/\[caption.*\[\/caption\]/',
                            ),
                            '',
                            !empty(get_the_content()) ? get_the_content() : ""
                        ),
                        $attributes['excerptLength']
                    )
                );
            }

            if ( ! $excerpt ) {
                $excerpt = null;
            }

            if ( isset( $attributes['checkPostExcerpt'] ) && $attributes['checkPostExcerpt'] && !empty( $excerpt )) {
                $post_grid .= sprintf('<div class="ub-block-post-grid-excerpt-text">%1$s</div>', wp_kses_post( $excerpt ));
            }

            /* Get the read more link */
            if ( isset( $attributes['checkPostLink'] ) && $attributes['checkPostLink'] ) {
                $post_grid .= sprintf(
                    '<p><a class="ub-block-post-grid-more-link ub-text-link" href="%1$s" rel="bookmark">%2$s <span class="screen-reader-text">%3$s</span></a></p>',
                    esc_url( get_permalink( $post_id ) ),
                    esc_html( $attributes['readMoreText'] ),
                    esc_html( $title )
                );
            }

            /* Close the excerpt content */
            $post_grid .= sprintf(
                '</div>'
            );

            /* Close the text content */
            $post_grid .= sprintf(
                '</div>'
            );

            /* Close the post */
            $post_grid .= "</article>\n";
        }

        /* Restore original post data */
        wp_reset_postdata();

        /* Build the block classes */
        $class = "wp-block-ub-post-grid ub-block-post-grid align". $attributes['wrapAlignment'];

        if ( isset( $attributes['className'] ) ) {
            $class .= ' ' . $attributes['className'];
        }

        /* Layout orientation class */
        $grid_class = 'ub-post-grid-items';

        if ( isset( $attributes['postLayout'] ) && 'list' === $attributes['postLayout'] ) {
            $grid_class .= ' is-list';
        } else {
            $grid_class .= ' is-grid';
        }

        /* Grid columns class */
        if ( isset( $attributes['columns'] ) && 'grid' === $attributes['postLayout'] ) {
            $grid_class .= ' columns-' . $attributes['columns'];
        }

        /* Post grid section tag */

        $section_tag = 'section';
        $styles = ubpro_get_post_grid_styles($block_instance->parsed_block['attrs']);
        $pagination_alignment = 'ub-pagination-justify-' . $attributes['paginationAlignment'] . '';
        for ($i=1; $i <= $total_pages; $i++) { 
            $paginate_args = array(
                'prev_next' => true,
                'total'     => $total_pages,
                'format'    => '?ub-page=%#%',
                'current'   => max( 1, $page ),
                'mid_size'  => 3,
                'prev_text' => "Previous",
                'next_text' => "Next"
		    );
            $pagination = paginate_links($paginate_args);
        }
        $pagination_type = isset($attributes['paginationType']) ? $attributes['paginationType'] : "number-pagination";
        $load_more_text  = isset($attributes['loadMoreText']) ? $attributes['loadMoreText'] : "Load More";
	    $total_pages = ceil($query->found_posts / $attributes['amountPosts']);

        $load_more_pagination = sprintf(
            '<button class="ub-load-more-button">%1$s</button>',
            $load_more_text
        );

        $final_pagination = sprintf('<div class="ub-post-grid-pagination %1$s ub-%3$s" %4$s>%2$s</div>',
            $pagination_alignment,
            $pagination_type === 'number-pagination' ? $pagination : $load_more_pagination,
            $pagination_type,
            $pagination_type === 'load-more' ?  'data-total_pages="'. $total_pages . '"' : ""
        );
        $is_pagination = isset($attributes['pagination']) ? $attributes['pagination'] : false;
        $is_equal_height = isset($attributes['isEqualHeight']) && $attributes['isEqualHeight']  ? " is-equal-height " : "";
        $is_preserve_post_image_aspect_ratio = isset($attributes['preservePostImageAspectRatio']) && $attributes['preservePostImageAspectRatio']  ? " preserve-post-image-aspect-ratio " : "";
        
        /* Output the post markup */
        $block_content = sprintf(
            '<%1$s class="%2$s%7$s%9$s" style="%5$s" %8$s><div class="%3$s">%4$s</div>%6$s</%1$s>',
            $section_tag,
            esc_attr( $class ),
            esc_attr( $grid_class ),
            $post_grid,
            $styles,
            $is_pagination ? $final_pagination : "",
            $is_equal_height,
            isset($attributes['blockID']) ? 'id="ub-post-grid-'. $attributes['blockID'] . '"' : "",
            $is_preserve_post_image_aspect_ratio
        );
        return $block_content;
    }
}
function ubpro_post_grid_script(){
    wp_enqueue_script(
        'ultimate_blocks-post-grid-script',
        plugins_url( 'post-grid/front.js', dirname( __FILE__ ) ),
        array(),
        Ultimate_Blocks_Pro_Constants::plugin_version(),
        false
    );
}

add_action('wp_enqueue_scripts', 'ubpro_post_grid_script', 20);

function ubpro_blocks_get_image_src_landscape( $object, $field_name, $request ) {
    $feat_img_array = wp_get_attachment_image_src(
        $object['featured_media'],
        'full',
        false
    );
    return $feat_img_array ? $feat_img_array[0] : null;
}

function ubpro_blocks_get_author_info( $object,  $field_name, $request ) {
    /* Get the author name */
    $author_data['display_name'] = get_the_author_meta( 'display_name', $object['author'] );
    /* Get the author link */
    $author_data['author_link'] = get_author_posts_url( $object['author'] );
    /* Return the author data */
    return $author_data;
}
