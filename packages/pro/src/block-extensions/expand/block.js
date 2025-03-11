import { isEmpty } from "lodash";
import { useEffect } from "react";
import { getDescendantBlocks } from "../../global";
import "./block-styles";
import {
  BorderControl,
  ColorSettings,
  ColorSettingsWithGradient,
  SpacingControl,
} from "../../components/StylingControls";
import { getParentBlock } from "../../common";
import {
  getBorderVariablesCss,
  getSpacingCss,
} from "../../utils/styling-helpers";
const { __ } = wp.i18n;

const { InnerBlocks, InspectorControls } = wp.blockEditor || wp.editor;

const { ToggleControl } = wp.components;

const { select, dispatch, useSelect } = wp.data;

export function NewExpandBlock(props) {
  const { attributes, setAttributes, clientId, BlockEdit } = props;

  const { blockID, fade } = attributes;

  const { getBlock } = select("core/block-editor") || select("core/editor");
  const { updateBlockAttributes } =
    dispatch("core/block-editor") || dispatch("core/editor");

  const selectedBlockID = useSelect((select) => {
    return (
      select("core/block-editor") || select("core/editor")
    ).getSelectedBlockClientId();
  }, []);

  const block = getBlock(clientId);
  const rootBlock = getParentBlock(clientId, "core/block");

  const fullVersionVisibility =
    selectedBlockID === clientId || block
      ? getDescendantBlocks(block)
          .map((b) => b.clientId)
          .includes(selectedBlockID)
      : false;

  const blockClassName = !isEmpty(attributes.className)
    ? attributes.className
    : "";
  const hasButtonStyleClass =
    blockClassName
      .split(" ")
      .filter((className) => className === "is-style-ub-expand-button").length >
    0
      ? true
      : false;

  useEffect(() => {
    if (!isEmpty(block)) {
      block.innerBlocks.map((block) =>
        updateBlockAttributes(block.clientId, {
          isStyleButton: hasButtonStyleClass,
        })
      );
    }
  }, [hasButtonStyleClass]);

  if (
    block &&
    block.innerBlocks[1] &&
    block.innerBlocks[1].attributes.isVisible !== fullVersionVisibility &&
    !rootBlock
  ) {
    updateBlockAttributes(block.innerBlocks[0].clientId, {
      isFaded: !fullVersionVisibility,
    });
    updateBlockAttributes(block.innerBlocks[1].clientId, {
      isVisible: fullVersionVisibility,
    });
  }
  const buttonBorderVariables = getBorderVariablesCss(
    attributes.expandButtonBorder,
    "expand-button"
  );
  const buttonPaddingObj = getSpacingCss(attributes.expandButtonPadding);
  const buttonBorderRadius = {
    "--ub-expand-button-top-left-radius":
      attributes.expandButtonBorderRadius?.topLeft,
    "--ub-expand-button-top-right-radius":
      attributes.expandButtonBorderRadius?.topRight,
    "--ub-expand-button-bottom-left-radius":
      attributes.expandButtonBorderRadius?.bottomLeft,
    "--ub-expand-button-bottom-right-radius":
      attributes.expandButtonBorderRadius?.bottomRight,
  };

  let buttonStyles = {
    "--ub-expand-button-color": attributes.expandButtonColor,
    "--ub-expand-button-bg-color": !isEmpty(attributes?.expandButtonBgColor)
      ? attributes.expandButtonBgColor
      : attributes?.expandButtonBgGradient,
    "--ub-expand-button-padding-top": buttonPaddingObj?.top,
    "--ub-expand-button-padding-right": buttonPaddingObj?.right,
    "--ub-expand-button-padding-bottom": buttonPaddingObj?.bottom,
    "--ub-expand-button-padding-left": buttonPaddingObj?.left,
    ...buttonBorderRadius,
    ...buttonBorderVariables,
  };
  const fadeControl = (
    <ToggleControl
      label={__("Fade when minimized", "ultimate-blocks-pro")}
      id="ub_expand_fade_option"
      checked={fade}
      onChange={() => {
        setAttributes({ fade: !fade });

        block.innerBlocks.forEach((innerBlock) => {
          updateBlockAttributes(innerBlock.clientId, {
            fade: !fade,
          });
        });
      }}
    />
  );
  const buttonColorControl = hasButtonStyleClass && (
    <>
      <InspectorControls group="color">
        <ColorSettings
          label={__("Button Color", "ultimate-blocks-pro")}
          attrKey="expandButtonColor"
        />
        <ColorSettingsWithGradient
          attrBackgroundKey="expandButtonBgColor"
          attrGradientKey="expandButtonBgGradient"
          label={__("Button Background", "ultimate-blocks-pro")}
        />
      </InspectorControls>
      <InspectorControls group="border">
        <BorderControl
          showDefaultBorder
          showDefaultBorderRadius
          attrBorderKey="expandButtonBorder"
          attrBorderRadiusKey="expandButtonBorderRadius"
          borderLabel={__("Button Border", "ultimate-blocks-pro")}
          borderRadiusLabel={__("Button Border Radius", "ultimate-blocks-pro")}
        />
      </InspectorControls>
    </>
  );
  const buttonSpacingControl = hasButtonStyleClass && (
    <SpacingControl
      showByDefault
      attrKey="expandButtonPadding"
      label={__("Button Padding", "ultimate-blocks-pro")}
    />
  );
  const propProps = {
    fadeControl,
    buttonColorControl,
    buttonSpacingControl,
    buttonStyles,
  };
  return (
    <>
      <BlockEdit {...props} {...propProps} />
    </>
  );
}

export function NewExpandPortionBlock(props) {
  const { attributes, BlockEdit } = props;

  const { displayType, fade, isFaded } = attributes;

  const ConditionalWrapper = ({ condition, children, wrap }) =>
    condition ? wrap(children) : <>{children}</>;

  const ConditionalWrapperContent = (
    <ConditionalWrapper
      condition={displayType === "partial" && fade && isFaded}
      children={
        <InnerBlocks
          templateLock={false}
          renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
        />
      }
      wrap={(c) => <div className="ub-fade">{c}</div>}
    />
  );
  const proProps = {
    ConditionalWrapperContent,
  };
  return (
    <>
      <BlockEdit {...props} {...proProps} />
    </>
  );
}
