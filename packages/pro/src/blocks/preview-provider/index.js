import React from "react";
import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import PreviewProvider from "@Components/PreviewProvider/PreviewProvider";

const blockType = wp.blocks.getBlockType("ub/preview-provider");
if (!blockType) {
  registerBlockType("ub/preview-provider", {
    title: __("only for UB internal use", "ultimate-blocks-pro"),
    attributes: {},
    category: "ultimateblocks",
    supports: {
      inserter: false,
      reusable: false,
    },
    edit: (props) => {
      return <PreviewProvider {...props} />;
    },
    save: () => {
      return null;
    },
  });
}
