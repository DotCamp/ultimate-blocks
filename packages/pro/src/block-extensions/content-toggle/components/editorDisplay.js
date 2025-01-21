import { Fragment, useEffect, useState } from "react";
import {
  BlockControls,
  InnerBlocks,
  InspectorControls,
  PanelColorSettings,
  BlockAlignmentControl,
} from "@wordpress/block-editor";
import {
  PanelBody,
  PanelRow,
  FormToggle,
  SelectControl,
  Button,
  ButtonGroup,
  Dropdown,
  FocusableIframe,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { createBlock } from "@wordpress/blocks";
import {
  getDescendantBlocks,
  getParentBlock,
  objectsMatch,
} from "../../../common";
import icons from "../icons/icons";
import SearchInspectorControls from "./search/SearchInspectorControls";
import PanelSearchComponent from "./search/PanelSearchComponent";
import ConditionalRenderer from "@Base/js/components/ConditionalRenderer.js";
import ContentToggleContext from "./hoc/ContentToggleContext";
import ContentToggleColorControlPortal from "./ContentToggleColorControlPortal";
import SavedStylesInspectorPanel from "@Components/SavedStyles/SavedStylesInspectorPanel";
import InspectorControlsStylesTab from "@Components/Common/InspectorControlsStylesTab";
import { getStyles } from "../get-styles";
import { SpacingControl } from "../../../components/StylingControls";
const objectsNewChange = (obj1, obj2) => {
  let diff = {};
  if (obj1 && obj2) {
    Object.keys(obj1).forEach((key) => {
      if (obj2.hasOwnProperty(key) && obj1[key] !== obj2[key]) {
        diff = Object.assign(diff, { [key]: obj2[key] });
      }
    });
    return diff;
  }
  return null;
};

const oldColorDefaults = {
  theme: "#e11b4c",
  titleColor: "#ffffff",
};

function PanelContent(props) {
  const [colorControlsPortalRef, setColorControlsPortalRef] = useState(null);

  const panels = props.block.innerBlocks;

  const newArrangement = panels.map((panel) => panel.attributes.index);
  const {
    attributes: {
      collapsed,
      collapsedOnMobile,
      individualCollapse,
      theme,
      titleColor,
      titleLinkColor,
      blockID,
      hasFAQSchema,
      titleTag,
      preventCollapse,
      toggleLocation,
      toggleColor,
      toggleIcon,
      border,
      showOnlyOne,
      align,
    },
    setAttributes,
    className,
    isSelected,
    updateBlockAttributes,
    selectBlock,
    insertBlock,
    removeBlock,
    selectedBlock,
    block,
    getClientIdsWithDescendants,
    getBlock,
    rootBlockClientId,
  } = props;

  useEffect(() => {
    //first initializations
    const { block, attributes, setAttributes } = props;
    const { theme, titleColor, showOnlyOne, collapsedOnMobile } = attributes;

    if (!props.attributes.blockID) {
      const initialColors = {};
      if (!theme) {
        initialColors.theme = "#f1f1f1";
      }
      if (!titleColor) {
        initialColors.titleColor = "#000000";
      }

      setAttributes(initialColors);
    } else if (block.innerBlocks.length) {
      Object.assign(props.attributes, {
        theme: block.innerBlocks[0].attributes.theme,
        titleColor: block.innerBlocks[0].attributes.titleColor,
      });
    }

    if (showOnlyOne && collapsedOnMobile) {
      setAttributes({ showOnlyOne: false });
      block.innerBlocks.forEach((panel) => {
        props.updateBlockAttributes(panel.clientId, {
          showOnlyOne: false,
        });
      });
    }

    //initialize monitoring for child block arrangement
    if (newArrangement.length === 0) {
      if (oldArrangement.length > 0) {
        removeBlock(block.clientId);
        return null; //prevent block from being rendered to prevent error
      }
      setOldArrangement(Array.from(Array(panels.length).keys()));
    }

    //blockid initialization
    if (blockID === "") {
      setAttributes(
        Object.assign({ blockID: block.clientId }, newColorDefaults)
      );
    }

    //initialize variable for monitoring changes in child block attributes
    setOldAttributeValues(
      panels.map((panel) =>
        ((
          {
            panelTitle,
            newBlockPosition,
            index,
            parent,
            parentID,
            toggleID,
            ...others
          } = panel.attributes
        ) => others)()
      )
    );
  }, []);

  const [oldArrangement, setOldArrangement] = useState([]);
  const [oldAttributeValues, setOldAttributeValues] = useState([]);
  const [mainBlockSelected, setMainBlockSelectStatus] = useState(true);

  useEffect(() => {
    const rootBlock = getParentBlock(rootBlockClientId, "core/block");
    if (!rootBlock) {
      setAttributes({ blockID: block.clientId });
    }
  }, [block?.clientId]);

  const newBlockTarget = panels.filter(
    (panel) => panel.attributes.newBlockPosition !== "none"
  );

  const onThemeChange = (value) => {
    setAttributes({ theme: value });

    panels.forEach((panel) =>
      updateBlockAttributes(panel.clientId, { theme: value })
    );
  };

  const onTitleColorChange = (value) => {
    setAttributes({ titleColor: value });

    panels.forEach((panel) =>
      updateBlockAttributes(panel.clientId, { titleColor: value })
    );
  };

  const onLinkColorChange = (value) => {
    setAttributes({ titleLinkColor: value });
    panels.forEach((panel) =>
      updateBlockAttributes(panel.clientId, { titleLinkColor: value })
    );
  };
  const onToggleColorChange = (value) => {
    setAttributes({ toggleColor: value });
    panels.forEach((panel) =>
      updateBlockAttributes(panel.clientId, { toggleColor: value })
    );
  };

  const onCollapseChange = () => {
    setAttributes({ collapsed: !collapsed });
    panels.forEach((panel) =>
      updateBlockAttributes(panel.clientId, {
        collapsed: !panel.attributes.collapsed,
      })
    );
    if (!collapsed) {
      setAttributes({ preventCollapse: false });
      panels.forEach((panel) =>
        updateBlockAttributes(panel.clientId, {
          preventCollapse: false,
        })
      );
    }
  };

  const onPreventCollapseChange = () => {
    setAttributes({ preventCollapse: !preventCollapse });
    panels.forEach((panel) =>
      updateBlockAttributes(panel.clientId, {
        preventCollapse: !panel.attributes.preventCollapse,
        ...(!preventCollapse && { collapsed: false }),
      })
    );
  };

  const newColorDefaults = {
    theme: "#f1f1f1",
    titleColor: "#000000",
  };

  const toggleIconPositions = {
    left: __("Left", "ultimate-blocks-pro"),
    right: __("Right", "ultimate-blocks-pro"),
  };

  //Detect if one of the child blocks has received a command to add another child block
  const presets = Object.assign(
    {},
    blockID ? oldColorDefaults : newColorDefaults
  );

  useEffect(() => {
    if (newBlockTarget.length > 0) {
      const { index, newBlockPosition } = newBlockTarget[0].attributes;
      insertBlock(
        createBlock("ub/content-toggle-panel-block", {
          theme: theme || presets.theme,
          collapsed: showOnlyOne ? true : collapsed,
          titleColor: titleColor || presets.titleColor,
          titleTag,
          preventCollapse,
          toggleLocation,
          toggleColor,
          toggleIcon,
          border,
          showOnlyOne,
        }),
        newBlockPosition === "below" ? index + 1 : index,
        block.clientId
      );
      updateBlockAttributes(newBlockTarget[0].clientId, {
        newBlockPosition: "none",
      });
    }
  }, [newBlockTarget]);

  if (!newArrangement.every((item, i) => item === oldArrangement[i])) {
    //Fix indexes in case of rearrangments
    if (newArrangement.length < oldArrangement.length && showOnlyOne) {
      if (!panels.map((p) => p.attributes.collapsed).includes(false)) {
        oldArrangement.forEach((i) => {
          if (!newArrangement.includes(i)) {
            updateBlockAttributes(panels[Math.max(0, i - 1)].clientId, {
              collapsed: false,
            });
          }
        });
      }
    }
    panels.forEach((panel, i) =>
      updateBlockAttributes(panel.clientId, {
        index: i,
        // @deprecated
        // parent: block.clientId,
      })
    );
    setOldArrangement(newArrangement);
  } else if (mainBlockSelected) {
    if (
      selectedBlock !== block.clientId &&
      getDescendantBlocks(props.block)
        .map((d) => d.clientId)
        .includes(selectedBlock)
    ) {
      setMainBlockSelectStatus(false);
    }
  } else {
    const childBlocks = props.block.innerBlocks
      .filter((block) => block.name === "ub/content-toggle-panel-block")
      .map((panels) => panels.clientId);

    if (childBlocks.includes(selectedBlock) && !wp.data.useDispatch) {
      //useDispatch is only present in Gutenberg v5.9, together with clickthrough selection feature
      setMainBlockSelectStatus(true);
      selectBlock(props.block.clientId);
    }
  }

  if (oldArrangement.length > 0) {
    const newAttributeValues = panels.map((panel) =>
      ((
        {
          panelTitle,
          newBlockPosition,
          index,
          parent,
          parentID,
          toggleID,
          ...others
        } = panel.attributes
      ) => others)()
    );

    if (newAttributeValues.length > 0) {
      if (newAttributeValues.length === oldAttributeValues.length) {
        if (
          !newAttributeValues.every((entry, i) =>
            objectsMatch(entry, oldAttributeValues[i])
          )
        ) {
          //add exception for changing collapsed to matching for index when showOnlyOne is changed to true
          //when showOnlyOne is true and collapsed state is changed in one of the panels,

          const changedPanel = block.innerBlocks
            .map((innerBlock) => innerBlock.clientId)
            .indexOf(selectedBlock);

          const newChange = objectsNewChange(
            oldAttributeValues[changedPanel],
            newAttributeValues[changedPanel]
          );

          if (
            changedPanel > -1 && //for preventing errors in gutenberg 8
            newAttributeValues[changedPanel].showOnlyOne
          ) {
            //if value of collapsed is changed for a panel via inspector panel and showonlyone is active,
            //value of collapsed in all other panels should be automatically set to true

            panels.forEach((panel, i) => {
              updateBlockAttributes(
                panel.clientId,
                Object.assign(
                  {},
                  newChange,
                  i !== changedPanel ? { collapsed: true } : null
                )
              );
            });
            setAttributes(Object.assign({ collapsed: false }, newChange));
          } else if (
            newChange &&
            !(newChange.hasOwnProperty("collapsed") && individualCollapse)
          ) {
            panels.forEach((panel) => {
              updateBlockAttributes(panel.clientId, newChange);
            });
            setAttributes(newChange);
          }
          setOldAttributeValues(newAttributeValues);
        }
      } else {
        setOldAttributeValues(newAttributeValues);
      }
    }
  }

  /**
   * Set new values for a single attribute.
   *
   * @param {string} attributeId attribute id
   * @param {any}    newVal      value
   */
  const setSingleAttribute = (attributeId, newVal) => {
    setAttributes({ [attributeId]: newVal });
  };

  /**
   * Context data.
   *
   * @type {Object}
   */
  const contentToggleContextData = {
    attributes: props.attributes,
    setAttributes,
    colorControlsPortalRef,
    setColorControlsPortalRef,
    setSingleAttribute,
  };
  const availablePanels = panels?.map((panel, index) => {
    return {
      value: panel.clientId,
      label: `Panel ${index + 1}`,
    };
  });

  const defaultOpenOptions = [
    { value: "none", label: __("None", "ultimate-blocks-pro") },
    ...availablePanels,
  ];
  const styles = getStyles(props.attributes);
  return (
    <>
      <BlockControls group="block">
        <BlockAlignmentControl
          value={align}
          controls={["full", "wide"]}
          onChange={(newAlign) => setAttributes({ align: newAlign })}
        />
      </BlockControls>
      <ContentToggleContext.Provider value={contentToggleContextData}>
        {isSelected && (
          <Fragment>
            <InspectorControlsStylesTab>
              <SavedStylesInspectorPanel
                overrideBlockType={"ub/content-toggle-panel-block"}
                attributes={props.attributes}
                setAttribute={(allAttrs) => {
                  const { panelTitle, ...attrs } = allAttrs;

                  // update block and its innerblock panel attributes
                  setAttributes(attrs);

                  if (panels && Array.isArray(panels)) {
                    panels.forEach((panel) => {
                      updateBlockAttributes(panel.clientId, attrs);
                    });
                  }
                }}
                attributesToSave={(() => {
                  const excludeList = [
                    "index",
                    "parent",
                    "parentID",
                    "panelTitle",
                  ];

                  return Object.keys(props.attributes).filter((key) => {
                    return (
                      Object.prototype.hasOwnProperty.call(
                        props.attributes,
                        key
                      ) && !excludeList.includes(key)
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
                      onChange: onThemeChange,
                      label: __("Container Color"),
                    },
                    {
                      value: titleColor,
                      onChange: onTitleColorChange,
                      label: __("Title Color"),
                    },
                    {
                      value: titleLinkColor,
                      onChange: onLinkColorChange,
                      label: __("Title link Color"),
                    },
                    {
                      value: toggleColor,
                      onChange: onToggleColorChange,
                      label: __("Toggle Icon Color"),
                    },
                  ]}
                />
                <ContentToggleColorControlPortal.Provider />
                <PanelRow>
                  <label htmlFor="ub-content-toggle-border">
                    {__("Border")}
                  </label>
                  <FormToggle
                    id="ub-content-toggle-border"
                    label={__("Enable border")}
                    checked={
                      typeof panels === "undefined" ||
                      (panels.length > 0 && panels[0].attributes.border)
                    }
                    onChange={() =>
                      panels.forEach((panel) =>
                        updateBlockAttributes(panel.clientId, {
                          border: !panel.attributes.border,
                        })
                      )
                    }
                  />
                </PanelRow>
              </PanelBody>
              <PanelBody
                title={__("Toggle status icon", "ultimate-blocks-pro")}
                initialOpen={false}
              >
                {toggleIcon !== "none" && (
                  <PanelRow>
                    <label htmlFor="ub-content-toggle-status-location">
                      {__("Location", "ultimate-blocks-pro")}
                    </label>
                    <ButtonGroup
                      id="ub-content-toggle-status-location"
                      aria-label={__(
                        "toggle icon position",
                        "ultimate-blocks-pro"
                      )}
                    >
                      {Object.keys(toggleIconPositions).map(
                        // eslint-disable-next-line array-callback-return
                        (p) => {
                          if (
                            Object.prototype.hasOwnProperty.call(
                              toggleIconPositions,
                              p
                            )
                          ) {
                            return (
                              <Button
                                isLarge
                                aria-pressed={toggleLocation === p}
                                isPrimary={toggleLocation === p}
                                onClick={() => {
                                  setAttributes({
                                    toggleLocation: p,
                                  });
                                  panels.forEach((panel) =>
                                    updateBlockAttributes(panel.clientId, {
                                      toggleLocation: p,
                                    })
                                  );
                                }}
                              >
                                {toggleIconPositions[p]}
                              </Button>
                            );
                          }
                        }
                      )}
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
                        {/* eslint-disable-next-line array-callback-return */}
                        {Object.keys(icons).map((i) => {
                          if (Object.prototype.hasOwnProperty.call(icons, i)) {
                            return (
                              <Button
                                isPrimary={toggleIcon === i}
                                isLarge
                                onClick={() => {
                                  setAttributes({
                                    toggleIcon: i,
                                  });
                                  panels.forEach((panel) =>
                                    updateBlockAttributes(panel.clientId, {
                                      toggleIcon: i,
                                    })
                                  );
                                }}
                              >
                                {icons[i] === "none" ? (
                                  "None"
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
                overrideBlockType={"ub/content-toggle-panel-block"}
                attributes={props.attributes}
                setAttribute={(allAttrs) => {
                  const { panelTitle, ...attrs } = allAttrs;

                  // update block and its innerblock panel attributes
                  setAttributes(attrs);

                  if (panels && Array.isArray(panels)) {
                    panels.forEach((panel) => {
                      updateBlockAttributes(panel.clientId, attrs);
                    });
                  }
                }}
                attributesToSave={(() => {
                  const excludeList = ["index", "parent", "parentID"];

                  return Object.keys(props.attributes).filter((key) => {
                    return (
                      Object.prototype.hasOwnProperty.call(
                        props.attributes,
                        key
                      ) && !excludeList.includes(key)
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
                    onChange={(titleTag) => {
                      setAttributes({ titleTag });
                      panels.forEach((panel) =>
                        updateBlockAttributes(panel.clientId, {
                          titleTag,
                        })
                      );
                    }}
                  />
                </div>
              </PanelBody>
              <PanelBody title={__("Toggle State")} initialOpen={false}>
                <PanelRow>
                  <label htmlFor="ub-content-toggle-set-individually">
                    {__("Set toggle status for each panel individually")}
                  </label>
                  <FormToggle
                    id="ub-content-toggle-set-individually"
                    label={__("Set toggle status for each panel individually")}
                    checked={individualCollapse}
                    onChange={() => {
                      setAttributes({
                        individualCollapse: !individualCollapse,
                        ...(!individualCollapse && {
                          showOnlyOne: false,
                          collapsed: panels[0].attributes.collapsed,
                        }),
                        ...(individualCollapse && {
                          preventCollapse: false,
                        }),
                      });

                      panels.forEach((panel) =>
                        updateBlockAttributes(panel.clientId, {
                          ...(!individualCollapse && {
                            showOnlyOne: false,
                            collapsed: panels[0].attributes.collapsed,
                          }),
                          ...(individualCollapse && {
                            preventCollapse: false,
                          }),
                        })
                      );
                    }}
                  />
                </PanelRow>
                {!individualCollapse && (
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
                        panels.forEach((panel) =>
                          updateBlockAttributes(panel.clientId, {
                            showOnlyOne: !showOnlyOne,
                          })
                        );
                        if (showOnlyOne) {
                          //value before setAttributes still in use
                          setAttributes({
                            collapsed: false,
                            preventCollapse: false,
                          });
                          panels.forEach((panel) =>
                            updateBlockAttributes(panel.clientId, {
                              collapsed: false,
                              preventCollapse: false,
                            })
                          );
                        } else {
                          panels.forEach((panel, i) =>
                            updateBlockAttributes(panel.clientId, {
                              collapsed: i !== 0,
                            })
                          );
                        }
                      }}
                    />
                  </PanelRow>
                )}
                {!showOnlyOne && !individualCollapse && !preventCollapse && (
                  <>
                    <PanelRow>
                      <label htmlFor="ub-content-toggle-state">
                        {__("Collapsed")}
                      </label>
                      <FormToggle
                        id="ub-content-toggle-state"
                        label={__("Collapsed")}
                        checked={collapsed}
                        onChange={onCollapseChange}
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
                          panels.forEach((panel) => {
                            updateBlockAttributes(panel.clientId, {
                              collapsedOnMobile: !collapsedOnMobile,
                            });
                            if (!collapsedOnMobile) {
                              setAttributes({
                                showOnlyOne: false,
                              });
                              panels.forEach((panel) => {
                                updateBlockAttributes(panel.clientId, {
                                  showOnlyOne: false,
                                });
                              });
                            }
                          });
                        }}
                      />
                    </PanelRow>
                  </>
                )}
                {!collapsed &&
                  !collapsedOnMobile &&
                  !showOnlyOne &&
                  !individualCollapse && (
                    <PanelRow>
                      <label htmlFor="ub-content-toggle-state">
                        {__("Prevent collapse")}
                      </label>
                      <FormToggle
                        id="ub-content-toggle-state"
                        label={__("Prevent collapse")}
                        checked={preventCollapse}
                        onChange={onPreventCollapseChange}
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
                    onChange={() => {
                      setAttributes({
                        hasFAQSchema: !hasFAQSchema,
                      });
                      panels.forEach((panel) =>
                        updateBlockAttributes(panel.clientId, {
                          hasFAQSchema: !panel.attributes.hasFAQSchema,
                        })
                      );
                    }}
                  />
                </PanelRow>
              </PanelBody>
            </InspectorControls>
            <SearchInspectorControls />
          </Fragment>
        )}
        <div
          className={className}
          style={styles}
          id={`ub-content-toggle-${blockID}`}
        >
          <ConditionalRenderer
            attributes={props.attributes}
            attributeKey={"searchStatus"}
            targetValue={true}
          >
            <PanelSearchComponent />
          </ConditionalRenderer>
          <InnerBlocks
            template={[
              [
                "ub/content-toggle-panel-block",
                {
                  theme: newColorDefaults.theme,
                  collapsed,
                  titleColor: newColorDefaults.titleColor,
                  titleLinkColor,
                  hasFAQSchema,
                  toggleLocation,
                  toggleColor,
                  toggleIcon,
                  border,
                  showOnlyOne,
                },
              ],
            ]}
            templateLock={false}
            allowedBlocks={["ub/content-toggle-panel-block"]}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `.ub-accordion-title-${blockID} a{
							color: ${titleLinkColor || "inherit"}
						}`,
            }}
          />
        </div>
      </ContentToggleContext.Provider>
    </>
  );
}

/**
 * @module PanelContent
 */
export default PanelContent;
