import React, { useState, useEffect, Fragment } from "react";
import { registerBlockType } from "@wordpress/blocks";
import icon from "../icons/icon";
import icons from "../icons/icons";
import SavedStylesInspectorPanel from "@Components/SavedStyles/SavedStylesInspectorPanel";
import InspectorControlsStylesTab from "@Components/Common/InspectorControlsStylesTab";

import { __ } from "@wordpress/i18n";

import {
  RichText,
  InnerBlocks,
  InspectorControls,
  InspectorAdvancedControls,
  PanelColorSettings,
  __experimentalSpacingSizesControl as SpacingSizesControl,
} from "@wordpress/block-editor";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import {
  FormToggle,
  PanelBody,
  PanelRow,
  SelectControl,
  ButtonGroup,
  Button,
  Dropdown,
  ToggleControl,
} from "@wordpress/components";

function ContentTogglePanel(props) {
  const [showPanel, setPanelStatus] = useState(true);

  const {
    attributes: {
      theme,
      titleColor,
      titleLinkColor,
      panelTitle,
      collapsed,
      collapsedOnMobile,
      hasFAQSchema,
      titleTag,
      preventCollapse,
      toggleLocation,
      toggleColor,
      toggleIcon,
      toggleID,
      border,
      showOnlyOne,
      parentID,
      useToggleInToC,
    },
    setAttributes,
    removeBlock,
    block,
    blockParent,
    blockParentId,
    selectBlock,
    updateBlockAttributes,
  } = props;

  const toggleIconPositions = {
    left: __("Left", "ultimate-blocks-pro"),
    right: __("Right", "ultimate-blocks-pro"),
  };

  // @deprecated
  // if (parentID === '' || parentID !== blockParentId) {
  // 	setAttributes({ parentID: blockParentId });
  // }

  useEffect(() => {
    if (props.attributes.showOnlyOne && props.attributes.collapsed) {
      setPanelStatus(false);
    }
  }, []);

  useEffect(() => {
    if (showOnlyOne) {
      setPanelStatus(!collapsed);
    }
  }, [collapsed]);

  const panels = blockParent?.innerBlocks ?? [];
  const availablePanels = panels.map((panel, index) => {
    return {
      value: panel.clientId,
      label: `Panel ${index + 1}`,
    };
  });
  const defaultOpenOptions = [
    { value: "none", label: __("None", "ultimate-blocks-pro") },
    ...availablePanels,
  ];

  return (
    <Fragment>
      <InspectorControlsStylesTab>
        <SavedStylesInspectorPanel
          overrideBlockType={"ub/content-toggle-panel-block"}
          attributes={props.attributes}
          setAttribute={(allAttrs) => {
            const { panelTitle, ...attrs } = allAttrs;

            // update block and its innerblock panel attributes
            setAttributes(attrs);
          }}
          attributesToSave={(() => {
            const excludeList = ["index", "parent", "parentID", "panelTitle"];

            return Object.keys(props.attributes).filter((key) => {
              return (
                Object.prototype.hasOwnProperty.call(props.attributes, key) &&
                !excludeList.includes(key)
              );
            });
          })()}
          previewAttributeCallback={(attr) => {
            // eslint-disable-next-line no-unused-vars
            const { parent, parentID, ...rest } = attr;
            return rest;
          }}
          previewElementCallback={(el) => el}
          previewBlockType={"ub/content-toggle-panel-block-preview"}
        />
        <PanelBody title={__("Style")}>
          <PanelColorSettings
            title={__("Color Scheme")}
            initialOpen={false}
            colorSettings={[
              {
                value: theme,
                onChange: (value) => setAttributes({ theme: value }),
                label: __("Container Color"),
              },
              {
                value: titleColor,
                onChange: (value) => setAttributes({ titleColor: value }),
                label: __("Title Color"),
              },
              {
                value: titleLinkColor,
                onChange: (value) => setAttributes({ titleLinkColor: value }),
                label: __("Title link Color"),
              },
              {
                value: toggleColor,
                onChange: (value) => setAttributes({ toggleColor: value }),
                label: __("Toggle Icon Color"),
              },
            ]}
          />
          <PanelRow>
            <label htmlFor="ub-content-toggle-border">{__("Border")}</label>
            <FormToggle
              id="ub-content-toggle-border"
              label={__("Enable border")}
              checked={border}
              onChange={() => setAttributes({ border: !border })}
            />
          </PanelRow>
        </PanelBody>
        <PanelBody
          title={__("Toggle Status Icon", "ultimate-blocks-pro")}
          initialOpen={false}
        >
          {toggleIcon !== "none" && (
            <PanelRow>
              <label htmlFor="ub-content-toggle-status-location">
                {__("Location", "ultimate-blocks-pro")}
              </label>
              <ButtonGroup
                id="ub-content-toggle-status-location"
                aria-label={__("toggle icon position", "ultimate-blocks-pro")}
              >
                {Object.keys(toggleIconPositions).map((p) => {
                  if (
                    Object.prototype.hasOwnProperty.call(toggleIconPositions, p)
                  ) {
                    return (
                      <Button
                        isLarge
                        aria-pressed={toggleLocation === p}
                        isPrimary={toggleLocation === p}
                        onClick={() =>
                          setAttributes({
                            toggleLocation: p,
                          })
                        }
                      >
                        {toggleIconPositions[p]}
                      </Button>
                    );
                  }
                })}
              </ButtonGroup>
            </PanelRow>
          )}
          <PanelRow>
            <label htmlFor="ub-content-toggle-status-icon">
              {__("Icon", "ultimate-blocks-pro")}
            </label>
            <Dropdown
              position="bottom right"
              renderToggle={({ onToggle, isOpen }) => (
                <Button isLarge onClick={onToggle} area-expanded={isOpen}>
                  {icons[toggleIcon] === "none" ? (
                    <span>{__("None")}</span>
                  ) : (
                    <span className={icons[toggleIcon]} />
                  )}
                </Button>
              )}
              renderContent={() => (
                <div className="wp-block-ub-content-toggle-customize-icons-wrap">
                  {Object.keys(icons).map((i) => {
                    if (Object.prototype.hasOwnProperty.call(icons, i)) {
                      return (
                        <Button
                          isPrimary={toggleIcon === i}
                          isLarge
                          onClick={() =>
                            setAttributes({
                              toggleIcon: i,
                            })
                          }
                        >
                          {icons[i] === "none" ? (
                            __("None")
                          ) : (
                            <span className={icons[i]} />
                          )}
                        </Button>
                      );
                    }
                  })}
                </div>
              )}
            />
          </PanelRow>
        </PanelBody>
        <PanelBody
          title={__("Dimension Settings", "ultimate-blocks-pro")}
          initialOpen={false}
        >
          <SpacingSizesControl
            allowReset={true}
            label={__("Padding", "ultimate-blocks-pro")}
            values={blockParent?.attributes?.padding}
            sides={["top", "right", "bottom", "left"]}
            onChange={(newValue) => {
              updateBlockAttributes(blockParent?.clientId, {
                padding: newValue,
              });
            }}
          />
          <SpacingSizesControl
            minimumCustomValue={-Infinity}
            allowReset={true}
            label={__("Margin", "ultimate-blocks-pro")}
            values={blockParent?.attributes?.margin}
            sides={["top", "right", "bottom", "left"]}
            onChange={(newValue) => {
              updateBlockAttributes(blockParent?.clientId, {
                margin: newValue,
              });
            }}
          />
        </PanelBody>
      </InspectorControlsStylesTab>
      <InspectorControls>
        <SavedStylesInspectorPanel
          visibility={false}
          overrideBlockType={"ub/content-toggle-panel-block"}
          attributes={props.attributes}
          setAttribute={(allAttrs) => {
            const { panelTitle, ...attrs } = allAttrs;

            // update block and its innerblock panel attributes
            setAttributes(attrs);
          }}
          attributesToSave={(() => {
            const excludeList = ["index", "parent", "parentID"];

            return Object.keys(props.attributes).filter((key) => {
              return (
                Object.prototype.hasOwnProperty.call(props.attributes, key) &&
                !excludeList.includes(key)
              );
            });
          })()}
          previewAttributeCallback={(attr) => {
            // eslint-disable-next-line no-unused-vars
            const { parent, parentID, ...rest } = attr;
            return rest;
          }}
          previewElementCallback={(el) => el}
          previewBlockType={"ub/content-toggle-panel-block-preview"}
        />
        <PanelBody
          title={__("Panel Title", "ultimate-blocks-pro")}
          initialOpen={false}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 1fr",
              padding: "0 16px",
            }}
          >
            <p>{__("Select Heading Tag", "ultimate-blocks-pro")}</p>
            <SelectControl
              options={[
                {
                  value: "h1",
                  label: __("H1", "ultimate-blocks-pro"),
                },
                {
                  value: "h2",
                  label: __("H2", "ultimate-blocks-pro"),
                },
                {
                  value: "h3",
                  label: __("H3", "ultimate-blocks-pro"),
                },
                {
                  value: "h4",
                  label: __("H4", "ultimate-blocks-pro"),
                },
                {
                  value: "h5",
                  label: __("H5", "ultimate-blocks-pro"),
                },
                {
                  value: "h6",
                  label: __("H6", "ultimate-blocks-pro"),
                },
                {
                  value: "p",
                  label: __("P", "ultimate-blocks-pro"),
                },
              ]}
              value={titleTag}
              onChange={(titleTag) => setAttributes({ titleTag })}
            />
          </div>
        </PanelBody>
        <PanelBody
          title={__("Toggle State", "ultimate-blocks-pro")}
          initialOpen={false}
        >
          {blockParent && //compatibility with v 2.0.0
            !blockParent.attributes.individualCollapse &&
            !collapsedOnMobile && (
              <PanelRow>
                <label htmlFor="ub-content-toggle-amount">
                  {__("Show only one panel at a time")}
                </label>
                <FormToggle
                  id="ub-content-toggle-amount"
                  label={__("Show only one panel at a time")}
                  checked={showOnlyOne}
                  onChange={() => {
                    setAttributes({
                      showOnlyOne: !showOnlyOne,
                    });
                    if (!showOnlyOne) {
                      setAttributes({
                        collapsed: false,
                        preventCollapse: false,
                        collapsedOnMobile: false,
                      });
                    }
                  }}
                />
              </PanelRow>
            )}
          {!preventCollapse && (
            <>
              <PanelRow>
                <label htmlFor="ub-content-toggle-state">
                  {__("Collapsed")}
                </label>
                <FormToggle
                  id="ub-content-toggle-state"
                  label={__("Collapsed")}
                  checked={collapsed}
                  onChange={() => {
                    setAttributes({
                      collapsed: !collapsed,
                    });
                    if (showOnlyOne) {
                      setPanelStatus(collapsed);
                    }
                    if (!collapsed) {
                      setAttributes({
                        preventCollapse: false,
                      });
                    }
                  }}
                />
              </PanelRow>
              {collapsed && (
                <SelectControl
                  label={__("Default Open", "ultimate-blocks-pro")}
                  options={defaultOpenOptions}
                  value={
                    panels.find((panel) => panel?.attributes?.defaultOpen)
                      ?.clientId ?? "none"
                  }
                  onChange={(newId) => {
                    panels.forEach((panel) => {
                      if (panel.clientId === newId) {
                        updateBlockAttributes(panel.clientId, {
                          defaultOpen: true,
                        });
                      } else {
                        updateBlockAttributes(panel.clientId, {
                          defaultOpen: false,
                        });
                      }
                    });
                  }}
                />
              )}
              {!showOnlyOne && (
                <PanelRow>
                  <label htmlFor="ub-content-toggle-mobile-state">
                    {__("Collapsed on mobile")}
                  </label>
                  <FormToggle
                    id="ub-content-toggle-mobile-state"
                    label={__("Collapsed on mobile")}
                    checked={collapsedOnMobile}
                    onChange={() => {
                      setAttributes({
                        collapsedOnMobile: !collapsedOnMobile,
                      });
                      if (!collapsedOnMobile) {
                        setAttributes({
                          showOnlyOne: false,
                        });
                      }
                    }}
                  />
                </PanelRow>
              )}
            </>
          )}
          {blockParent && //compatibility with v 2.0.0
            !blockParent.attributes.individualCollapse &&
            !collapsed &&
            !collapsedOnMobile &&
            !showOnlyOne && (
              <PanelRow>
                <label htmlFor="ub-content-toggle-state">
                  {__("Prevent collapse")}
                </label>
                <FormToggle
                  id="ub-content-toggle-state"
                  label={__("Prevent collapse")}
                  checked={preventCollapse}
                  onChange={() =>
                    setAttributes({
                      preventCollapse: !preventCollapse,
                    })
                  }
                />
              </PanelRow>
            )}
        </PanelBody>
        <PanelBody title={__("FAQ Schema")} initialOpen={false}>
          <PanelRow>
            <label htmlFor="ub-content-toggle-faq-schema">
              {__("Enable FAQ Schema")}
            </label>
            <FormToggle
              id="ub-content-toggle-faq-schema"
              label={__("Enable FAQ Schema")}
              checked={hasFAQSchema}
              onChange={() => setAttributes({ hasFAQSchema: !hasFAQSchema })}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <InspectorAdvancedControls>
        <p>{__("Panel ID")}</p>
        <input
          type="text"
          value={toggleID}
          onChange={(e) => setAttributes({ toggleID: e.target.value })}
        />
        <p className="ub-custom-id-input">
          {__(
            "Enter a word or two — without spaces — to make a unique web address just for this block, called an “anchor.” Then, you’ll be able to link directly to this section of your page."
          )}{" "}
          <a
            href="https://wordpress.org/support/article/page-jumps/"
            target="_blank"
            rel="external noreferrer noopener"
          >
            {__("Learn more about anchors")}
            <span className="components-visually-hidden">
              {__("(opens in a new tab)")}
            </span>
            <span className="dashicons-before dashicons-external" />
          </a>
        </p>
        {titleTag !== "p" && (
          <PanelRow>
            <p>{__("Use this panel in the Table of Contents")}</p>
            <ToggleControl
              checked={useToggleInToC}
              onChange={() => {
                setAttributes({ useToggleInToC: !useToggleInToC });
              }}
            />
          </PanelRow>
        )}
      </InspectorAdvancedControls>
      <div
        className={`wp-block-ub-content-toggle-accordion ${
          border ? "" : "no-border"
        }`}
        style={{ borderColor: theme }}
      >
        <div
          className="wp-block-ub-content-toggle-accordion-title-wrap"
          style={{ backgroundColor: theme }}
        >
          <RichText
            tagName={titleTag}
            style={{ color: titleColor }}
            className={`wp-block-ub-content-toggle-accordion-title ub-accordion-title-${blockParentId}`}
            value={panelTitle}
            allowedFormats={["core/bold", "core/italic", "core/link"]}
            onChange={(value) => setAttributes({ panelTitle: value })}
            placeholder={__("Panel Title")}
            keepPlaceholderOnFocus={true}
            unstableOnFocus={() => {
              setPanelStatus(true);
            }}
          />
          {toggleIcon !== "none" && (
            <div
              className={
                "wp-block-ub-content-toggle-accordion-toggle-wrap " +
                toggleLocation
              }
              style={{ color: toggleColor }}
            >
              <span
                onClick={() => setPanelStatus(!showPanel)}
                className={`wp-block-ub-content-toggle-accordion-state-indicator ${
                  icons[toggleIcon] ? icons[toggleIcon] : ""
                } ${showPanel ? "open" : ""}`}
              />
              <div className="wp-block-ub-content-toggle-accordion-toggle-location">
                <span
                  title={__("Switch toggle location", "ultimate-blocks-pro")}
                  onClick={() =>
                    setAttributes({
                      toggleLocation:
                        toggleLocation === "left" ? "right" : "left",
                    })
                  }
                  className="dashicons dashicons-leftright"
                />
              </div>
            </div>
          )}
        </div>
        {showPanel && (
          <div className="wp-block-ub-content-toggle-accordion-content-wrap">
            <InnerBlocks
              templateLock={false}
              template={[
                ["core/paragraph", { placeholder: __("Panel content") }],
              ]}
            />
          </div>
        )}
        <div className="wp-block-ub-content-toggle-accordion-controls-top">
          <span
            title={__("Insert New Toggle Above")}
            onClick={() => setAttributes({ newBlockPosition: "above" })}
            className="dashicons dashicons-plus-alt"
          />
          <span
            title={__("Delete This Toggle")}
            onClick={() => removeBlock(block.clientId)}
            className="dashicons dashicons-dismiss"
          />
        </div>
        <div className="wp-block-ub-content-toggle-accordion-controls-bottom">
          <span
            title={__("Insert New Toggle Below")}
            onClick={() => setAttributes({ newBlockPosition: "below" })}
            className="dashicons dashicons-plus-alt"
          />
        </div>
      </div>
    </Fragment>
  );
}

/**
 * edit property for block.
 */
const composedEdit = compose([
  withSelect((select, ownProps) => {
    const { getBlock, getBlockRootClientId } =
      select("core/block-editor") || select("core/editor");
    const { clientId } = ownProps;

    return {
      block: getBlock(clientId),
      blockParent: getBlock(getBlockRootClientId(clientId)),
      blockParentId: getBlockRootClientId(clientId),
    };
  }),
  withDispatch((dispatch) => {
    const { updateBlockAttributes, removeBlock, selectBlock } =
      dispatch("core/block-editor") || dispatch("core/editor");

    return { updateBlockAttributes, removeBlock, selectBlock };
  }),
]);

const attributes = {
  index: {
    type: "number",
    default: 0,
  },
  parentID: {
    type: "string",
    default: "",
  },
  theme: {
    type: "text",
    default: "",
  },
  collapsed: {
    type: "boolean",
    default: false,
  },
  collapsedOnMobile: {
    type: "boolean",
    default: false,
  },
  hasFAQSchema: {
    type: "boolean",
    default: false,
  },
  titleColor: {
    type: "string",
    default: "",
  },
  titleLinkColor: {
    type: "string",
    default: "",
  },
  panelTitle: {
    type: "string",
    default: "",
  },
  newBlockPosition: {
    type: "string",
    default: "none", //changes into above/below depending on which button is clicked
  },
  titleTag: {
    type: "string",
    default: "p",
  },
  preventCollapse: {
    type: "boolean",
    default: false,
  },
  toggleLocation: {
    type: "string",
    default: "right",
  },
  toggleColor: {
    type: "string",
    default: "#000000",
  },
  toggleIcon: {
    type: "string",
    default: "chevron", //valid icons: chevron, plus, none
  },
  toggleID: {
    type: "string",
    default: "",
  },
  border: {
    type: "boolean",
    default: true,
  },
  showOnlyOne: {
    type: "boolean",
    default: false,
  },
};

// block for preview
const blockType = wp.blocks.getBlockType(
  "ub/content-toggle-panel-block-preview"
);

if (!blockType) {
  registerBlockType("ub/content-toggle-panel-block-preview", {
    title: __("Content Toggle Panel Preview - Internal Use"),
    icon,
    category: "ultimateblocks",
    attributes,
    supports: {
      inserter: false,
      reusable: false,
    },
    edit: composedEdit(ContentTogglePanel),
    save: () => null,
  });
}

export default composedEdit(ContentTogglePanel);
