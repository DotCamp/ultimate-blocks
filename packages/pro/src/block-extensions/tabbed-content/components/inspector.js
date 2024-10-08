import React, { Fragment } from "react";
import { __ } from "@wordpress/i18n";
import { Component } from "@wordpress/element";
import {
  BorderControl,
  ColorSettings,
  SpacingControl,
} from "../../../components/StylingControls";
import { InspectorControls } from "@wordpress/block-editor";
import SavedStylesInspectorPanel from "@Components/SavedStyles/SavedStylesInspectorPanel";
import {
  PanelBody,
  PanelRow,
  ToggleControl,
  RadioControl,
  TextControl,
  ButtonGroup,
  Button,
} from "@wordpress/components";
import {
  horizontalTabIcon,
  verticalTabIcon,
  accordionIcon,
} from "../icons/icon";
import BooleanToggleControl from "@Base/js/components/editor/controls/BooleanToggleControl.js";
import TabIconControls from "./tabIcon/TabIconControls";
import TabImageControls from "./tabImage/TabImageControls";
import CallToActionTabControls from "./callToAction/CallToActionTabControls";
import InspectorControlsStylesTab from "@Components/Common/InspectorControlsStylesTab";

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {
  constructor(props) {
    super(props);
    this.state = { displayMode: "desktop" };
  }
  render() {
    const { displayMode } = this.state;
    const { attributes, setAttributes, showIconControls, showImageControls } =
      this.props;
    const {
      activeTab,
      tabVertical,
      tabletTabDisplay,
      mobileTabDisplay,
      tabsTitle,
      tabsAnchor,
      useAnchors,
      tabStyle,
      tabsSubTitleEnabled,
      tabsIconStatus,
      tabIcons,
      tabIconSize,
      tabCallToAction,
      tabsImageStatus,
      tabImages,
      tabImageWidth,
      tabImageHeight,
    } = attributes;

    return (
      <>
        {showIconControls && (
          <InspectorControls>
            <TabIconControls
              activeTabIndex={activeTab}
              tabsIconStatus={tabsIconStatus}
              tabIcons={tabIcons}
              setAttributes={setAttributes}
              tabIconSize={tabIconSize}
            />
          </InspectorControls>
        )}
        {showImageControls && (
          <InspectorControls>
            <TabImageControls
              activeTabIndex={activeTab}
              tabsImageStatus={tabsImageStatus}
              tabImages={tabImages}
              setAttributes={setAttributes}
              tabImageWidth={tabImageWidth}
              tabImageHeight={tabImageHeight}
            />
          </InspectorControls>
        )}
        {!showIconControls && !showImageControls && (
          <Fragment>
            <InspectorControlsStylesTab>
              <SavedStylesInspectorPanel
                attributes={(() => {
                  /* eslint-disable no-unused-vars */
                  const {
                    blockID,
                    activeTab,
                    id,
                    activeControl,
                    tabsTitle,
                    tabsTitleAlignment,
                    ...rest
                  } = attributes;
                  /* eslint-enable no-unused-vars */

                  return rest;
                })()}
                setAttribute={(val) => {
                  // back-compat for any styles generated before fix
                  const { tabsTitle, tabsTitleAlignment, ...rest } = val;

                  setAttributes(rest);
                }}
                previewAttributeCallback={(attr) => attr}
                previewElementCallback={(el) => {
                  const isVertical = el.querySelector(".vertical-holder");

                  if (!isVertical) {
                    const horizontalTabs = Array.from(
                      el.querySelectorAll(
                        ".wp-block-ub-tabbed-content-tabs-title .wp-block-ub-tabbed-content-tab-title-wrap"
                      )
                    );

                    if (horizontalTabs.length > 0) {
                      const tabAddButton = horizontalTabs.pop();
                      tabAddButton.parentNode.removeChild(tabAddButton);
                    }
                  } else {
                    const verticalTabs = Array.from(
                      el.querySelectorAll(
                        ".wp-block-ub-tabbed-content-tabs-title-vertical-tab .wp-block-ub-tabbed-content-tab-title-vertical-wrap"
                      )
                    );

                    if (verticalTabs.length > 0) {
                      const verticalTabAddButton = verticalTabs.pop();
                      verticalTabAddButton.parentNode.removeChild(
                        verticalTabAddButton
                      );
                    }

                    const verticalTabHolder = el.querySelector(
                      ".vertical-tab-width"
                    );

                    if (verticalTabHolder) {
                      verticalTabHolder.style.width = "fit-content";
                    }
                  }

                  const tabContentContainer = el.querySelector(
                    ".block-editor-inner-blocks"
                  );

                  if (tabContentContainer) {
                    tabContentContainer.innerHTML = `<p>${__(
                      "Tab Content",
                      "ultimate-blocks-pro"
                    )}</p>`;
                  }

                  return el;
                }}
              />

              <PanelBody
                title={__("Tab Layout", "ultimate-blocks-pro")}
                initialOpen={false}
              >
                <PanelRow>
                  <label>{__("Mode")}</label>
                  <ButtonGroup style={{ paddingBottom: "10px" }}>
                    <Button
                      icon="desktop"
                      showTooltip={true}
                      label={__("Desktop")}
                      isPressed={displayMode === "desktop"}
                      onClick={() =>
                        this.setState({
                          displayMode: "desktop",
                        })
                      }
                    />
                    <Button
                      icon="tablet"
                      showTooltip={true}
                      label={__("Tablet")}
                      isPressed={displayMode === "tablet"}
                      onClick={() =>
                        this.setState({
                          displayMode: "tablet",
                        })
                      }
                    />
                    <Button
                      icon="smartphone"
                      showTooltip={true}
                      label={__("Mobile")}
                      isPressed={displayMode === "mobile"}
                      onClick={() =>
                        this.setState({
                          displayMode: "mobile",
                        })
                      }
                    />
                  </ButtonGroup>
                </PanelRow>
                {displayMode === "desktop" && (
                  <PanelRow>
                    <label>{__("Tab Display")}</label>
                    <ButtonGroup>
                      <Button
                        icon={horizontalTabIcon}
                        showTooltip={true}
                        label={__("Horizontal")}
                        isPressed={!tabVertical}
                        onClick={() =>
                          setAttributes({
                            tabVertical: false,
                          })
                        }
                      />
                      <Button
                        icon={verticalTabIcon}
                        showTooltip={true}
                        label={__("Vertical")}
                        isPressed={tabVertical}
                        onClick={() =>
                          setAttributes({
                            tabVertical: true,
                          })
                        }
                      />
                    </ButtonGroup>
                  </PanelRow>
                )}
                {displayMode === "tablet" && (
                  <PanelRow>
                    <label>{__("Tablet Tab Display")}</label>
                    <ButtonGroup>
                      <Button
                        icon={horizontalTabIcon}
                        showTooltip={true}
                        label={__("Horizontal")}
                        isPressed={tabletTabDisplay === "horizontaltab"}
                        onClick={() =>
                          setAttributes({
                            tabletTabDisplay: "horizontaltab",
                          })
                        }
                      />
                      <Button
                        icon={verticalTabIcon}
                        showTooltip={true}
                        label={__("Vertical")}
                        isPressed={tabletTabDisplay === "verticaltab"}
                        onClick={() =>
                          setAttributes({
                            tabletTabDisplay: "verticaltab",
                          })
                        }
                      />
                      <Button
                        icon={accordionIcon}
                        showTooltip={true}
                        label={__("Accordion")}
                        isPressed={tabletTabDisplay === "accordion"}
                        onClick={() =>
                          setAttributes({
                            tabletTabDisplay: "accordion",
                          })
                        }
                      />
                    </ButtonGroup>
                  </PanelRow>
                )}
                {displayMode === "mobile" && (
                  <PanelRow>
                    <label>{__("Mobile Tab Display")}</label>
                    <ButtonGroup>
                      <Button
                        icon={horizontalTabIcon}
                        showTooltip={true}
                        label={__("Horizontal")}
                        isPressed={mobileTabDisplay === "horizontaltab"}
                        onClick={() =>
                          setAttributes({
                            mobileTabDisplay: "horizontaltab",
                          })
                        }
                      />
                      <Button
                        icon={verticalTabIcon}
                        showTooltip={true}
                        label={__("Vertical")}
                        isPressed={mobileTabDisplay === "verticaltab"}
                        onClick={() =>
                          setAttributes({
                            mobileTabDisplay: "verticaltab",
                          })
                        }
                      />
                      <Button
                        icon={accordionIcon}
                        showTooltip={true}
                        label={__("Accordion")}
                        isPressed={mobileTabDisplay === "accordion"}
                        onClick={() =>
                          setAttributes({
                            mobileTabDisplay: "accordion",
                          })
                        }
                      />
                    </ButtonGroup>
                  </PanelRow>
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
              </PanelBody>
            </InspectorControlsStylesTab>
            <InspectorControls>
              <SavedStylesInspectorPanel
                visibility={false}
                attributes={(() => {
                  /* eslint-disable no-unused-vars */
                  const {
                    blockID,
                    activeTab,
                    id,
                    activeControl,
                    tabsTitle,
                    tabsTitleAlignment,
                    ...rest
                  } = attributes;
                  /* eslint-enable no-unused-vars */

                  return rest;
                })()}
                setAttribute={(val) => {
                  // back-compat for any styles generated before fix
                  const { tabsTitle, tabsTitleAlignment, ...rest } = val;

                  setAttributes(rest);
                }}
                previewAttributeCallback={(attr) => attr}
                previewElementCallback={(el) => {
                  const isVertical = el.querySelector(".vertical-holder");

                  if (!isVertical) {
                    const horizontalTabs = Array.from(
                      el.querySelectorAll(
                        ".wp-block-ub-tabbed-content-tabs-title .wp-block-ub-tabbed-content-tab-title-wrap"
                      )
                    );

                    if (horizontalTabs.length > 0) {
                      const tabAddButton = horizontalTabs.pop();
                      tabAddButton.parentNode.removeChild(tabAddButton);
                    }
                  } else {
                    const verticalTabs = Array.from(
                      el.querySelectorAll(
                        ".wp-block-ub-tabbed-content-tabs-title-vertical-tab .wp-block-ub-tabbed-content-tab-title-vertical-wrap"
                      )
                    );

                    if (verticalTabs.length > 0) {
                      const verticalTabAddButton = verticalTabs.pop();
                      verticalTabAddButton.parentNode.removeChild(
                        verticalTabAddButton
                      );
                    }

                    const verticalTabHolder = el.querySelector(
                      ".vertical-tab-width"
                    );

                    if (verticalTabHolder) {
                      verticalTabHolder.style.width = "fit-content";
                    }
                  }

                  const tabContentContainer = el.querySelector(
                    ".block-editor-inner-blocks"
                  );

                  if (tabContentContainer) {
                    tabContentContainer.innerHTML = `<p>${__(
                      "Tab Content",
                      "ultimate-blocks-pro"
                    )}</p>`;
                  }

                  return el;
                }}
              />
              <PanelBody title={__("General", "ultimate-blocks-pro")}>
                <BooleanToggleControl
                  value={tabsSubTitleEnabled}
                  label={__("Tab title secondary text", "ultimate-blocks-pro")}
                  attributeId={"tabsSubTitleEnabled"}
                  setAttributes={setAttributes}
                />
                <BooleanToggleControl
                  disabled={tabsImageStatus}
                  value={tabsIconStatus}
                  label={__("Tab title icons", "ultimate-blocks-pro")}
                  attributeId={"tabsIconStatus"}
                  setAttributes={setAttributes}
                />
                <BooleanToggleControl
                  disabled={tabsIconStatus}
                  value={tabsImageStatus}
                  label={__("Tab title image", "ultimate-blocks-pro")}
                  attributeId={"tabsImageStatus"}
                  setAttributes={setAttributes}
                />
              </PanelBody>
              <PanelBody
                title={__("Tab Type", "ultimate-blocks-pro")}
                initialOpen={false}
              >
                <RadioControl
                  selected={tabStyle}
                  options={["tabs", "pills", "underline"].map((a) => ({
                    label: __(a),
                    value: a,
                  }))}
                  onChange={(tabStyle) => setAttributes({ tabStyle })}
                />
              </PanelBody>
              <CallToActionTabControls
                cTAList={tabCallToAction}
                setAttributes={setAttributes}
                activeTabIndex={activeTab}
              />
              <PanelBody
                title={__("Tab Anchors", "ultimate-blocks-pro")}
                initialOpen={false}
              >
                <ToggleControl
                  label={__("Use tab anchors")}
                  checked={useAnchors}
                  onChange={(useAnchors) => {
                    setAttributes({
                      useAnchors,
                      tabsAnchor: useAnchors
                        ? Array(tabsTitle.length).fill("")
                        : [],
                    });
                  }}
                />
                {useAnchors && (
                  <TextControl
                    label={__("Anchor for current tab")}
                    value={tabsAnchor[activeTab]}
                    onChange={(newAnchor) =>
                      setAttributes({
                        tabsAnchor: [
                          ...tabsAnchor.slice(0, activeTab),
                          newAnchor.replace(/\s/g, ""),
                          ...tabsAnchor.slice(activeTab + 1),
                        ],
                      })
                    }
                    help={__(
                      "Add an anchor text to let the contents of the active tab be accessed directly through a link"
                    )}
                  />
                )}
              </PanelBody>
            </InspectorControls>
            <InspectorControls group="color">
              {!(
                tabStyle === "underline" &&
                ![tabletTabDisplay, mobileTabDisplay].includes("accordion")
              ) && (
                <>
                  <ColorSettings
                    attrKey="normalColor"
                    label={__("Tab Color", "ultimate-blocks-pro")}
                  />
                  <ColorSettings
                    attrKey="theme"
                    label={__("Active Tab Color", "ultimate-blocks-pro")}
                  />
                </>
              )}
              <ColorSettings
                attrKey="normalTitleColor"
                label={__("Tab Title Color", "ultimate-blocks-pro")}
              />
              <ColorSettings
                attrKey="titleColor"
                label={__("Active Tab Title Color", "ultimate-blocks-pro")}
              />
              <ColorSettings
                attrKey="contentColor"
                label={__("Content Color", "ultimate-blocks-pro")}
              />
              <ColorSettings
                attrKey="contentBackground"
                label={__("Content Background", "ultimate-blocks-pro")}
              />
            </InspectorControls>
          </Fragment>
        )}
        <InspectorControls group="border">
          <BorderControl
            isShowBorder={false}
            showDefaultBorderRadius
            attrBorderRadiusKey="tabButtonsBorderRadius"
            borderRadiusLabel={__(
              "Tab Buttons Border Radius",
              "ultimate-blocks"
            )}
          />
          <BorderControl
            isShowBorder={false}
            showDefaultBorderRadius
            attrBorderRadiusKey="tabContentsBorderRadius"
            borderRadiusLabel={__(
              "Tab Contents Border Radius",
              "ultimate-blocks"
            )}
          />
        </InspectorControls>
      </>
    );
  }
}
