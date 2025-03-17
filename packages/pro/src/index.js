import { VisibilityControl, Animation } from "./extensions";
import { isEmpty, isNumber } from "lodash";
import React from "react";
import { NewButtonBlock } from "./block-extensions/button/block";
import { NewTableOfContents } from "./block-extensions/table-of-contents/block";
import { NewImageSlider } from "./block-extensions/image-slider/block";
import {
  NewExpandBlock,
  NewExpandPortionBlock,
} from "./block-extensions/expand/block";
import FrontendDataManager from "@Managers/FrontendDataManager";
import BlockExtensionManager from "@Managers/BlockExtensionManager";
import UbProStore from "@Stores/proStore";
import SavedStylesManager from "@Managers/SavedStylesManager";
// eslint-disable-next-line no-unused-vars
import PreviewProvider from "@Blocks/preview-provider";
import ProBlockStatus from "./utils/ProBlockStatus";
import NewAdvancedVideo from "./block-extensions/advanced-video/block";
import NewPostGrid from "./block-extensions/post-grid/block";
import { useBlockProps } from "@wordpress/block-editor";
import { isExtensionEnabled } from "./common";

const { addFilter } = wp.hooks;

const { createHigherOrderComponent } = wp.compose;

// initialize frontend data manager
FrontendDataManager.init("ubProEditorData");

// initialize plugin store
const preloadedStoreState = {
  extensions: {
    attributes: FrontendDataManager.getDataProperty("extensionAttributes", {}),
    extra: FrontendDataManager.getDataProperty("extraData", {}),
  },
  translations: FrontendDataManager.getDataProperty("translations", {}),
  block: FrontendDataManager.getDataProperty("block", {
    statusData: [],
  }),
};
UbProStore.init("ub-pro/main", preloadedStoreState);

// initialize block extension manager
BlockExtensionManager.init();

const isUbBlock = (blockName) => blockName.startsWith("ub/");

function addNewAttributes(settings) {
  const addAttributes = (newAttributes) =>
    Object.assign(newAttributes, settings.attributes);

  if (settings.name === "ub/image-slider") {
    settings.attributes = addAttributes({
      showThumbnails: { type: "boolean", default: false },
    });
  } else if (settings.name === "ub/expand") {
    settings.attributes = addAttributes({
      fade: { type: "boolean", default: false },
      expandButtonColor: { type: "string", default: null },
      expandButtonBgColor: { type: "string", default: null },
      expandButtonBgGradient: { type: "string", default: null },
      expandButtonPadding: {
        type: "object",
        default: {
          top: "8px",
          right: "30px",
          bottom: "8px",
          left: "30px",
        },
      },
      expandButtonBorder: { type: "object", default: {} },
      expandButtonBorderRadius: {
        type: "object",
        default: {
          topLeft: "100px",
          topRight: "100px",
          bottomLeft: "100px",
          bottomRight: "100px",
        },
      },
    });
  } else if (settings.name === "ub/expand-portion") {
    settings.attributes = addAttributes({
      fade: { type: "boolean", default: false },
      isFaded: { type: "boolean", default: false },
      isStyleButton: { type: "boolean", default: false },
    });
  } else if (settings.name === "ub/table-of-contents-block") {
    settings.attributes = addAttributes({
      listIcon: { type: "string", default: "" },
      toggleButtonType: { type: "string", default: "" },
      isSticky: { type: "boolean", default: false },
      stickyButtonIconColor: { type: "string", default: null },
      stickyTOCPosition: { type: "number", default: 75 },
      stickyTOCWidth: { type: "number", default: 350 },
      hideStickyTOCOnMobile: { type: "boolean", default: false },
    });
  } else if (settings.name === "ub/divider") {
    settings.attributes = addAttributes({
      icon: { type: "string", default: "" },
      iconBackgroundColor: { type: "string", default: "" },
      iconSize: { type: "number", default: 30 },
      iconSpacing: { type: "object", default: "" },
    });
  } else if (settings.name === "ub/advanced-video") {
    settings.attributes = addAttributes({
      showChannelDetails: { type: "boolean", default: false },
      channelDetails: { type: "object", default: {} },
    });
  } else if (settings.name === "ub/post-grid") {
    settings.attributes = addAttributes({
      postType: { type: "string", default: "post" },
      pagination: { type: "boolean", default: false },
      paginationAlignment: { type: "string", default: "left" },
      paginationColor: { type: "string", default: null },
      paginationBackground: { type: "string", default: null },
      paginationGradient: { type: "string", default: null },
      activePaginationColor: { type: "string", default: null },
      activePaginationBackground: { type: "string", default: null },
      activePaginationGradient: { type: "string", default: null },
      taxonomyColor: { type: "string", default: null },
      taxonomyBackgroundColor: { type: "string", default: null },
      taxonomyBackgroundGradient: { type: "string", default: null },
      loadMoreColor: { type: "string", default: null },
      loadMoreBackground: { type: "string", default: null },
      loadMoreBackgroundGradient: { type: "string", default: null },
      loadMoreHoverColor: { type: "string", default: null },
      loadMoreHoverBackground: { type: "string", default: null },
      loadMoreHoverBackgroundGradient: { type: "string", default: null },
      loadMoreBorder: { type: "object", default: {} },
      loadMoreBorderRadius: { type: "object", default: {} },
      displayTaxonomy: { type: "boolean", default: false },
      taxonomyPosition: { type: "string", default: "with-meta" },
      taxonomyType: { type: "string", default: "" },
      paginationType: { type: "string", default: "number-pagination" },
      loadMoreText: { type: "string", default: "Load More" },
    });
  }

  if (isUbBlock(settings.name)) {
    if (isExtensionEnabled("visibility-control")) {
      settings.attributes = addAttributes({
        isBlockHide: { type: "boolean", default: false },
        hideBlockUserRole: { type: "array", default: [] },
        hideBlockFromRole: { type: "string", default: "public" },
        hideWhenTimeScheduleApplied: { type: "boolean", default: false },
        isScheduleEnable: { type: "boolean", default: false },
        hideBlockFromTime: { type: "number", default: Date.now() },
        hideBlockToTime: { type: "number", default: Date.now() + 86400000 },
      });
    }
    if (isExtensionEnabled("animation")) {
      settings.attributes = addAttributes({
        animationRepeat: { type: "string", default: "repeat" },
        animationRepeatCount: { type: "number", default: 1 },
        animationDelay: { type: "number", default: 0 },
        animationDuration: { type: "number", default: 1 },
        selectedAnimation: { type: "string", default: "none" },
      });
    }
  }

  return settings;
}
addFilter(
  "blocks.registerBlockType",
  "ultimate-blocks-pro/additional-attributes",
  addNewAttributes,
  1
);

const blockNameToComponentMapping = {
  "ub/button": NewButtonBlock,
  "ub/table-of-contents-block": NewTableOfContents,
  "ub/image-slider": NewImageSlider,
  "ub/expand": NewExpandBlock,
  "ub/expand-portion": NewExpandPortionBlock,
  "ub/advanced-video": NewAdvancedVideo,
  "ub/post-grid": NewPostGrid,
};

const withInspectorControls = createHigherOrderComponent(
  (BlockEdit) => (props) => {
    const { name: targetBlockName, attributes } = props;
    if (
      isUbBlock(targetBlockName) &&
      Object.keys(blockNameToComponentMapping).indexOf(targetBlockName) < 0
    ) {
      return (
        <>
          {isExtensionEnabled("visibility-control") && (
            <VisibilityControl {...props} />
          )}
          {isExtensionEnabled("animation") && <Animation {...props} />}
          <BlockEdit {...props} />
        </>
      );
    }
    if (
      Object.keys(blockNameToComponentMapping).indexOf(targetBlockName) > -1
    ) {
      const ExtensionBlock = blockNameToComponentMapping[targetBlockName];
      let classes = ["ub-pro-api-v2-wrapper"];
      let styles = {};
      if (targetBlockName === "ub/image-slider") {
        if (!isEmpty(attributes.align)) {
          classes.push("align" + attributes.align);
        }
      } else if (targetBlockName === "ub/table-of-contents-block") {
        classes.push("ub_table-of-contents");
      }
      if (props.name === "ub/table-of-contents-block") {
        return <ExtensionBlock {...props} BlockEdit={BlockEdit} />;
      }
      return (
        <div
          {...useBlockProps({ className: classes.join(" "), style: styles })}
        >
          <ExtensionBlock {...props} BlockEdit={BlockEdit} />
          {isExtensionEnabled("visibility-control") && (
            <VisibilityControl {...props} BlockEdit={null} />
          )}
          {isExtensionEnabled("animation") && (
            <Animation {...props} BlockEdit={BlockEdit} />
          )}
        </div>
      );
    }
    return <BlockEdit {...props} />;
  },
  "withInspectorControl"
);

addFilter(
  "editor.BlockEdit",
  "ultimate-blocks-pro/with-inspector-controls",
  withInspectorControls
);

const withBlockWrapper = createHigherOrderComponent((BlockListBlock) => {
  return (props) => {
    const { attributes } = props;

    if (!isUbBlock(props.name)) {
      return <BlockListBlock {...props} />;
    }
    let updatedClasses = [];
    let customStyles = {};
    if (isExtensionEnabled("animation")) {
      const isAnimationSelected =
        !isEmpty(attributes.selectedAnimation) &&
        attributes.selectedAnimation !== "none";
      if (isAnimationSelected) {
        updatedClasses.push("animated");
        updatedClasses.push(attributes.selectedAnimation);
        updatedClasses.push(attributes.animationRepeat);
      }
      if (isAnimationSelected && attributes.animationRepeat === "repeat") {
        customStyles["--animate-repeat"] = attributes.animationRepeatCount;
      }

      if (isNumber(attributes.animationDuration)) {
        customStyles["--animate-duration"] = attributes.animationDuration + "s";
      }
      if (isNumber(attributes.animationDelay)) {
        customStyles["--animate-delay"] = attributes.animationDelay + "s";
      }
    }
    props.wrapperProps = {
      ...props.wrapperProps,
      style: customStyles,
    };
    return (
      <BlockListBlock
        {...props}
        {...props.wrapperProps}
        className={updatedClasses}
      />
    );
  };
}, "withBlockWrapper");
addFilter(
  "editor.BlockListBlock",
  "ultimate-blocks-pro/with-block-wrapper",
  withBlockWrapper
);

// initialize saved styles manager
SavedStylesManager.init();

ProBlockStatus.setStatusFromOptions();
