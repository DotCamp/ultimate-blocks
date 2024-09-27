import { useEffect, Fragment } from "@wordpress/element";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { dashesToCamelcase } from "../../global";
import { IconControl, IconSizePicker } from "@Library/ub-common/Components";
import InspectorControlsStylesTab from "@Components/Common/InspectorControlsStylesTab";
import {
  PanelColorSettings,
  InspectorControls,
  HeightControl,
  BlockAlignmentControl,
  BlockControls,
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { select } from "@wordpress/data";
import {
  PanelBody,
  PanelRow,
  RangeControl,
  SelectControl,
  Button,
  ButtonGroup,
} from "@wordpress/components";
import { getStyles } from "./get-styles";
import {
  CustomToggleGroupControl,
  SpacingControl,
} from "../../components/StylingControls";
import { AVAILABLE_JUSTIFICATIONS } from "../../common";

const allIcons = Object.assign(fas, fab);

function NewDividerBlock(props) {
  const {
    attributes: {
      blockID,
      borderSize,
      borderStyle,
      borderColor,
      borderHeight,
      width,
      alignment,
      icon,
      iconBackgroundColor,
      iconSize,
      iconAlignment,
      orientation,
      lineHeight,
      isWidthControlChanged,
      dividerWidth,
      align,
    },
    isSelected,
    setAttributes,
    clientId,
    className,
  } = props;

  useEffect(() => {
    const { getBlock, getClientIdsWithDescendants } =
      select("core/block-editor") || select("core/editor");

    if (blockID === "") {
      setAttributes({ blockID: clientId });
    }
    if (!isWidthControlChanged) {
      setAttributes({ dividerWidth: `${width}%`, isWidthControlChanged: true });
    }
  }, []);
  useEffect(() => {
    setAttributes({ blockID: clientId });
  }, [clientId]);
  const styles = getStyles(props.attributes);
  const borderName = orientation === "horizontal" ? "borderTop" : "borderLeft";
  const dividerWrapperStyle =
    orientation === "horizontal"
      ? {
          height: `${borderHeight}px`,
          width: dividerWidth,
        }
      : {
          width: borderSize + "px",
          height: lineHeight,
        };
  const horizontalSpacing =
    orientation === "horizontal"
      ? {
          marginTop: borderHeight + "px",
          marginBottom: borderHeight + "px",
        }
      : {};
  const dividerStyle =
    orientation === "horizontal" ? horizontalSpacing : { height: "100%" };

  return (
    <>
      <BlockControls group="block">
        <BlockAlignmentControl
          value={align}
          onChange={(newValue) => setAttributes({ align: newValue })}
        />
      </BlockControls>
      {isSelected && (
        <Fragment>
          <InspectorControls>
            <PanelBody title={__("Line Settings", "ultimate-blocks-pro")}>
              <RangeControl
                label={__("Thickness")}
                value={borderSize}
                onChange={(value) => setAttributes({ borderSize: value })}
                min={1}
                resetFallbackValue={2}
                max={20}
                beforeIcon="minus"
                allowReset
              />

              {orientation === "horizontal" && (
                <>
                  <RangeControl
                    label={__("Height")}
                    value={borderHeight}
                    onChange={(value) => setAttributes({ borderHeight: value })}
                    min={10}
                    max={200}
                    resetFallbackValue={20}
                    beforeIcon="minus"
                    allowReset
                  />
                  <HeightControl
                    label={__("Width", "ultimate-blocks-pro")}
                    value={dividerWidth}
                    onChange={(value) => setAttributes({ dividerWidth: value })}
                    allowReset
                  />
                  <br></br>
                </>
              )}
              {orientation === "vertical" && (
                <>
                  <HeightControl
                    label={__("Line Height")}
                    value={lineHeight}
                    onChange={(value) => setAttributes({ lineHeight: value })}
                    allowReset
                  />
                  <br></br>
                </>
              )}
              <CustomToggleGroupControl
                isAdaptiveWidth
                options={[
                  {
                    label: __("Horizontal", "ultimate-blocks-pro"),
                    value: "horizontal",
                  },
                  {
                    label: __("Vertical", "ultimate-blocks-pro"),
                    value: "vertical",
                  },
                ]}
                attributeKey="orientation"
                label={__("Orientation", "ultimate-blocks-pro")}
              />
              {(width < 100 || orientation === "vertical") && (
                <CustomToggleGroupControl
                  isAdaptiveWidth
                  options={AVAILABLE_JUSTIFICATIONS.slice(
                    0,
                    AVAILABLE_JUSTIFICATIONS.length - 1
                  )}
                  attributeKey="alignment"
                  label={__("Alignment", "ultimate-blocks-pro")}
                />
              )}
            </PanelBody>
            <PanelBody
              title={__("Icon", "ultimate-blocks-pro")}
              initialOpen={false}
            >
              <IconControl
                label={__("Icon", "ultimate-blocks-pro")}
                selectedIcon={icon}
                onIconSelect={(val) => setAttributes({ icon: val })}
              />
              {icon && (
                <>
                  <div className="ub-divider-icon-alignment-vertical">
                    <CustomToggleGroupControl
                      isAdaptiveWidth
                      options={AVAILABLE_JUSTIFICATIONS.slice(
                        0,
                        AVAILABLE_JUSTIFICATIONS.length - 1
                      )}
                      attributeKey="iconAlignment"
                      label={__("Alignment", "ultimate-blocks-pro")}
                    />
                  </div>
                  <IconSizePicker
                    size={iconSize}
                    sizeChangeCallback={(val) =>
                      setAttributes({ iconSize: val })
                    }
                  />
                </>
              )}
            </PanelBody>
          </InspectorControls>
          <InspectorControlsStylesTab>
            <PanelBody
              initialOpen={false}
              title={__("Divider", "ultimate-blocks-pro")}
            >
              <SelectControl
                label={__("Line type")}
                value={borderStyle}
                options={[
                  {
                    value: "solid",
                    label: __("solid", "ultimate-blocks-pro"),
                  },
                  {
                    value: "dotted",
                    label: __("dotted", "ultimate-blocks-pro"),
                  },
                  {
                    value: "dashed",
                    label: __("dashed", "ultimate-blocks-pro"),
                  },
                ]}
                onChange={(typeVal) => setAttributes({ borderStyle: typeVal })}
              />
            </PanelBody>
            <PanelBody
              initialOpen={false}
              title={__("Colors", "ultimate-blocks-pro")}
            >
              <PanelColorSettings
                title={__("Line", "ultimate-blocks-pro")}
                initialOpen={true}
                colorSettings={[
                  {
                    value: borderColor,
                    onChange: (colorVal) =>
                      setAttributes({
                        borderColor: colorVal,
                      }),
                    label: __("Main", "ultimate-blocks-pro"),
                  },
                ]}
              />
              {icon && (
                <PanelColorSettings
                  title={__("Icon", "ultimate-blocks-pro")}
                  initialOpen={true}
                  colorSettings={[
                    {
                      value: iconBackgroundColor,
                      onChange: (colorVal) =>
                        setAttributes({
                          iconBackgroundColor: colorVal,
                        }),
                      label: __("Background", "ultimate-blocks-pro"),
                    },
                  ]}
                />
              )}
            </PanelBody>
            <PanelBody
              title={__("Dimension Settings", "ultimate-blocks-pro")}
              initialOpen={false}
            >
              <SpacingControl
                showByDefault
                attrKey="padding"
                label={__("Padding", "ultimate-blocks-pro")}
              />
              <SpacingControl
                minimumCustomValue={-Infinity}
                showByDefault
                attrKey="margin"
                label={__("Margin", "ultimate-blocks-pro")}
              />
              <SpacingControl
                sides={["all"]}
                showByDefault
                attrKey="iconSpacing"
                label={__("Icon Space", "ultimate-blocks-pro")}
              />
            </PanelBody>
          </InspectorControlsStylesTab>
        </Fragment>
      )}

      <div
        className={`ub_divider ${className || ""}`}
        style={{
          ...Object.assign(
            dividerWrapperStyle,
            // eslint-disable-next-line no-nested-ternary
            alignment === "left"
              ? { marginLeft: "0" }
              : alignment === "right"
              ? { marginRight: "0" }
              : {}
          ),
          ...styles,
        }}
      >
        <div
          className={"ub_divider_line"}
          style={{
            [borderName]: `${borderSize}px ${borderStyle} ${borderColor}`,
            ...dividerStyle,
          }}
        />
        {icon && (
          <div
            data-icon-alignment={iconAlignment}
            className="ub_divider_icon"
            style={{
              backgroundColor: iconBackgroundColor,
              ...horizontalSpacing,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={iconSize}
              width={iconSize}
              viewBox={`0, 0, ${
                allIcons[`fa${dashesToCamelcase(icon)}`].icon[0]
              },  ${allIcons[`fa${dashesToCamelcase(icon)}`].icon[1]}`}
            >
              <path
                fill={borderColor}
                d={allIcons[`fa${dashesToCamelcase(icon)}`].icon[4]}
              />
            </svg>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * @module NewDividerBlock
 */
export default NewDividerBlock;
