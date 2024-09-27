import { __ } from "@wordpress/i18n";

export const repeatOptions = [
  { label: __("Repeat", "ultimate-blocks-pro"), value: "repeat" },
  { label: __("Infinite", "ultimate-blocks-pro"), value: "infinite" },
];

export const animationsList = [
  { value: "none", label: __("None", "ultimate-blocks-pro") },
  // Attention seekers
  {
    category: "attentionSeekers",
    value: "bounce",
    label: __("Bounce", "ultimate-blocks-pro"),
  },
  { value: "flash", label: __("Flash", "ultimate-blocks-pro") },
  { value: "pulse", label: __("Pulse", "ultimate-blocks-pro") },
  { value: "rubberBand", label: __("RubberBand", "ultimate-blocks-pro") },
  { value: "shakeX", label: __("ShakeX", "ultimate-blocks-pro") },
  { value: "shakeY", label: __("ShakeY", "ultimate-blocks-pro") },
  { value: "headShake", label: __("HeadShake", "ultimate-blocks-pro") },
  { value: "swing", label: __("Swing", "ultimate-blocks-pro") },
  { value: "tada", label: __("Tada", "ultimate-blocks-pro") },
  { value: "wobble", label: __("Wobble", "ultimate-blocks-pro") },
  { value: "jello", label: __("Jello", "ultimate-blocks-pro") },
  { value: "heartBeat", label: __("HeartBeat", "ultimate-blocks-pro") },

  // Back entrances
  {
    category: "backEntrances",
    value: "backInDown",
    label: __("BackInDown", "ultimate-blocks-pro"),
  },
  { value: "backInLeft", label: __("BackInLeft", "ultimate-blocks-pro") },
  { value: "backInRight", label: __("BackInRight", "ultimate-blocks-pro") },
  { value: "backInUp", label: __("BackInUp", "ultimate-blocks-pro") },

  // Back exits
  {
    category: "backExits",
    value: "backOutDown",
    label: __("BackOutDown", "ultimate-blocks-pro"),
  },
  { value: "backOutLeft", label: __("BackOutLeft", "ultimate-blocks-pro") },
  { value: "backOutRight", label: __("BackOutRight", "ultimate-blocks-pro") },
  { value: "backOutUp", label: __("BackOutUp", "ultimate-blocks-pro") },

  // Bouncing entrances
  {
    category: "bouncingEntrances",
    value: "bounceIn",
    label: __("BounceIn", "ultimate-blocks-pro"),
  },
  { value: "bounceInDown", label: __("BounceInDown", "ultimate-blocks-pro") },
  { value: "bounceInLeft", label: __("BounceInLeft", "ultimate-blocks-pro") },
  { value: "bounceInRight", label: __("BounceInRight", "ultimate-blocks-pro") },
  { value: "bounceInUp", label: __("BounceInUp", "ultimate-blocks-pro") },

  // Bouncing exits
  {
    category: "bouncingExits",
    value: "bounceOut",
    label: __("BounceOut", "ultimate-blocks-pro"),
  },
  { value: "bounceOutDown", label: __("BounceOutDown", "ultimate-blocks-pro") },
  { value: "bounceOutLeft", label: __("BounceOutLeft", "ultimate-blocks-pro") },
  {
    value: "bounceOutRight",
    label: __("BounceOutRight", "ultimate-blocks-pro"),
  },
  { value: "bounceOutUp", label: __("BounceOutUp", "ultimate-blocks-pro") },

  // Fading entrances
  {
    category: "fadingEntrances",
    value: "fadeIn",
    label: __("FadeIn", "ultimate-blocks-pro"),
  },
  { value: "fadeInDown", label: __("FadeInDown", "ultimate-blocks-pro") },
  { value: "fadeInDownBig", label: __("FadeInDownBig", "ultimate-blocks-pro") },
  { value: "fadeInLeft", label: __("FadeInLeft", "ultimate-blocks-pro") },
  { value: "fadeInLeftBig", label: __("FadeInLeftBig", "ultimate-blocks-pro") },
  { value: "fadeInRight", label: __("FadeInRight", "ultimate-blocks-pro") },
  {
    value: "fadeInRightBig",
    label: __("FadeInRightBig", "ultimate-blocks-pro"),
  },
  { value: "fadeInUp", label: __("FadeInUp", "ultimate-blocks-pro") },
  { value: "fadeInUpBig", label: __("FadeInUpBig", "ultimate-blocks-pro") },
  { value: "fadeInTopLeft", label: __("FadeInTopLeft", "ultimate-blocks-pro") },
  {
    value: "fadeInTopRight",
    label: __("FadeInTopRight", "ultimate-blocks-pro"),
  },
  {
    value: "fadeInBottomLeft",
    label: __("FadeInBottomLeft", "ultimate-blocks-pro"),
  },
  {
    value: "fadeInBottomRight",
    label: __("FadeInBottomRight", "ultimate-blocks-pro"),
  },

  // Fading exits
  {
    category: "fadingExits",
    value: "fadeOut",
    label: __("FadeOut", "ultimate-blocks-pro"),
  },
  { value: "fadeOutDown", label: __("FadeOutDown", "ultimate-blocks-pro") },
  {
    value: "fadeOutDownBig",
    label: __("FadeOutDownBig", "ultimate-blocks-pro"),
  },
  { value: "fadeOutLeft", label: __("FadeOutLeft", "ultimate-blocks-pro") },
  {
    value: "fadeOutLeftBig",
    label: __("FadeOutLeftBig", "ultimate-blocks-pro"),
  },
  { value: "fadeOutRight", label: __("FadeOutRight", "ultimate-blocks-pro") },
  {
    value: "fadeOutRightBig",
    label: __("FadeOutRightBig", "ultimate-blocks-pro"),
  },
  { value: "fadeOutUp", label: __("FadeOutUp", "ultimate-blocks-pro") },
  { value: "fadeOutUpBig", label: __("FadeOutUpBig", "ultimate-blocks-pro") },
  {
    value: "fadeOutTopLeft",
    label: __("FadeOutTopLeft", "ultimate-blocks-pro"),
  },
  {
    value: "fadeOutTopRight",
    label: __("FadeOutTopRight", "ultimate-blocks-pro"),
  },
  {
    value: "fadeOutBottomRight",
    label: __("FadeOutBottomRight", "ultimate-blocks-pro"),
  },
  {
    value: "fadeOutBottomLeft",
    label: __("FadeOutBottomLeft", "ultimate-blocks-pro"),
  },

  // Flippers
  {
    category: "flippers",
    value: "flip",
    label: __("Flip", "ultimate-blocks-pro"),
  },
  { value: "flipInX", label: __("FlipInX", "ultimate-blocks-pro") },
  { value: "flipInY", label: __("FlipInY", "ultimate-blocks-pro") },
  { value: "flipOutX", label: __("FlipOutX", "ultimate-blocks-pro") },
  { value: "flipOutY", label: __("FlipOutY", "ultimate-blocks-pro") },

  // Lightspeed
  {
    category: "lightspeed",
    value: "lightSpeedInRight",
    label: __("LightSpeedInRight", "ultimate-blocks-pro"),
  },
  {
    value: "lightSpeedInLeft",
    label: __("LightSpeedInLeft", "ultimate-blocks-pro"),
  },
  {
    value: "lightSpeedOutRight",
    label: __("LightSpeedOutRight", "ultimate-blocks-pro"),
  },
  {
    value: "lightSpeedOutLeft",
    label: __("LightSpeedOutLeft", "ultimate-blocks-pro"),
  },

  // Rotating entrances
  {
    category: "rotatingEntrances",
    value: "rotateIn",
    label: __("RotateIn", "ultimate-blocks-pro"),
  },
  {
    value: "rotateInDownLeft",
    label: __("RotateInDownLeft", "ultimate-blocks-pro"),
  },
  {
    value: "rotateInDownRight",
    label: __("RotateInDownRight", "ultimate-blocks-pro"),
  },
  {
    value: "rotateInUpLeft",
    label: __("RotateInUpLeft", "ultimate-blocks-pro"),
  },
  {
    value: "rotateInUpRight",
    label: __("RotateInUpRight", "ultimate-blocks-pro"),
  },

  // Rotating exits
  {
    category: "rotatingExits",
    value: "rotateOut",
    label: __("RotateOut", "ultimate-blocks-pro"),
  },
  {
    value: "rotateOutDownLeft",
    label: __("RotateOutDownLeft", "ultimate-blocks-pro"),
  },
  {
    value: "rotateOutDownRight",
    label: __("RotateOutDownRight", "ultimate-blocks-pro"),
  },
  {
    value: "rotateOutUpLeft",
    label: __("RotateOutUpLeft", "ultimate-blocks-pro"),
  },
  {
    value: "rotateOutUpRight",
    label: __("RotateOutUpRight", "ultimate-blocks-pro"),
  },

  // Specials
  {
    category: "specials",
    value: "hinge",
    label: __("Hinge", "ultimate-blocks-pro"),
  },
  { value: "jackInTheBox", label: __("JackInTheBox", "ultimate-blocks-pro") },
  { value: "rollIn", label: __("RollIn", "ultimate-blocks-pro") },
  { value: "rollOut", label: __("RollOut", "ultimate-blocks-pro") },

  // Zooming entrances
  {
    category: "zoomingEntrances",
    value: "zoomIn",
    label: __("ZoomIn", "ultimate-blocks-pro"),
  },
  { value: "zoomInDown", label: __("ZoomInDown", "ultimate-blocks-pro") },
  { value: "zoomInLeft", label: __("ZoomInLeft", "ultimate-blocks-pro") },
  { value: "zoomInRight", label: __("ZoomInRight", "ultimate-blocks-pro") },
  { value: "zoomInUp", label: __("ZoomInUp", "ultimate-blocks-pro") },

  // Zooming exits
  {
    category: "zoomingExits",
    value: "zoomOut",
    label: __("ZoomOut", "ultimate-blocks-pro"),
  },
  { value: "zoomOutDown", label: __("ZoomOutDown", "ultimate-blocks-pro") },
  { value: "zoomOutLeft", label: __("ZoomOutLeft", "ultimate-blocks-pro") },
  { value: "zoomOutRight", label: __("ZoomOutRight", "ultimate-blocks-pro") },
  { value: "zoomOutUp", label: __("ZoomOutUp", "ultimate-blocks-pro") },

  // Sliding entrances
  {
    category: "slidingEntrances",
    value: "slideInDown",
    label: __("SlideInDown", "ultimate-blocks-pro"),
  },
  { value: "slideInLeft", label: __("SlideInLeft", "ultimate-blocks-pro") },
  { value: "slideInRight", label: __("SlideInRight", "ultimate-blocks-pro") },
  { value: "slideInUp", label: __("SlideInUp", "ultimate-blocks-pro") },

  // Sliding exits
  {
    category: "slidingExits",
    value: "slideOutDown",
    label: __("SlideOutDown", "ultimate-blocks-pro"),
  },
  { value: "slideOutLeft", label: __("SlideOutLeft", "ultimate-blocks-pro") },
  { value: "slideOutRight", label: __("SlideOutRight", "ultimate-blocks-pro") },
  { value: "slideOutUp", label: __("SlideOutUp", "ultimate-blocks-pro") },
];

export const categories = [
  {
    label: __("Attention seekers", "ultimate-blocks-pro"),
    value: "attentionSeekers",
  },
  {
    label: __("Back entrances", "ultimate-blocks-pro"),
    value: "backEntrances",
  },
  { label: __("Back exits", "ultimate-blocks-pro"), value: "backExits" },
  {
    label: __("Bouncing entrances", "ultimate-blocks-pro"),
    value: "bouncingEntrances",
  },
  {
    label: __("Bouncing exits", "ultimate-blocks-pro"),
    value: "bouncingExits",
  },
  {
    label: __("Fading entrances", "ultimate-blocks-pro"),
    value: "fadingEntrances",
  },
  { label: __("Fading exits", "ultimate-blocks-pro"), value: "fadingExits" },
  { label: __("Flippers", "ultimate-blocks-pro"), value: "flippers" },
  { label: __("Lightspeed", "ultimate-blocks-pro"), value: "lightspeed" },
  {
    label: __("Rotating entrances", "ultimate-blocks-pro"),
    value: "rotatingEntrances",
  },
  {
    label: __("Rotating exits", "ultimate-blocks-pro"),
    value: "rotatingExits",
  },
  { label: __("Specials", "ultimate-blocks-pro"), value: "specials" },
  {
    label: __("Zooming entrances", "ultimate-blocks-pro"),
    value: "zoomingEntrances",
  },
  { label: __("Zooming exits", "ultimate-blocks-pro"), value: "zoomingExits" },
  {
    label: __("Sliding entrances", "ultimate-blocks-pro"),
    value: "slidingEntrances",
  },
  { label: __("Sliding exits", "ultimate-blocks-pro"), value: "slidingExits" },
];
