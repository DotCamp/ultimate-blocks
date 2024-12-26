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
  generateStyles,
  getBorderVariablesCss,
  getSpacingCss,
} from "../../utils/styling-helpers";
const { __ } = wp.i18n;

const {
  RichText,
  InnerBlocks,
  BlockControls,
  AlignmentToolbar,
  InspectorControls,
} = wp.blockEditor || wp.editor;

const {
  PanelBody,
  PanelRow,
  SelectControl,
  RangeControl,
  TextControl,
  ToggleControl,
} = wp.components;

const { select, dispatch, useSelect } = wp.data;

export function NewExpandBlock(props) {
  const { attributes, setAttributes, isSelected, clientId } = props;

  const {
    blockID,
    fade,
    allowScroll,
    scrollOption,
    scrollOffset,
    scrollTarget,
    scrollTargetType,
  } = attributes;

  const { getBlock, getClientIdsWithDescendants } =
    select("core/block-editor") || select("core/editor");
  const { updateBlockAttributes } =
    dispatch("core/block-editor") || dispatch("core/editor");

  const selectedBlockID = useSelect((select) => {
    return (
      select("core/block-editor") || select("core/editor")
    ).getSelectedBlockClientId();
  }, []);

  const showPreviewText = __("show more");

  const hidePreviewText = __("show less");

  const block = getBlock(clientId);
  const rootBlock = getParentBlock(clientId, "core/block");

  const fullVersionVisibility =
    selectedBlockID === clientId || block
      ? getDescendantBlocks(block)
          .map((b) => b.clientId)
          .includes(selectedBlockID)
      : false;
  const blockClientID = block !== null ? block.clientId : clientId;
  useEffect(() => {
    if (!rootBlock) {
      setAttributes({ blockID: blockClientID });
    }
  }, [blockClientID]);
  useEffect(() => {
    if (blockID === "") {
      setAttributes({
        blockID: blockClientID,
      });
    }
  }, []);
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
  const paddingObj = getSpacingCss(attributes.padding);
  const buttonPaddingObj = getSpacingCss(attributes.expandButtonPadding);
  const marginObj = getSpacingCss(attributes.margin);
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
  let styles = {
    "--ub-expand-button-color": attributes.expandButtonColor,
    "--ub-expand-button-bg-color": !isEmpty(attributes?.expandButtonBgColor)
      ? attributes.expandButtonBgColor
      : attributes?.expandButtonBgGradient,
    "--ub-expand-button-padding-top": buttonPaddingObj?.top,
    "--ub-expand-button-padding-right": buttonPaddingObj?.right,
    "--ub-expand-button-padding-bottom": buttonPaddingObj?.bottom,
    "--ub-expand-button-padding-left": buttonPaddingObj?.left,
    paddingTop: paddingObj?.top,
    paddingRight: paddingObj?.right,
    paddingBottom: paddingObj?.bottom,
    paddingLeft: paddingObj?.left,
    marginTop: marginObj?.top,
    marginRight: marginObj?.right,
    marginBottom: marginObj?.bottom,
    marginLeft: marginObj?.left,
    ...buttonBorderRadius,
    ...buttonBorderVariables,
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Scroll Settings")}>
          <PanelRow>
            <label htmlFor="ub_expand_toggle_display">
              {__("Allow scrolling")}
            </label>
            <ToggleControl
              id="ub_expand_toggle_display"
              checked={allowScroll}
              onChange={() => setAttributes({ allowScroll: !allowScroll })}
            />
          </PanelRow>
          {allowScroll && (
            <>
              <SelectControl
                label={__("Scroll offset adjustment")}
                value={scrollOption}
                options={[
                  {
                    label: __(
                      "Relative to first available fixed/sticky element"
                    ),
                    value: "auto",
                  },
                  {
                    label: __("Relative to a specific element"),
                    value: "namedelement",
                  },
                  {
                    label: __("Fixed height"),
                    value: "fixedamount",
                  },
                ]}
                onChange={(scrollOption) => setAttributes({ scrollOption })}
              />
              {scrollOption === "namedelement" && (
                <>
                  <SelectControl
                    label={__("Scroll reference name type")}
                    value={scrollTargetType}
                    options={["id", "class", "element"].map((a) => ({
                      label: __(a),
                      value: a,
                    }))}
                    onChange={(scrollTargetType) =>
                      setAttributes({ scrollTargetType })
                    }
                  />
                  <TextControl
                    label={__("Reference element for scroll offset")}
                    value={scrollTarget}
                    onChange={(scrollTarget) => setAttributes({ scrollTarget })}
                  />
                </>
              )}
              {scrollOption === "fixedamount" && (
                <RangeControl
                  label={__("Scroll offset (pixels)")}
                  value={scrollOffset}
                  onChange={(scrollOffset) => setAttributes({ scrollOffset })}
                  min={0}
                  max={200}
                  allowReset
                />
              )}
            </>
          )}
        </PanelBody>
        <PanelRow>
          <div id="ub_expand_fade_option_container">
            <label htmlFor="ub_expand_fade_option">
              {__("Fade when minimized")}
            </label>
            <ToggleControl
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
          </div>
        </PanelRow>
      </InspectorControls>
      {hasButtonStyleClass && (
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
              borderRadiusLabel={__(
                "Button Border Radius",
                "ultimate-blocks-pro"
              )}
            />
          </InspectorControls>
        </>
      )}

      <InspectorControls group="styles">
        <PanelBody
          title={__("Dimension Settings", "ultimate-blocks-pro")}
          initialOpen={false}
        >
          <SpacingControl
            showByDefault
            attrKey="padding"
            label={__("Padding", "ultimate-blocks-pro")}
          />
          {hasButtonStyleClass && (
            <SpacingControl
              showByDefault
              attrKey="expandButtonPadding"
              label={__("Button Padding", "ultimate-blocks-pro")}
            />
          )}
          <SpacingControl
            minimumCustomValue={-Infinity}
            showByDefault
            attrKey="margin"
            label={__("Margin", "ultimate-blocks-pro")}
          />
        </PanelBody>
      </InspectorControls>
      <div className="ub-expand" style={generateStyles(styles)}>
        <InnerBlocks
          templateLock={"all"}
          template={[
            [
              "ub/expand-portion",
              {
                displayType: "partial",
                clickText: showPreviewText,
                isVisible: true,
                isFaded: true,
              },
            ],
            [
              "ub/expand-portion",
              {
                displayType: "full",
                clickText: hidePreviewText,
                isVisible: false,
                isFaded: false,
              },
            ],
          ]}
        />
      </div>
    </>
  );
}

export function NewExpandPortionBlock(props) {
  const { attributes, setAttributes, clientId } = props;
  const { getBlock, getBlockRootClientId } =
    select("core/block-editor") || select("core/editor");
  const { updateBlockAttributes } =
    dispatch("core/block-editor") || dispatch("core/editor");

  const {
    clickText,
    displayType,
    isVisible,
    toggleAlign,
    parentID,
    fade,
    isFaded,
  } = attributes;

  const ConditionalWrapper = ({ condition, children, wrap }) =>
    condition ? wrap(children) : <>{children}</>;

  useEffect(() => {
    const parentBlockID = getBlockRootClientId(clientId);
    const parentBlock = getBlock(parentBlockID);
    const rootBlock = getParentBlock(clientId, "core/block");

    if (!rootBlock) {
      if (
        attributes.parentID === "" ||
        (parentBlock &&
          attributes.parentID !== getBlock(parentBlockID).attributes.blockID)
      ) {
        setAttributes({
          parentID: getBlock(parentBlockID).attributes.blockID,
        });
      }
    }
  });

  return (
    <>
      <BlockControls>
        <AlignmentToolbar
          value={toggleAlign} //attribute from parent can't be directly used
          onChange={(newAlignment) => {
            updateBlockAttributes(parentID, {
              toggleAlign: newAlignment,
            });

            getBlock(parentID).innerBlocks.forEach((innerBlock) =>
              updateBlockAttributes(innerBlock.clientId, {
                toggleAlign: newAlignment,
              })
            );
          }}
          controls={["left", "center", "right"]}
        />
      </BlockControls>
      <div
        className={`ub-expand-portion ub-expand-${displayType}${
          displayType === "full" && !isVisible ? " ub-hide" : ""
        }`}
      >
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
        <RichText
          tagName="a"
          className="ub-expand-toggle-button"
          style={{ textAlign: toggleAlign }} //attribute from parent can't be directly used
          value={clickText}
          onChange={(value) => setAttributes({ clickText: value })}
          placeholder={__(
            `Text for show ${displayType === "full" ? "less" : "more"} button`
          )}
        />
      </div>
    </>
  );
}
