/**
 * Wordpress Dependencies
 */
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { InspectorControls } from "@wordpress/block-editor";
import {
  Button,
  PanelBody,
  ToggleControl,
  RangeControl,
  PanelRow,
  Modal,
  Tip,
} from "@wordpress/components";
import { edit } from "@wordpress/icons";
/**
 * Internal Imports
 */
import {
  ColorSettings,
  ColorSettingsWithGradient,
  BorderControl,
  CustomToggleGroupControl,
  SpacingControlWithToolsPanel,
} from "../../components/StylingControls";
import {
  AVAILABLE_JUSTIFICATIONS,
  VERTICAL_ALIGNMENT_CONTROLS,
} from "../../common";
import IconsLibrary from "../../components/IconLibrary/library";
import SVGComponent from "./get-icon";
import { Disabled } from "@wordpress/components";

function Inspector(props) {
  const { attributes, setAttributes } = props;
  const [isLibraryOpen, setLibraryOpen] = useState(false);

  const {
    numberedConnector,
    showConnectors,
    connectorSize,
    timelineAlignment,
    showOppositeText,
    showTimelineProgress,
    iconConnector,
    icon,
    connectorIconSize,
    timelineType,
    itemsPerView,
    showArrow,
    enableDragging,
    arrowColor,
  } = attributes;

  const UPDATED_JUSTIFICATION = AVAILABLE_JUSTIFICATIONS.filter(
    (align) => align.value !== "space-between"
  );
  const HORIZONTAL_TIMELINE_TYPE = VERTICAL_ALIGNMENT_CONTROLS.filter(
    (align) => align.value !== "center"
  );
  const hasIcon = !isEmpty(icon);
  const onTimelineTypeChange = (newAttributes) => {
    if (newAttributes.timelineType === "vertical") {
      setAttributes({
        connectorPosition: "center",
        timelineAlignment: "center",
      });
    } else {
      setAttributes({
        connectorPosition: "center",
        timelineAlignment: "top",
      });
    }
  };
  return (
    <>
      <InspectorControls>
        <PanelBody>
          <CustomToggleGroupControl
            callBack={onTimelineTypeChange}
            attributeKey="timelineType"
            options={[
              {
                value: "vertical",
                label: __("Vertical", "ultimate-blocks-pro"),
              },
              {
                value: "horizontal",
                label: __("Horizontal", "ultimate-blocks-pro"),
              },
            ]}
            label={__("Timeline Type", "ultimate-blocks-pro")}
          />
          {timelineType === "horizontal" && (
            <RangeControl
              value={itemsPerView}
              min={1}
              max={6}
              label={__("Items Per View", "ultimate-blocks-pro")}
              onChange={(newValue) => setAttributes({ itemsPerView: newValue })}
            />
          )}
          {timelineType === "vertical" && (
            <CustomToggleGroupControl
              attributeKey="timelineAlignment"
              options={UPDATED_JUSTIFICATION}
              label={__("Timeline Position", "ultimate-blocks-pro")}
            />
          )}
          {timelineType === "horizontal" && (
            <CustomToggleGroupControl
              attributeKey="timelineAlignment"
              options={HORIZONTAL_TIMELINE_TYPE}
              label={__("Timeline Position", "ultimate-blocks-pro")}
            />
          )}
          {timelineAlignment === "center" && (
            <CustomToggleGroupControl
              attributeKey="timelineItemStartsFrom"
              options={[
                { value: "left", label: __("Left", "ultimate-blocks-pro") },
                { value: "right", label: __("Right", "ultimate-blocks-pro") },
              ]}
              label={__("Items Starting Position", "ultimate-blocks-pro")}
            />
          )}
          <Disabled isDisabled={timelineType === "horizontal"}>
            <ToggleControl
              checked={showTimelineProgress}
              label={__("Timeline Progress", "ultimate-blocks-pro")}
              onChange={() =>
                setAttributes({ showTimelineProgress: !showTimelineProgress })
              }
              help={__(
                "This feature will work only on frontend.",
                "ultimate-blocks-pro"
              )}
            />
            {timelineType === "horizontal" && (
              <>
                <Tip>
                  {__("This Feature only works with", "ultimate-blocks-pro")}
                  <b>{__(" Vertical Timeline", "ultimate-blocks-pro")}</b>
                </Tip>
                <br></br>
              </>
            )}
          </Disabled>
          <ToggleControl
            checked={showOppositeText}
            label={__("Opposite Text", "ultimate-blocks-pro")}
            onChange={() =>
              setAttributes({ showOppositeText: !showOppositeText })
            }
          />
          <ToggleControl
            checked={showConnectors}
            label={__("Show Connectors", "ultimate-blocks-pro")}
            onChange={() => setAttributes({ showConnectors: !showConnectors })}
          />
          {timelineType === "horizontal" && (
            <>
              <ToggleControl
                checked={showArrow}
                label={__("Show Arrows", "ultimate-blocks-pro")}
                onChange={() => setAttributes({ showArrow: !showArrow })}
              />
              <ToggleControl
                checked={enableDragging}
                label={__("Enable Dragging", "ultimate-blocks-pro")}
                onChange={() =>
                  setAttributes({ enableDragging: !enableDragging })
                }
              />
            </>
          )}

          {showConnectors && (
            <>
              {timelineType === "vertical" && (
                <CustomToggleGroupControl
                  attributeKey="connectorPosition"
                  options={VERTICAL_ALIGNMENT_CONTROLS}
                  label={__("Connector Position", "ultimate-blocks-pro")}
                />
              )}
              {timelineType === "horizontal" && (
                <CustomToggleGroupControl
                  attributeKey="connectorPosition"
                  options={UPDATED_JUSTIFICATION}
                  label={__("Connector Position", "ultimate-blocks-pro")}
                />
              )}
              <ToggleControl
                disabled={iconConnector}
                checked={numberedConnector}
                label={__("Numbered Connector", "ultimate-blocks-pro")}
                onChange={() =>
                  setAttributes({
                    numberedConnector: !numberedConnector,
                    iconConnector: false,
                  })
                }
              />
              <ToggleControl
                disabled={numberedConnector}
                checked={iconConnector}
                label={__("Icon Connector", "ultimate-blocks-pro")}
                onChange={() =>
                  setAttributes({
                    iconConnector: !iconConnector,
                    numberedConnector: false,
                  })
                }
              />
              <RangeControl
                allowReset
                value={connectorSize}
                resetFallbackValue={25}
                label={__("Connector Size", "ultimate-blocks-pro")}
                onChange={(newValue) =>
                  setAttributes({ connectorSize: newValue })
                }
              />
            </>
          )}
        </PanelBody>
        {iconConnector && (
          <PanelBody
            title={__("Icon Settings", "ultimate-blocks-pro")}
            initialOpen={false}
          >
            <PanelRow>
              <span>Select Icon</span>
              <PanelRow>
                <Button
                  style={{ border: "1px solid #eeeeee" }}
                  icon={hasIcon ? <SVGComponent icon={icon} /> : edit}
                  onClick={() => setLibraryOpen(true)}
                />
                {hasIcon && (
                  <Button
                    isSmall
                    variant="secondary"
                    style={{ marginLeft: "10px", height: "30px" }}
                    onClick={() => setAttributes({ icon: {} })}
                  >
                    {__("Clear", "ultimate-blocks-pro")}
                  </Button>
                )}
              </PanelRow>
              {isLibraryOpen && (
                <Modal
                  isFullScreen
                  className="ub_icons_library_modal"
                  title={__("Icons", "ultimate-blocks-pro")}
                  onRequestClose={() => setLibraryOpen(false)}
                >
                  <IconsLibrary
                    value={icon.iconName}
                    onSelect={(newIcon) => {
                      setAttributes({ icon: newIcon });
                      setLibraryOpen(false);
                    }}
                  />
                </Modal>
              )}
            </PanelRow>
            <br />
            <RangeControl
              allowReset
              value={connectorIconSize}
              resetFallbackValue={20}
              label={__("Connector Icon Size", "ultimate-blocks-pro")}
              onChange={(newValue) =>
                setAttributes({ connectorIconSize: newValue })
              }
            />
          </PanelBody>
        )}
      </InspectorControls>

      <InspectorControls group="color">
        <ColorSettings
          attrKey="lineColor"
          label={__("Line Color", "ultimate-blocks-pro")}
        />
        {timelineType === "horizontal" && (
          <ColorSettings
            attrKey="arrowColor"
            label={__("Arrow Color", "ultimate-blocks-pro")}
          />
        )}
        {showTimelineProgress && timelineType === "vertical" && (
          <ColorSettings
            attrKey="progressLineColor"
            label={__("Progress Line Color", "ultimate-blocks-pro")}
          />
        )}
        <ColorSettings
          attrKey="contentColor"
          label={__("Content Color", "ultimate-blocks-pro")}
        />
        {showConnectors && numberedConnector && (
          <ColorSettings
            attrKey="connectorColor"
            label={__("Connector Color", "ultimate-blocks-pro")}
          />
        )}
        {iconConnector && (
          <ColorSettings
            attrKey="connectorIconColor"
            label={__("Connector Icon Color", "ultimate-blocks-pro")}
          />
        )}

        {showOppositeText && (
          <ColorSettings
            attrKey="oppositeTextColor"
            label={__("Opposite Text Color", "ultimate-blocks-pro")}
          />
        )}
        <ColorSettings
          attrKey="connectorBackground"
          label={__("Connector Background", "ultimate-blocks-pro")}
        />
        <ColorSettingsWithGradient
          attrBackgroundKey="contentBackground"
          attrGradientKey="contentGradient"
          label={__("Content Background", "ultimate-blocks-pro")}
        />
      </InspectorControls>
      <InspectorControls group="border">
        <BorderControl
          showDefaultBorder
          showDefaultBorderRadius
          attrBorderKey="contentBorder"
          attrBorderRadiusKey="contentBorderRadius"
          borderLabel={__("Content Border", "ultimate-blocks-pro")}
          borderRadiusLabel={__("Content Border Radius", "ultimate-blocks-pro")}
        />
      </InspectorControls>
      <InspectorControls group="dimensions">
        <SpacingControlWithToolsPanel
          showByDefault
          attrKey="contentPadding"
          label={__("Content Padding", "ultimate-blocks-pro")}
        />
      </InspectorControls>
    </>
  );
}
export default Inspector;
