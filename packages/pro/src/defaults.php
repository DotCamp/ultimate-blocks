<?php

$defaultValues = array(
	'ub/button'                  => array(
		'attributes' => array(
			'blockID'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'buttonText'           => array(
				'type'    => 'string',
				'default' => 'Button Text'
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'align'                => array(
				'type'    => 'string',
				'default' => ''
			),
			'url'                  => array(
				'type'    => 'string',
				'default' => ''
			),
			'size'                 => array(
				'type'    => 'string',
				'default' => 'medium'
			),
			'buttonColor'          => array(
				'type'    => 'string',
				'default' => '#313131'
			),
			'buttonHoverColor'     => array(
				'type'    => 'string',
				'default' => '#313131'
			),
			'buttonTextColor'      => array(
				'type'    => 'string',
				'default' => '#ffffff'
			),
			'buttonTextHoverColor' => array(
				'type'    => 'string',
				'default' => '#ffffff'
			),
			'buttonRounded'        => array(
				'type'    => 'boolean',
				'default' => false
			),
			'chosenIcon'           => array(
				'type'    => 'string',
				'default' => ''
			),
			'iconPosition'         => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'buttonIsTransparent'  => array(
				'type'    => 'boolean',
				'default' => false
			),
			'addNofollow'          => array(
				'type'    => 'boolean',
				'default' => true
			),
			'openInNewTab'         => array(
				'type'    => 'boolean',
				'default' => true
			),
			'buttonWidth'          => array(
				'type'    => 'string',
				'default' => 'fixed'
			)
		)
	),
	'ub/expand'                  => array(
		'attributes' => array(
			'blockID'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
					'type' 	=> 'array',
					'default' => array()
			),
			'initialShow'      => array(
				'type'    => 'boolean',
				'default' => false
			),
			'toggleAlign'      => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'fade'             => array(
				'type'    => 'boolean',
				'default' => false
			),
			'allowScroll'      => array(
				'type'    => 'boolean',
				'default' => false
			),
			'scrollOption'     => array(
				'type'    => 'string',
				'default' => 'auto' //other options: namedelement, fixedamount, off
			),
			'scrollOffset'     => array(
				'type'    => 'number',
				'default' => 0
			),
			'scrollTarget'     => array(
				'type'    => 'string',
				'default' => ''
			),
			'scrollTargetType' => array(
				'type'    => 'string',
				'default' => 'id' //other types: class, element
			)
		)
	),
	'ub/expand-portion'          => array(
		'attributes' => array(
			'clickText'   => array(
				'type'    => 'string',
				'default' => ''
			),
			"isStyleButton" => array(
				'type'	=> 'boolean',
				'default' => false
			),
			'displayType' => array(
				'type'    => 'string',
				'default' => ''
			),
			'isVisible'   => array(
				'type'    => 'boolean',
				'default' => false
			),
			'parentID'    => array(
				'type'    => 'string',
				'default' => ''
			),
			'fade'        => array(
				'type'    => 'boolean',
				'default' => false
			),
			'isFaded'     => array(
				'type'    => 'boolean',
				'default' => false
			)
		)
	),
	'ub/image-slider'            => array(
		'attributes' => array(
			'blockID'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
					'type' 	=> 'array',
					'default' => array()
			),
			//retained for reverse compatibility
			'images'           => array(
				'type'    => 'string',
				'default' => '[]'
			),
			/*COMMENTED OUT TO PREVENT PHP ERRORS
			'pics' => array(
				'type' => 'array',
				'default' => array()
			),*/
			//retained for reverse compatibility
			'captions'         => array(
				'type'    => 'string',
				'default' => '[]'
			),
			/*COMMENTED OUT TO PREVENT PHP ERRORS
			'descriptions' => array(
				'type' => 'array',
				'default' => array()
			),*/
			'wrapsAround'      => array(
				'type'    => 'boolean',
				'default' => true
			),
			'isDraggable'      => array(
				'type'    => 'boolean',
				'default' => false
			),
			'autoplays'        => array(
				'type'    => 'boolean',
				'default' => false
			),
			'autoplayDuration' => array(
				'type'    => 'number',
				'default' => 3
			),
			'sliderHeight'     => array(
				'type'    => 'number',
				'default' => 250
			),
			'showPageDots'     => array(
				'type'    => 'boolean',
				'default' => true
			),
			'usePagination'    => array(
				'type'    => 'boolean',
				'default' => true
			),
			'paginationType'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'transition'       => array(
				'type'    => 'string',
				'default' => 'slide'
			),
			//for cube, coverflow and flip
			'slideShadows'     => array(
				'type'    => 'boolean',
				'default' => true
			),
			//exclusive for coverflow
			'rotate'           => array(
				'type'    => 'number',
				'default' => 50 //degrees
			),
			'stretch'          => array(
				'type'    => 'number',
				'default' => 0 //pixels
			),
			'depth'            => array(
				'type'    => 'number',
				'default' => 100 //pixels, z-axis
			),
			'modifier'         => array(
				'type'    => 'number',
				'default' => 1 //effect multiplier
			),
			//exclusive for flip
			'limitRotation'    => array(
				'type'    => 'boolean',
				'default' => true
			),
			//exclusive for cube
			'shadow'           => array(
				'type'    => 'boolean',
				'default' => true
			),
			'shadowOffset'     => array(
				'type'    => 'number',
				'default' => 20
			),
			'shadowScale'      => array(
				'type'    => 'number',
				'default' => 0.94
			),
			'showThumbnails'   => array(
				'type'    => 'boolean',
				'default' => false
			)
		)
	),
	'ub/table-of-contents-block' => array(
		'attributes' => array(
			'blockID'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'title'                => array(
				'type'    => 'string',
				'default' => ''
			),
			'allowedHeaders'       => array(
				'type'    => 'array',
				'default' => array_fill( 0, 6, true ),
				'items'   => array(
					'type' => 'boolean'
				)
			),
			'links'                => array(
				'type'    => 'string',
				'default' => ''
			),
			'allowToCHiding'       => array(
				'type'    => 'boolean',
				'default' => false
			),
			'hideOnMobile'         => array(
				'type'    => 'boolean',
				'default' => false
			),
			'showList'             => array(
				'type'    => 'boolean',
				'default' => true
			),
			'numColumns'           => array(
				'type'    => 'number',
				'default' => 1
			),
			'listStyle'            => array(
				'type'    => 'string',
				'default' => 'bulleted'
			),
			'enableSmoothScroll'   => array(
				'type'    => 'boolean',
				'default' => false
			),
			'titleAlignment'       => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'gaps'                 => array(
				'type'    => 'array',
				'default' => array(),
				'items'   => array(
					'type' => 'number'
				)
			),
			'removeDiacritics'     => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'scrollOption'         => array(
				'type'    => 'string',
				'default' => 'auto' //other options: namedelement, fixedamount, off
			),
			'scrollOffset'         => array(
				'type'    => 'number',
				'default' => 0
			),
			'scrollTarget'         => array(
				'type'    => 'string',
				'default' => ''
			),
			'scrollTargetType'     => array(
				'type'    => 'string',
				'default' => 'id' //other types: class, element
			),
			'titleColor'           => array(
				'type'    => 'string',
				'default' => '#000000'
			),
			'titleBackgroundColor' => array(
				'type'    => 'string',
				'default' => '#ffffff'
			),
			'listColor'            => array(
				'type'    => 'string',
				'default' => '#000000'
			),
			'listBackgroundColor'  => array(
				'type'    => 'string',
				'default' => '#ffffff'
			),
			'listIcon'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'listIconColor'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'toggleButtonType'     => array(
				'type'    => 'string',
				'default' => 'text' //alternate values: chevron, plus
			),
			'isSticky' => array(
                'type' => 'boolean',
                'default' => false
            ),
			'stickyButtonIconColor' => array(
                'type' => 'string',
                'default' => null
            ),
			'stickyTOCPosition' => array(
                'type' => 'number',
                'default' => 75
            ),
			'stickyTOCWidth' => array(
                'type' => 'number',
                'default' => 350
            ),
			'hideStickyTOCOnMobile' => array(
                'type' => 'boolean',
                'default' => false
            ),
		)
	),
	'ub/advanced-video'		    => array(
		'attributes' => array(
			'blockID'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'videoId'              => array(
				'type'    => 'integer',
				'default' => - 1,
			),
			'videoSource'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'url'                  => array(
				'type'    => 'string',
				'default' => '',
			),
			'playerStyle'          => array(
				//custom border styles placed outside embedded player
				'type'    => 'string',
				'default' => '',
			),
			'vimeoShowDetails'     => array(
				//vimeo only
				'type'    => 'boolean',
				'default' => true,
			),
			'vimeoShowLogo'        => array(
				//vimeo only
				'type'    => 'boolean',
				'default' => true,
			),
			'enableYoutubeCookies' => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'autoplay'             => array(
				//applies to: videopress, vimeo, dailymotion, youtube
				'type'    => 'boolean',
				'default' => false,
			),
			'loop'                 => array(
				//applies to youtube, vimeo, videopress
				'type'    => 'boolean',
				'default' => false,
			),
			'mute'                 => array(
				//applies to youtube, dailymotion, vimeo
				'type'    => 'boolean',
				'default' => false,
			),
			'showPlayerControls'   => array(
				//applies to dailymotion, youtube
				'type'    => 'boolean',
				'default' => true,
			),
			'playInline'           => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'thumbnail'            => array(
				//replaces embed code, click through thumbnail before seeing embedded player in youtube
				'type'    => 'string',
				'default' => '',
			),
			'videoEmbedCode'       => array(
				'type'    => 'string',
				'default' => '',
			),
			'startTime'            => array(
				//applies to youtube, dailymotion, videopress, vimeo
				'type'    => 'number',
				'default' => 0,
			),
			'height'               => array(
				'type'    => 'number',
				'default' => 0,
			),
			'width'                => array(
				'type'    => 'number',
				'default' => 0,
			),
			'origHeight'           => array(
				'type'    => 'number',
				'default' => 0,
			),
			'origWidth'            => array(
				'type'    => 'number',
				'default' => 0,
			),
			'autofit'              => array(
				'type'    => 'boolean',
				'default' => true,
			),

			//begin border attributes for each side
			'topBorderSize'        => array(
				'type'    => 'number',
				'default' => 0
			),
			'rightBorderSize'      => array(
				'type'    => 'number',
				'default' => 0
			),
			'bottomBorderSize'     => array(
				'type'    => 'number',
				'default' => 0
			),
			'leftBorderSize'       => array(
				'type'    => 'number',
				'default' => 0
			),

			'topBorderStyle'    => array(
				'type'    => 'string',
				'default' => ''
			),
			'rightBorderStyle'  => array(
				'type'    => 'string',
				'default' => ''
			),
			'bottomBorderStyle' => array(
				'type'    => 'string',
				'default' => ''
			),
			'leftBorderStyle'   => array(
				'type'    => 'string',
				'default' => ''
			),

			'topBorderColor'    => array(
				'type'    => 'string',
				'default' => ''
			),
			'rightBorderColor'  => array(
				'type'    => 'string',
				'default' => ''
			),
			'bottomBorderColor' => array(
				'type'    => 'string',
				'default' => ''
			),
			'leftBorderColor'   => array(
				'type'    => 'string',
				'default' => ''
			),
			//end border attributes for each side

			//begin corner attributes
			'topLeftRadius'     => array(
				'type'    => 'number',
				'default' => 0
			),
			'topRightRadius'    => array(
				'type'    => 'number',
				'default' => 0
			),
			'bottomLeftRadius'  => array(
				'type'    => 'number',
				'default' => 0
			),
			'bottomRightRadius' => array(
				'type'    => 'number',
				'default' => 0
			),
			'showInDesktop' => array(
				'type'    => 'boolean',
				'default' => true
			),
			'showInTablet'  => array(
				'type'    => 'boolean',
				'default' => true
			),
			'showInMobile'  => array(
				'type'    => 'boolean',
				'default' => true
			),
			'channelId'  => array(
				'type'    => 'string',
				'default' => ''
			),
			'showChannelDetails'  => array(
				'type'    => 'boolean',
				'default' => true
			),
			'channelDetails'  => array(
				'type'    => 'array',
				'default' => array()
			)
		)
	),
	'ub/tabbed-content-block'    => array(
        'attributes' => array(
            'blockID' => array(
                'type' => 'string',
                'default' => ''
            ),
		  'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
		  'margin' => array(
				'type' 	=> 'array',
				'default' => array()
		  ),
            'activeTab' => array(
                'type' => 'number',
                'default' => 0
            ),
            'theme' => array(
                'type' => 'string',
                'default' => '#eeeeee'
            ),
            'normalColor' => array(
                'type' => 'string',
                'default' => ''
            ),
            'titleColor' => array(
                'type' => 'string',
                'default' => '' //should be empty
            ),
            'normalTitleColor' => array(
                'type' => 'string',
                'default' => ''
            ),
            'borderColor' => array(
                'type' => 'string',
                'default' => '#d3d3d3'
            ),
            'tabsAlignment' => array(
                'type' => 'string',
                'default'=> 'left'
            ),
            'tabsTitle' => array(
                'type' => 'array',
                'default' => array(),
                'items' => array(
                    'type' => 'string'
                )
            ),
            'tabsAnchor' => array(
                'type' => 'array',
                'default' => array(),
                'items' => array(
                    'type' => 'string'
                )
            ),
            'useAnchors' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'tabsTitleAlignment' => array(
                'type' => 'array',
                'default' => array(),
                'items' => array(
                    'type' => 'string'
                )
            ),
            'tabVertical' => array(
                'type' => 'boolean',
                'default' => false
            ),
            'tabletTabDisplay' => array(
                'type' => 'string',
                'default' => 'horizontaltab'
            ),
            'mobileTabDisplay' => array(
                'type' => 'string',
                'default' => 'horizontaltab'
            ),
            'tabStyle' => array(
                'type' => 'string',
                'default' => 'tabs'
            ),
        )
    ),
    'ub/social-share'             => array(
		'attributes' => array(
			'blockID'            => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
					'type' 	=> 'array',
					'default' => array()
			),
			'showFacebookIcon'   => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'facebookCaption'    => array(
				'type'    => 'string',
				'default' => 'share'
			),
			'showTwitterIcon'    => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'twitterCaption'     => array(
				'type'    => 'string',
				'default' => 'tweet'
			),
			'showLinkedInIcon'   => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'linkedInCaption'    => array(
				'type'    => 'string',
				'default' => 'share'
			),
			'showPinterestIcon'  => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'pinterestCaption'   => array(
				'type'    => 'string',
				'default' => 'pin'
			),
			'showRedditIcon'     => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'redditCaption'      => array(
				'type'    => 'string',
				'default' => 'post'
			),
			'showGooglePlusIcon' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'showTumblrIcon'     => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'tumblrCaption'      => array(
				'type'    => 'string',
				'default' => 'share'
			),
			'iconSize'           => array(
				'type'    => 'string',
				'default' => 'normal',
			),
			'iconShape'          => array(
				'type'    => 'string',
				'default' => 'none',
			),
			'align'              => array(
				'type'    => 'string',
				'default' => 'left',
			),
			'iconOrder'          => array(
				'type'    => 'array',
				'default' => array( 'facebook', 'twitter', 'linkedin', 'pinterest', 'reddit', 'tumblr' ),
				'items'   => array(
					'type' => 'string'
				)
			),
			'buttonColor'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'useCaptions'        => array(
				'type'    => 'boolean',
				'default' => true
			),
			'addOutline'         => array(
				'type'    => 'boolean',
				'default' => true
			)
		)
	),
	'ub/review'                   => array(
		'attributes' => array(
			'ID'                 => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'blockID'                 => array(
				'type'    => 'string',
				'default' => ''
			),
			'authorName'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'itemName'                => array(
				'type'    => 'string',
				'default' => ''
			),
			'itemPage'                => array(
				'type'    => 'string',
				'default' => ''
			),
			'itemType'                => array(
				'type'    => 'string',
				'default' => 'Product'
			),
			'itemSubtype'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'itemSubsubtype'          => array(
				'type'    => 'string',
				'default' => ''
			),
			'valueType'               => array(
				'type'    => 'string',
				'default' => 'star'
			),
			'description'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'enableDescription'       => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'descriptionAlign'        => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'imgPosition'             => array(
				'type'    => 'string',
				'default' => 'right'
			),
			'imgURL'                  => array(
				'type'    => 'string',
				'default' => ''
			),
			'imgID'                   => array(
				'type'    => 'number',
				'default' => - 1
			),
			'imgAlt'                  => array(
				'type'    => 'string',
				'default' => ''
			),
			'enableImage'             => array(
				'type'    => 'boolean',
				'default' => false
			),
			'items'                   => array(
				'type'    => 'string',
				'default' => '[{"label": "", "value": 0}]'
			),
			'starCount'               => array(
				'type'    => 'number',
				'default' => 5
			),
			'useSummary'              => array(
				'type'    => 'boolean',
				'default' => true
			),
			'summaryTitle'            => array(
				'type'    => 'string',
				'default' => 'Summary'
			),
			'summaryDescription'      => array(
				'type'    => 'string',
				'default' => ''
			),
			'callToActionText'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'callToActionFontSize'    => array(
				'type'    => 'number',
				'default' => 0
			),
			'callToActionURL'         => array(
				'type'    => 'string',
				'default' => ''
			),
			'callToActionBackColor'   => array(
				'type'    => 'string',
				'default' => '#e11b4c'
			),
			'callToActionBorderColor' => array(
				'type'    => 'string',
				'default' => '#ffffff'
			),
			'callToActionForeColor'   => array(
				'type'    => 'string',
				'default' => '#ffffff'
			),
			'inactiveStarColor'       => array(
				'type'    => 'string',
				'default' => '#888888'
			),
			'activeStarColor'         => array(
				'type'    => 'string',
				'default' => ''
			),
			'activePercentBarColor'   => array(
				'type'    => 'string',
				'default' => ''
			),
			'percentBarColor'         => array(
				'type'    => 'string',
				'default' => ''
			),
			//retained for backwards compatibility
			'selectedStarColor'       => array(
				'type'    => 'string',
				'default' => '#ffff00'
			),
			'titleAlign'              => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'authorAlign'             => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'enableCTA'               => array(
				'type'    => 'boolean',
				'default' => true
			),
			'ctaNoFollow'             => array(
				'type'    => 'boolean',
				'default' => true
			),
			'parts'             	=> array(
				'type'    => 'array',
				'default' => array(
					array (
						'label' => '',
						'value' => 0
					)
				)
			),
			'ctaOpenInNewTab'         => array(
				'type'    => 'boolean',
				'default' => true
			),
			'ctaIsSponsored'          => array(
				'type'    => 'boolean',
				'default' => false
			),
			'ctaAlignment'            => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'enableReviewSchema'      => array(
				'type'    => 'boolean',
				'default' => true
			),
			'starOutlineColor'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'imageSize'               => array(
				'type'    => 'number',
				'default' => 100
			),
			'brand'                   => array(
				'type'    => 'string',
				'default' => ''
			),
			'sku'                     => array(
				'type'    => 'string',
				'default' => ''
			),
			'identifier'              => array(
				'type'    => 'string',
				'default' => ''
			),
			'identifierType'          => array(
				'type'    => 'string',
				'default' => 'gtin'
			),
			'offerType'               => array(
				'type'    => 'string',
				'default' => 'Offer'
			),
			'offerStatus'             => array(
				'type'    => 'string',
				'default' => 'InStock'
			),
			'offerHighPrice'          => array(
				'type'    => 'number',
				'default' => 0
			),
			'offerLowPrice'           => array(
				'type'    => 'number',
				'default' => 0
			),
			'offerCount'              => array(
				'type'    => 'number',
				'default' => 1
			),
			'offerPrice'              => array(
				'type'    => 'number',
				'default' => 0
			),
			'offerCurrency'           => array(
				'type'    => 'string',
				'default' => 'USD'
			),
			'offerExpiry'             => array(
				'type'    => 'number',
				'default' => 0
			),
			//BEGIN SOFTWAREAPPLICATION ATTRIBUTES
			'appCategory'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'operatingSystem'         => array(
				'type'    => 'string',
				'default' => ''
			),
			//END SOFTWAREAPPLICATION ATTRIBUTES
			'servesCuisine'           => array( //FOR FOODESTABLISHMENT AND SUBTYPES ONLY
				'type'    => 'array',
				'default' => array(),
				'items'   => array(
					'type' => 'string'
				)
			),
			//BEGIN LOCALBUSINESS/ORGANIZATION ATTRIIBUTES
			'telephone'               => array(
				'type'    => 'string',
				'default' => ''
			),
			'addressName'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'address'                 => array(
				'type'    => 'string',
				'default' => ''
			),
			'priceRange'              => array(
				'type'    => 'string',
				'default' => ''
			),
			//END LOCALBUSINESS/ORGANIZATION ATTRIBUTES
			//BEGIN BOOK ATTRIBUTES
			'bookAuthorName'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'isbn'                    => array(
				'type'    => 'string',
				'default' => ''
			),
			'reviewPublisher'         => array(
				'type'    => 'string',
				'default' => ''
			),
			'publicationDate'         => array(
				'type'    => 'number',
				'default' => time()
			),
			//END BOOK ATTRIBUTES
			//BEGIN EVENT ATTRIBUTES
			'eventStartDate'          => array(
				'type'    => 'number',
				'default' => time() + 86400
			),
			'eventEndDate'            => array(
				'type'    => 'number',
				'default' => 0
			),
			'usePhysicalAddress'      => array(
				'type'    => 'boolean',
				'default' => true
			),
			'eventPage'               => array(
				'type'    => 'string',
				'default' => ''
			),
			'organizer'               => array(
				'type'    => 'string',
				'default' => ''
			),
			'performer'               => array(
				'type'    => 'string',
				'default' => ''
			),
			//END EVENT ATTRIBUTES
			//BEGIN VIDEO OBJECT ATTRIBUTES
			'videoUploadDate'         => array(
				'type'    => 'number',
				'default' => time()
			),
			'videoURL'                => array(
				'type'    => 'string',
				'default' => ''
			)
			//END VIDEO OBJECT ATTRIBUTES
		)
	),
	'ub/divider'                    => array(
		'attributes' => array(
			'blockID'      => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
					'type' 	=> 'array',
					'default' => array()
			),
			'borderSize'   => array(
				'type'    => 'number',
				'default' => 2
			),
			'borderStyle'  => array(
				'type'    => 'string',
				'default' => 'solid'
			),
			'borderColor'  => array(
				'type'    => 'string',
				'default' => '#ccc'
			),
			'borderHeight' => array(
				'type'    => 'number',
				'default' => 20
			),
			'width'        => array(
				'type'    => 'number',
				'default' => 100
			),
			'alignment'    => array(
				'type'    => 'string',
				'default' => 'center'
			)
		)
	),
	'ub/content-toggle-block'       => array(
		'attributes' => array(
			'blockID'           => array(
				'type'    => 'string',
				'default' => ''
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
					'type' 	=> 'array',
					'default' => array()
			),
			'hasFAQSchema'      => array(
				'type'    => 'boolean',
				'default' => false
			),
			'theme'             => array(
				'type'    => 'string',
				'default' => ''
			),
			'collapsed'         => array(
				'type'    => 'boolean',
				'default' => false
			),
			'collapsedOnMobile' => array(
				'type'    => 'boolean',
				'default' => false
			),
			'titleColor'        => array(
				'type'    => 'string',
				'default' => ''
			),
			'titleLinkColor'    => array(
				'type'    => 'string',
				'default' => ''
			),
			'preventCollapse'   => array(
				'type'    => 'boolean',
				'default' => false
			),
			'showOnlyOne'       => array(
				'type'    => 'boolean',
				'default' => false
			)
		)
	),
	'ub/timeline'	=> array(
		'attributes'	=> array(
			"itemsPerView" => array(
				"type" => "number",
				"default" => 2
			),
			"timelineType" => array(
				"type" => "string",
				"default" => "vertical"
			),
			"timelineAlignment" => array(
				"type" => "string",
				"default" => "center"
			),
			"connectorPosition" => array(
				"type" => "string",
				"default" => "top"
			),
			"timelineItemStartsFrom" => array(
				"type" => "string",
				"default" => "left"
			),
			"connectorIconSize" => array(
				"type" => "number",
				"default" => 20
			),
			"connectorSize" => array(
				"type" => "number",
				"default" => 25
			),
			"oppositeTextColor" => array(
				"type" => "string",
				"default" => ''
			),
			"connectorIconColor" => array(
				"type" => "string",
				"default" => ''
			),
			"progressLineColor" => array(
				"type" => "string",
				"default" => ''
			),
			"lineColor" => array(
				"type" => "string",
				"default" => ''
			),
			"connectorBackground" => array(
				"type" => "string",
				"default" => ''
			),
			"arrowColor" => array(
				"type" => "string",
				"default" => ''
			),
			"connectorColor" => array(
				"type" => "string",
				"default" => ''
			),
			"contentColor" => array(
				"type" => "string",
				"default" => ''
			),
			"contentBackground" => array(
				"type" => "string",
				"default" => ''
			),
			"contentGradient" => array(
				"type" => "string",
				"default" => ''
			),
			"contentPadding" => array(
				"type" => "object",
				"default" => array(
					'top'=>'',
					'right'=>'',
					'bottom'=>'',
					'left'=>''
				)
			),
			"contentBorder" => array(
				"type" => "object",
				"default" => array()
			),
			"contentBorderRadius" => array(
				"type" => "object",
				"default" => array()
			),
			"iconConnector" => array(
				"type" => "boolean",
				"default" => false
			),
			"showConnectors" => array(
				"type" => "boolean",
				"default" => true
			),
			"showTimelineProgress" => array(
				"type" => "boolean",
				"default" => true
			),
			"showOppositeText" => array(
				"type" => "boolean",
				"default" => false
			),
			"numberedConnector" => array(
				"type" => "boolean",
				"default" => false
			)
		)
	),
	'ub/timeline-item'	=> array(
		'attributes'	=> array(
			"timelineType" => array(
				"type" => "string",
				"default" => 'vertical'
			),
			"oppositeText" => array(
				"type" => "string",
				"default" => ''
			),
			"contentColor" => array(
				"type" => "string",
				"default" => ''
			),
			"contentBackground" => array(
				"type" => "string",
				"default" => ''
			),
			"contentGradient" => array(
				"type" => "string",
				"default" => ''
			),
			"contentPadding" => array(
				"type" => "object",
				"default" => array(
					'top'=>'',
					'right'=>'',
					'bottom'=>'',
					'left'=>''
				)
			),
			"contentBorder" => array(
				"type" => "object",
				"default" => array()
			),
			"contentBorderRadius" => array(
				"type" => "object",
				"default" => array()
			)
		)
	),
	'ub/post-grid'		=> array(
			'attributes' => array(
			'blockID'                      => array(
				'type'    => 'string',
				'default' => ''
			),
			'postType' => array(
				'type'    => 'string',
				'default' => 'post'
			),
			'paginationAlignment' => array(
				'type'    => 'string',
				'default' => 'left'
			),
			'paginationColor' => array(
				'type'    => 'string',
				'default' => ''
			),
			'paginationBackground' => array(
				'type'    => 'string',
				'default' => ''
			),
			'paginationGradient' => array(
				'type'    => 'string',
				'default' => ''
			),
			'activePaginationColor' => array(
				'type'    => 'string',
				'default' => ''
			),
			'activePaginationBackground' => array(
				'type'    => 'string',
				'default' => ''
			),
			'activePaginationGradient' => array(
				'type'    => 'string',
				'default' => ''
			),
			'isEqualHeight' => array(
				'type'    => 'boolean',
				'default' => true
			),
			'pagination' => array(
				'type'    => 'boolean',
				'default' => false
			),
			'padding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'contentPadding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'linkPadding' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'postTitleColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'authorColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'dateColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'excerptColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'linkColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'linkBackgroundColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'linkBackgroundGradientHover' => array(
				'type' => 'string',
				'default' => null
			),
			'postBackgroundColorHover' => array(
				'type' => 'string',
				'default' => null
			),
			'postBackgroundGradientHover' => array(
				'type' => 'string',
				'default' => null
			),
			'postTitleColor' => array(
				'type' => 'string',
				'default' => null
			),
			'authorColor' => array(
				'type' => 'string',
				'default' => null
			),
			'dateColor' => array(
				'type' => 'string',
				'default' => null
			),
			'excerptColor' => array(
				'type' => 'string',
				'default' => null
			),
			'linkColor' => array(
				'type' => 'string',
				'default' => null
			),
			'linkBackgroundColor' => array(
				'type' => 'string',
				'default' => null
			),
			'linkBackgroundGradient' => array(
				'type' => 'string',
				'default' => null
			),
			'postBackgroundColor' => array(
				'type' => 'string',
				'default' => null
			),
			'postBackgroundGradient' => array(
				'type' => 'string',
				'default' => null
			),
			'taxonomyBackgroundColor' => array(
				'type' => 'string',
				'default' => null
			),
			'taxonomyBackgroundGradient' => array(
				'type' => 'string',
				'default' => null
			),
			'taxonomyColor' => array(
				'type' => 'string',
				'default' => null
			),
			'loadMoreColor' => array(
				'type' => 'string',
				'default' => null
			),
			'loadMoreHoverColor' => array(
				'type' => 'string',
				'default' => null
			),
			'loadMoreHoverBackground' => array(
				'type' => 'string',
				'default' => null
			),
			'loadMoreBackground' => array(
				'type' => 'string',
				'default' => null
			),
			'loadMoreBackgroundGradient' => array(
				'type' => 'string',
				'default' => null
			),
			'loadMoreHoverBackgroundGradient' => array(
				'type' => 'string',
				'default' => null
			),
			'postBorderRadius' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'linkBorderRadius' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'imageBorderRadius' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'margin' => array(
				'type' 	=> 'array',
				'default' => array()
			),
			'wrapAlignment'                => array(
				'type'    => 'string',
				'default' => ''
			),
			'categories'                   => array(
				'type'    => 'string',
				'default' => ''
			),
			'categoryArray'                => array(
				'type'    => 'array',
				'default' => [],
			),
			'excludedCategories'		   => array(
				'type' => 'array',
				'default' => [],
			),
			'className'                    => array(
				'type'    => 'string',
				'default' => ''
			),
			'amountPosts'                  => array(
				'type'    => 'number',
				'default' => 6,
			),
			'checkPostDate'                => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'checkPostExcerpt'             => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'checkPostAuthor'              => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'checkPostImage'               => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'postImageWidth'               => array(
				'type'    => 'number',
				'default' => 600,
			),
			'preservePostImageAspectRatio' => array(
				'type'    => 'boolean',
				'default' => true
			),
			'postImageHeight'              => array(
				'type'    => 'number',
				'default' => 400
			),
			'checkPostLink'                => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'checkPostTitle'               => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'postLayout'                   => array(
				'type'    => 'string',
				'default' => 'grid',
			),
			'columns'                      => array(
				'type'    => 'number',
				'default' => 2,
			),
			'width'                        => array(
				'type'    => 'string',
				'default' => 'wide',
			),
			'order'                        => array(
				'type'    => 'string',
				'default' => 'desc',
			),
			'orderBy'                      => array(
				'type'    => 'string',
				'default' => 'date',
			),
			'readMoreText'                 => array(
				'type'    => 'string',
				'default' => 'Continue Reading',
			),
			'offset'                       => array(
				'type'    => 'number',
				'default' => 0,
			),
			'excerptLength'                => array(
				'type'    => 'number',
				'default' => 55,
			),
			'postTitleTag'                 => array(
				'type'    => 'string',
				'default' => 'h2'
			),
			'tagArray'                     => array(
				'type'    => 'array',
				'default' => array(),
				'items'   => array(
					'type' => 'number'
				)
			),
			'authorArray'                  => array(
				'type'    => 'array',
				'default' => array(),
				'items'   => array(
					'type' => 'number'
				)
			),
			'tagsDetails'                  => array(
				'type'    => 'array',
				'default' => array(),
			),
			'categoriesDetails'                  => array(
				'type'    => 'array',
				'default' => array(),
			),
			'displayTaxonomy'                  => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'taxonomyType'                  => array(
				'type'    => 'string',
				'default' => '',
			),
			'paginationType'                  => array(
				'type'    => 'string',
				'default' => 'number-pagination',
			),
			'loadMoreText'                  => array(
				'type'    => 'string',
				'default' => 'Load More',
			),
			'loadMoreBorder'                  => array(
				'type'    => 'array',
				'default' => array(),
			),
			'loadMoreBorderRadius'                  => array(
				'type'    => 'array',
				'default' => array(),
			),
		)
	)
);
