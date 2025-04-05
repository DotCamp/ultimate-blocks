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
  }
  render() {
    const { attributes, setAttributes, showIconControls, showImageControls } =
      this.props;
    const {
      activeTab,
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
              <CallToActionTabControls
                cTAList={tabCallToAction}
                setAttributes={setAttributes}
                activeTabIndex={activeTab}
              />
            </InspectorControls>
          </Fragment>
        )}
      </>
    );
  }
}
