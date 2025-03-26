import React, { useRef } from "react";
import { ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { PanelColorSettings } from "@wordpress/block-editor";
import { getParentBlock } from "../../common";
import { useSelect } from "@wordpress/data";
import ProsCons from "./components/ProsCons";
import ColorControlPortal from "./components/ColorControlPortal";
import InspectorContextProvider from "./components/InspectorContextProvider";

export default function NewReviewMain(props) {
  const { attributes, setAttributes, BlockEdit, isSelected, clientId } = props;
  const { bgColor, fontColor } = attributes;

  const { rootBlockClientId } = useSelect((select) => {
    const { getBlock, getBlockRootClientId } = select("core/block-editor");
    const block = getBlock(clientId);
    const rootBlockClientId = getBlockRootClientId(block.clientId);
    return {
      rootBlockClientId,
    };
  });

  const reviewWrapperRef = useRef(null);
  const rootBlock = getParentBlock(rootBlockClientId, "core/block");
  const ProInspectorContextProvider = InspectorContextProvider;
  const prosCons = (
    <ProsCons
      attributes={props.attributes}
      setAttributes={setAttributes}
      isBlockActive={isSelected}
      rootBlock={rootBlock}
    />
  );

  /**
   * Handler for font color inherit control.
   *
   * @param {boolean} status control status
   */
  const handleInheritFontColorChange = (status) => {
    let fontColor = "inherit";

    if (!status) {
      const { current: wrapperEl } = reviewWrapperRef;
      if (wrapperEl) {
        // assign current theme color for enabled font color control since disabled color control value is 'inherit'
        fontColor = getComputedStyle(wrapperEl).color;
      }
    }

    setAttributes({
      fontColor,
    });
  };
  const proColorControls = (
    <>
      <ToggleControl
        label={__("Use theme font color", "ultimate-blocks-pro")}
        checked={fontColor === "inherit"}
        onChange={handleInheritFontColorChange}
      />
      <PanelColorSettings
        title={__("General", "ultimate-blocks-pro")}
        initialOpen={false}
        colorSettings={[
          {
            value: bgColor,
            onChange: (colorValue) =>
              setAttributes({
                bgColor: colorValue,
              }),
            label: __("Background", "ultimate-blocks-pro"),
          },
          fontColor !== "inherit" && {
            value: fontColor,
            onChange: (colorValue) =>
              setAttributes({
                fontColor: colorValue,
              }),
            label: __("Font", "ultimate-blocks-pro"),
          },
        ]}
      />
    </>
  );
  const prosConsColorProvides = <ColorControlPortal.Provider />;
  const proWrapperStyles = {
    backgroundColor: bgColor,
    color: fontColor,
  };

  const proProps = {
    proColorControls,
    prosCons,
    proWrapperStyles,
    reviewWrapperRef,
    prosConsColorProvides,
    ProInspectorContextProvider,
  };
  return (
    <>
      <BlockEdit {...props} {...proProps} />
    </>
  );
}
