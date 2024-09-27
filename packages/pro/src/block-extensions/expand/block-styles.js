import { __ } from "@wordpress/i18n";

const styles = [
  {
    name: "ub-expand-default",
    label: __("Default", "ultimate-blocks-pro"),
    isDefault: true,
  },
  {
    name: "ub-expand-button",
    label: __("Button", "ultimate-blocks-pro"),
  },
];

styles.forEach((style) => {
  wp.blocks.registerBlockStyle("ub/expand", style);
});
