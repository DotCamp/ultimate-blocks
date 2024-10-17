import { isEmpty } from "lodash";
import React, { Component, Fragment } from "react";
import {
  generateIcon,
  dashesToCamelcase,
  splitArrayIntoChunks,
  splitArray,
} from "../../global";
import {
  CustomToggleGroupControl,
  SpacingControl,
  TabsPanelControl,
} from "../../components/StylingControls";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import SavedStylesInspectorPanel from "@Components/SavedStyles/SavedStylesInspectorPanel";
import { withHookManager, hookTypes } from "@Managers/HookManager";
import { IconControl } from "@Library/ub-common/Components";
import {
  AVAILABLE_JUSTIFICATIONS,
  AVAILABLE_ORIENTATION,
  getParentBlock,
} from "../../common";
import InspectorControlsStylesTab from "@Components/Common/InspectorControlsStylesTab";

const {
  BlockControls,
  InspectorControls,
  URLInput,
  RichText,
  MediaUpload,
  JustifyContentControl,
  __experimentalBorderRadiusControl: WPBorderRadiusControl,
} = wp.blockEditor || wp.editor;
const {
  PanelBody,
  PanelRow,
  Button,
  ButtonGroup,
  ToggleControl,
  RangeControl,
  CheckboxControl,
  SelectControl,
  RadioControl,
  Popover,
  ToolbarGroup,
  ToolbarButton,
  BaseControl,
  __experimentalToolsPanelItem: ToolsPanelItem,
} = wp.components;
const { __ } = wp.i18n;
const { loadPromise, models } = wp.api;
const { select } = wp.data;
import {
  generateStyles,
  splitBorderRadius,
  getSpacingCss,
  getSpacingPresetCssVar,
} from "../../utils/styling-helpers";
import ButtonColorSettings from "./components/ButtonColorSettings";

const allIcons = Object.assign(fas, fab);

const presetIconSize = { small: 25, medium: 30, large: 35, larger: 40 };

const defaultButtonProps = {
  buttonText: "Button Text",
  url: "",
  size: "medium",
  buttonColor: "#313131",
  buttonHoverColor: "#313131",
  buttonTextColor: "#ffffff",
  buttonTextHoverColor: "#ffffff",
  buttonRounded: true,
  buttonRadius: 10,
  buttonRadiusUnit: "px",
  borderRadius: {
    topLeft: "10px",
    topRight: "10px",
    bottomLeft: "10px",
    bottomRight: "10px",
  },
  topLeftRadius: 10,
  topLeftRadiusUnit: "px",
  topRightRadius: 10,
  topRightRadiusUnit: "px",
  bottomLeftRadius: 10,
  bottomLeftRadiusUnit: "px",
  bottomRightRadius: 10,
  bottomRightRadiusUnit: "px",
  iconType: "none",
  chosenIcon: "",
  imageID: 0,
  imageURL: "",
  imageAlt: "",
  iconPosition: "left",
  iconSize: 0,
  iconUnit: "px",
  buttonIsTransparent: false,
  addNofollow: true,
  openInNewTab: true,
  addSponsored: false,
  buttonWidth: "fixed",
  animation: "fade",
  wipeDirection: "right",
};

class URLInputBox extends Component {
  //adapted from Ben Bud, https://stackoverflow.com/a/42234988
  constructor(props) {
    super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    this.props.showLinkInput();
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(event) {
    const clickedElement = event.target;
    const { classList } = clickedElement;
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(clickedElement) &&
      !(
        classList.contains("block-editor-url-input__suggestion") ||
        classList.contains("block-editor-url-input__suggestions")
      )
    ) {
      this.props.hideLinkInput();
    }
  }

  render() {
    const { attributes, setAttributes, index } = this.props;
    const { buttons } = attributes;

    return (
      <div>
        <Popover className="ub_popover" position="bottom">
          <div
            className="ub_button_popover"
            ref={(node) => (this.wrapperRef = node)}
          >
            <div className="ub_button_url_input">
              <form
                onSubmit={(event) => event.preventDefault()}
                className={`editor-format-toolbar__link-modal-line ub_button_input_box flex-container`}
              >
                <URLInput
                  autoFocus={false}
                  className="button-url"
                  disableSuggestions={
                    buttons[index]?.url?.startsWith("#") ||
                    isEmpty(buttons[index]?.url?.trim())
                  }
                  value={buttons[index].url}
                  onChange={(value) =>
                    setAttributes({
                      buttons: [
                        ...buttons.slice(0, index),
                        Object.assign({}, buttons[index], {
                          url: value,
                        }),
                        ...buttons.slice(index + 1),
                      ],
                    })
                  }
                />
                <Button
                  icon={"editor-break"}
                  label={__("Apply", "ultimate-blocks-pro")}
                  type={"submit"}
                />
              </form>
            </div>
            <CheckboxControl
              label={__("Open Link in New Tab", "ultimate-blocks-pro")}
              checked={buttons[index].openInNewTab}
              onChange={() =>
                setAttributes({
                  buttons: [
                    ...buttons.slice(0, index),
                    Object.assign({}, buttons[index], {
                      openInNewTab: !buttons[index].openInNewTab,
                    }),
                    ...buttons.slice(index + 1),
                  ],
                })
              }
            />
            <CheckboxControl
              label={__("Add Nofollow to Link", "ultimate-blocks-pro")}
              checked={buttons[index].addNofollow}
              onChange={() =>
                setAttributes({
                  buttons: [
                    ...buttons.slice(0, index),
                    Object.assign({}, buttons[index], {
                      addNofollow: !buttons[index].addNofollow,
                    }),
                    ...buttons.slice(index + 1),
                  ],
                })
              }
            />
            <CheckboxControl
              label={__("Mark link as sponsored", "ultimate-blocks-pro")}
              checked={buttons[index].addSponsored}
              onChange={() =>
                setAttributes({
                  buttons: [
                    ...buttons.slice(0, index),
                    Object.assign({}, buttons[index], {
                      addSponsored: !buttons[index].addSponsored,
                    }),
                    ...buttons.slice(index + 1),
                  ],
                })
              }
            />
          </div>
        </Popover>
      </div>
    );
  }
}

class NewButtonBlockComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoveredButton: -1,
      availableIcons: [],
      iconSearchTerm: "",
      enableLinkInput: false,
      activeButtonIndex: 0,
      iconSearchResultsPage: 0,
      iconChoices: [],
      recentSelection: "",
      selectionTime: 0,
      hasApiAccess: false,
      isWaiting: true,
      tempRecentIcons: [],
      currentCorner: "all",
    };
  }

  loadIconList() {
    const iconList = Object.keys(allIcons).sort();
    loadPromise.then(() => {
      this.settings = new models.Settings();

      this.settings.fetch().then((response) => {
        let frequentIcons = [];

        if (response.ub_icon_choices !== "") {
          const currentTime = ~~(Date.now() / 1000);

          //trim old entries from frequenticons that are older than two weeks
          frequentIcons = JSON.parse(response.ub_icon_choices)
            .map((f) => ({
              name: f.name,
              selectionTime: f.selectionTime.filter(
                (t) => t >= currentTime - 1209600
              ),
            }))
            .filter((f) => f.selectionTime.length); //then remove entries with empty selectionTime arrays
        }
        if (frequentIcons.length) {
          this.setState({ iconChoices: frequentIcons });

          //check if anything from ub_icon_choices has been trimmed in frequentIcons
          if (JSON.stringify(frequentIcons) !== response.ub_icon_choices) {
            const newIconArray = new models.Settings({
              ub_icon_choices: JSON.stringify(frequentIcons),
            });
            newIconArray.save();
          }

          let icons = [];
          let otherIcons = [];

          [icons, otherIcons] = splitArray(
            iconList.map((name) => allIcons[name]),
            (icon) => frequentIcons.map((i) => i.name).includes(icon.iconName)
          );

          const frequentIconNames = frequentIcons.map((i) => i.name);

          icons.sort(
            (a, b) =>
              frequentIconNames.indexOf(a.iconName) -
              frequentIconNames.indexOf(b.iconName)
          );

          this.setState({
            availableIcons: [...icons, ...otherIcons],
          });
        }
        this.setState({ hasApiAccess: true });
      });
    });
  }

  updateIconList() {
    const { availableIcons, recentSelection, selectionTime, iconChoices } =
      this.state;
    const prevIconMatch = iconChoices
      .map((i) => i.name)
      .indexOf(recentSelection);

    let iconPrefs = [];

    if (prevIconMatch > -1) {
      const match = Object.assign({}, iconChoices[prevIconMatch]);

      match.selectionTime = [selectionTime, ...match.selectionTime];

      iconPrefs = [
        match, //move matching element to head of array
        ...iconChoices.slice(0, prevIconMatch),
        ...iconChoices.slice(prevIconMatch + 1),
      ];
    } else {
      iconPrefs = [
        {
          name: recentSelection,
          selectionTime: [selectionTime],
        }, //add newest pick to head of array
        ...iconChoices,
      ];
    }

    //rearrange the icons

    let icons = []; //most recent selection should always be first element of array
    let otherIcons = [];
    [icons, otherIcons] = splitArray(availableIcons, (icon) =>
      iconPrefs.map((i) => i.name).includes(icon.iconName)
    );

    const iconPrefsName = iconPrefs.map((i) => i.name);

    icons.sort(
      (a, b) =>
        iconPrefsName.indexOf(a.iconName) - iconPrefsName.indexOf(b.iconName)
    );

    this.setState({
      recentSelection: "",
      selectionTime: 0,
      iconChoices: iconPrefs,
      availableIcons: [...icons, ...otherIcons],
    });

    const newIconArray = new models.Settings({
      ub_icon_choices: JSON.stringify(iconPrefs),
    });
    newIconArray.save();
  }

  componentDidMount() {
    const {
      attributes: {
        buttons,
        buttonText,
        url,
        size,
        buttonColor,
        buttonHoverColor,
        buttonTextColor,
        buttonTextHoverColor,
        buttonIsTransparent,
        buttonRounded,
        buttonWidth,
        chosenIcon,
        iconPosition,
        addNofollow,
        openInNewTab,
        isBorderComponentChanged,
      },
      setAttributes,
    } = this.props;
    const rootBlock = getParentBlock(this.props.clientId, "core/block");
    if (!rootBlock) {
      this.setState({
        availableIcons: Object.keys(allIcons)
          .sort()
          .map((name) => allIcons[name]),
      });

      this.loadIconList();

      if (buttons.length === 0) {
        const buttonProps = this.props.applyFilters(
          hookTypes.filters.ADD_SUB_COMPONENT,
          defaultButtonProps
        );

        setAttributes({
          buttons: [
            Object.assign({}, buttonProps, {
              buttonText,
              url,
              size,
              buttonColor,
              buttonHoverColor,
              buttonTextColor,
              buttonTextHoverColor,
              buttonRounded,
              chosenIcon,
              iconPosition,
              buttonIsTransparent,
              addNofollow,
              openInNewTab,
              buttonWidth,
            }),
          ],
        });
      } else {
        let newButtons = JSON.parse(JSON.stringify(buttons));
        let cornersNotSet = false;
        let missingIconAttributes = false;

        newButtons.forEach((b) => {
          if (!b.hasOwnProperty("topLeftRadius")) {
            //free version attributes
            if (!cornersNotSet) {
              cornersNotSet = true;
            }

            b.topLeftRadius = b.buttonRadius;
            b.topRightRadius = b.buttonRadius;
            b.bottomLeftRadius = b.buttonRadius;
            b.bottomRightRadius = b.buttonRadius;

            b.topLeftRadiusUnit = b.buttonRadiusUnit;
            b.topRightRadiusUnit = b.buttonRadiusUnit;
            b.bottomLeftRadiusUnit = b.buttonRadiusUnit;
            b.bottomRightRadiusUnit = b.buttonRadiusUnit;

            b.iconSize = 0;
            b.iconUnit = "px";
          }
        });

        if (newButtons.filter((b) => b.iconType === undefined).length) {
          //pro version only attributes
          missingIconAttributes = true;
          newButtons = newButtons.map((n) => ({
            ...n,
            iconType: n.chosenIcon ? "preset" : "none",
            imageID: 0,
            imageURL: "",
            imageAlt: "",
          }));
        }

        if (cornersNotSet || missingIconAttributes) {
          setAttributes({ buttons: newButtons });
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasApiAccess) {
      if (!prevProps.isSelected && this.props.isSelected) {
        this.loadIconList();
      }
      if (prevProps.isSelected && !this.props.isSelected) {
        this.updateIconList();
      }
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.attributes.blockID !== this.props.clientId) {
      this.props.setAttributes({ blockID: this.props.clientId });
    }
  }
  render() {
    const {
      isSelected,
      setAttributes,
      attributes: {
        blockID,
        buttons,
        align,
        orientation,
        isFlexWrap,
        isBorderComponentChanged,
        padding,
        margin,
        blockSpacing,
      },
      clientId,
    } = this.props;

    const {
      availableIcons,
      activeButtonIndex,
      enableLinkInput,
      hoveredButton,
      iconSearchTerm,
      iconSearchResultsPage,
      recentSelection,
      hasApiAccess,
      currentCorner,
    } = this.state;
    const rootBlock = getParentBlock(clientId, "core/block");
    if (!isBorderComponentChanged && buttons.length > 0 && !rootBlock) {
      const newButtons = buttons.map((b) => {
        b.topLeftRadiusUnit = b.buttonRadiusUnit;
        b.topRightRadiusUnit = b.buttonRadiusUnit;
        b.bottomLeftRadiusUnit = b.buttonRadiusUnit;
        b.bottomRightRadiusUnit = b.buttonRadiusUnit;
        return {
          ...b,
          borderRadius: {
            topLeft: b.topLeftRadius + b.topLeftRadiusUnit,
            topRight: b.topRightRadius + b.topRightRadiusUnit,
            bottomLeft: b.bottomLeftRadius + b.bottomLeftRadiusUnit,
            bottomRight: b.bottomRightRadius + b.bottomRightRadiusUnit,
          },
        };
      });

      setAttributes({
        isBorderComponentChanged: true,
        buttons: newButtons,
      });
    }
    const { getBlock, getClientIdsWithDescendants } =
      select("core/block-editor") || select("core/editor");

    if (blockID === "") {
      setAttributes({ blockID: clientId, align: "center" });
    } else {
      if (align === "") {
        setAttributes({ align: "center" });
      }
    }

    if (!isSelected && enableLinkInput) {
      this.setState({ enableLinkInput: false });
    }

    const BUTTON_SIZES = {
      small: __("S", "ultimate-blocks-pro"),
      medium: __("M", "ultimate-blocks-pro"),
      large: __("L", "ultimate-blocks-pro"),
      larger: __("XL", "ultimate-blocks-pro"),
    };

    const BUTTON_WIDTHS = {
      fixed: __("Fixed", "ultimate-blocks-pro"),
      flex: __("Flexible", "ultimate-blocks-pro"),
      full: __("Full", "ultimate-blocks-pro"),
    };

    const iconListPage = splitArrayIntoChunks(
      availableIcons.filter((i) => i.iconName.includes(iconSearchTerm)),
      20
    );

    const normalStateColors = (
      <>
        <ButtonColorSettings
          value={buttons[activeButtonIndex]?.buttonColor}
          onValueChange={(colorValue) =>
            setAttributes({
              buttons: [
                ...buttons.slice(0, activeButtonIndex),
                Object.assign({}, buttons[activeButtonIndex], {
                  buttonColor: colorValue,
                }),
                ...buttons.slice(activeButtonIndex + 1),
              ],
            })
          }
          onValueReset={() => {
            setAttributes({
              buttons: [
                ...buttons.slice(0, activeButtonIndex),
                Object.assign({}, buttons[activeButtonIndex], {
                  buttonColor: "",
                }),
                ...buttons.slice(activeButtonIndex + 1),
              ],
            });
          }}
          label={__("Button Color", "ultimate-blocks-pro")}
        />
        {!buttons[activeButtonIndex]?.buttonIsTransparent && (
          <ButtonColorSettings
            value={buttons[activeButtonIndex]?.buttonTextColor}
            onValueChange={(colorValue) =>
              setAttributes({
                buttons: [
                  ...buttons.slice(0, activeButtonIndex),
                  Object.assign({}, buttons[activeButtonIndex], {
                    buttonTextColor: colorValue,
                  }),
                  ...buttons.slice(activeButtonIndex + 1),
                ],
              })
            }
            onValueReset={() =>
              setAttributes({
                buttons: [
                  ...buttons.slice(0, activeButtonIndex),
                  Object.assign({}, buttons[activeButtonIndex], {
                    buttonTextColor: "",
                  }),
                  ...buttons.slice(activeButtonIndex + 1),
                ],
              })
            }
            label={__("Button Text Color", "ultimate-blocks-pro")}
          />
        )}
      </>
    );
    const hoverStateColors = (
      <>
        <ButtonColorSettings
          value={buttons[activeButtonIndex]?.buttonHoverColor}
          onValueChange={(colorValue) =>
            setAttributes({
              buttons: [
                ...buttons.slice(0, activeButtonIndex),
                Object.assign({}, buttons[activeButtonIndex], {
                  buttonHoverColor: colorValue,
                }),
                ...buttons.slice(activeButtonIndex + 1),
              ],
            })
          }
          onValueReset={() =>
            setAttributes({
              buttons: [
                ...buttons.slice(0, activeButtonIndex),
                Object.assign({}, buttons[activeButtonIndex], {
                  buttonHoverColor: "",
                }),
                ...buttons.slice(activeButtonIndex + 1),
              ],
            })
          }
          label={__("Button Color", "ultimate-blocks-pro")}
        />
        {!buttons[activeButtonIndex]?.buttonIsTransparent && (
          <ButtonColorSettings
            value={buttons[activeButtonIndex]?.buttonTextHoverColor}
            onValueChange={(colorValue) =>
              setAttributes({
                buttons: [
                  ...buttons.slice(0, activeButtonIndex),
                  Object.assign({}, buttons[activeButtonIndex], {
                    buttonTextHoverColor: colorValue,
                  }),
                  ...buttons.slice(activeButtonIndex + 1),
                ],
              })
            }
            onValueReset={() =>
              setAttributes({
                buttons: [
                  ...buttons.slice(0, activeButtonIndex),
                  Object.assign({}, buttons[activeButtonIndex], {
                    buttonTextHoverColor: "",
                  }),
                  ...buttons.slice(activeButtonIndex + 1),
                ],
              })
            }
            label={__("Button Text Color", "ultimate-blocks-pro")}
          />
        )}
      </>
    );
    const paddingObj = getSpacingCss(padding);
    const marginObj = getSpacingCss(margin);
    const blockSpacingValue =
      getSpacingPresetCssVar(blockSpacing?.all) ?? "20px";
    const styles = {
      paddingTop: paddingObj?.top,
      paddingRight: paddingObj?.right,
      paddingBottom: paddingObj?.bottom,
      paddingLeft: paddingObj?.left,
      marginTop: marginObj?.top,
      marginRight: marginObj?.right,
      marginBottom: marginObj?.bottom,
      marginLeft: marginObj?.left,
      gap: blockSpacingValue,
    };
    const flexWrapClass = isFlexWrap ? " ub-flex-wrap" : "";
    return [
      isSelected && (
        <>
          <BlockControls group="block">
            <JustifyContentControl
              value={align}
              onChange={(next) => {
                setAttributes({ align: next });
              }}
            />
          </BlockControls>
          <BlockControls>
            <ToolbarGroup>
              <ToolbarButton
                icon="admin-links"
                label={__("Add button link")}
                onClick={() => this.setState({ enableLinkInput: true })}
              />
            </ToolbarGroup>
          </BlockControls>
        </>
      ),
      isSelected && buttons.length > 0 && (
        <Fragment>
          <InspectorControlsStylesTab>
            <SavedStylesInspectorPanel
              attributes={buttons[activeButtonIndex]}
              defaultAttributes={(() => {
                // eslint-disable-next-line no-unused-vars
                const { buttonText, url, ...rest } = defaultButtonProps;

                return rest;
              })()}
              attributesToSave={(() => {
                // eslint-disable-next-line no-unused-vars
                const { buttonText, url, ...rest } = defaultButtonProps;
                return Object.keys(rest).filter((key) => {
                  return Object.prototype.hasOwnProperty.call(rest, key);
                });
              })()}
              setAttribute={(styleObject) => {
                setAttributes({
                  buttons: [
                    ...buttons.slice(0, activeButtonIndex),
                    {
                      ...buttons[activeButtonIndex],
                      ...styleObject,
                    },
                    ...buttons.slice(activeButtonIndex + 1),
                  ],
                });
              }}
              previewAttributeCallback={(attr, styleName) => {
                return {
                  buttons: [{ ...attr, buttonText: styleName }],
                };
              }}
              previewElementCallback={(el) => {
                if (el && typeof el.querySelector === "function") {
                  const plusButton = el.querySelector("button");

                  const textEditor = el.querySelector('div[role="textbox"]');
                  if (textEditor) {
                    // disable in-place text editor
                    textEditor.setAttribute("contenteditable", false);
                  }

                  el.removeChild(plusButton);
                }

                return el;
              }}
            />
            <PanelBody
              title={__("Button Styling", "ultimate-blocks-pro")}
              initialOpen={false}
            >
              <ToggleControl
                label={__("Transparent", "ultimate-blocks-pro")}
                checked={buttons[activeButtonIndex]?.buttonIsTransparent}
                onChange={() =>
                  setAttributes({
                    buttons: [
                      ...buttons.slice(0, activeButtonIndex),
                      Object.assign({}, buttons[activeButtonIndex], {
                        buttonIsTransparent:
                          !buttons[activeButtonIndex]?.buttonIsTransparent,
                      }),
                      ...buttons.slice(activeButtonIndex + 1),
                    ],
                  })
                }
              />
              <PanelRow className="ub-button-grid">
                <p>{__("Transition animation")}</p>
                <SelectControl
                  className="ub-button-grid-selector"
                  value={buttons[activeButtonIndex].animation}
                  options={[
                    {
                      label: __("Fade", "ultimate-blocks-pro"),
                      value: "fade",
                    },
                    {
                      label: __("Wipe", "ultimate-blocks-pro"),
                      value: "wipe",
                    },
                  ]}
                  onChange={(animation) =>
                    setAttributes({
                      buttons: [
                        ...buttons.slice(0, activeButtonIndex),
                        Object.assign({}, buttons[activeButtonIndex], {
                          animation,
                        }),
                        ...buttons.slice(activeButtonIndex + 1),
                      ],
                    })
                  }
                />
              </PanelRow>
              {buttons[activeButtonIndex].animation === "wipe" && (
                <PanelRow>
                  <p>{__("Wipe direction")}</p>
                  <SelectControl
                    className="ub-button-grid-selector"
                    value={buttons[activeButtonIndex].wipeDirection}
                    options={[
                      {
                        label: __("Up", "ultimate-blocks-pro"),
                        value: "up",
                      },
                      {
                        label: __("Down", "ultimate-blocks-pro"),
                        value: "down",
                      },
                      {
                        label: __("Left", "ultimate-blocks-pro"),
                        value: "left",
                      },
                      {
                        label: __("Right", "ultimate-blocks-pro"),
                        value: "right",
                      },
                    ]}
                    onChange={(wipeDirection) =>
                      setAttributes({
                        buttons: [
                          ...buttons.slice(0, activeButtonIndex),
                          Object.assign({}, buttons[activeButtonIndex], {
                            wipeDirection,
                          }),
                          ...buttons.slice(activeButtonIndex + 1),
                        ],
                      })
                    }
                  />
                </PanelRow>
              )}
            </PanelBody>
          </InspectorControlsStylesTab>
          <InspectorControls>
            <SavedStylesInspectorPanel
              visibility={false}
              attributes={buttons[activeButtonIndex]}
              defaultAttributes={(() => {
                // eslint-disable-next-line no-unused-vars
                const { buttonText, url, ...rest } = defaultButtonProps;

                return rest;
              })()}
              attributesToSave={(() => {
                // eslint-disable-next-line no-unused-vars
                const { buttonText, url, ...rest } = defaultButtonProps;
                return Object.keys(rest).filter((key) => {
                  return Object.prototype.hasOwnProperty.call(rest, key);
                });
              })()}
              setAttribute={(styleObject) => {
                setAttributes({
                  buttons: [
                    ...buttons.slice(0, activeButtonIndex),
                    {
                      ...buttons[activeButtonIndex],
                      ...styleObject,
                    },
                    ...buttons.slice(activeButtonIndex + 1),
                  ],
                });
              }}
              previewAttributeCallback={(attr, styleName) => {
                return {
                  buttons: [{ ...attr, buttonText: styleName }],
                };
              }}
              previewElementCallback={(el) => {
                if (el && typeof el.querySelector === "function") {
                  const plusButton = el.querySelector("button");

                  const textEditor = el.querySelector('div[role="textbox"]');
                  if (textEditor) {
                    // disable in-place text editor
                    textEditor.setAttribute("contenteditable", false);
                  }

                  el.removeChild(plusButton);
                }

                return el;
              }}
            />
            <PanelBody title={__("Layout", "ultimate-blocks-pro")}>
              <div className="ub-justification-control">
                <CustomToggleGroupControl
                  options={AVAILABLE_JUSTIFICATIONS}
                  attributeKey="align"
                  label={__("Justification", "ultimate-blocks-pro")}
                />
                <CustomToggleGroupControl
                  options={AVAILABLE_ORIENTATION}
                  attributeKey="orientation"
                  label={__("Orientation", "ultimate-blocks-pro")}
                />
              </div>
              <ToggleControl
                checked={isFlexWrap}
                label={__(
                  "Allow to wrap to multiple lines",
                  "ultimate-blocks-pro"
                )}
                onChange={() => setAttributes({ isFlexWrap: !isFlexWrap })}
              />
            </PanelBody>
            <PanelBody title={__("Size", "ultimate-blocks-pro")}>
              <div className="ub-button-group">
                <ButtonGroup
                  aria-label={__("Button Size", "ultimate-blocks-pro")}
                >
                  {Object.keys(BUTTON_SIZES).map((b) => (
                    <Button
                      isLarge
                      isPrimary={buttons[activeButtonIndex].size === b}
                      aria-pressed={buttons[activeButtonIndex].size === b}
                      onClick={() =>
                        setAttributes({
                          buttons: [
                            ...buttons.slice(0, activeButtonIndex),
                            Object.assign({}, buttons[activeButtonIndex], {
                              size: b,
                            }),
                            ...buttons.slice(activeButtonIndex + 1),
                          ],
                        })
                      }
                    >
                      {BUTTON_SIZES[b]}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
            </PanelBody>
            <PanelBody title={__("Width", "ultimate-blocks-pro")}>
              <div className="ub-button-group">
                <ButtonGroup
                  aria-label={__("Button Width", "ultimate-blocks-pro")}
                >
                  {Object.keys(BUTTON_WIDTHS).map((b) => (
                    <Button
                      isLarge
                      isPrimary={buttons[activeButtonIndex].buttonWidth === b}
                      aria-pressed={
                        buttons[activeButtonIndex].buttonWidth === b
                      }
                      onClick={() =>
                        setAttributes({
                          buttons: [
                            ...buttons.slice(0, activeButtonIndex),
                            Object.assign({}, buttons[activeButtonIndex], {
                              buttonWidth: b,
                            }),
                            ...buttons.slice(activeButtonIndex + 1),
                          ],
                        })
                      }
                    >
                      {BUTTON_WIDTHS[b]}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
            </PanelBody>
            <PanelBody
              title={__("Icon", "ultimate-blocks-pro")}
              initialOpen={true}
            >
              <div className="ub-button-grid">
                <p>{__("Icon type")}</p>
                <SelectControl
                  value={buttons[activeButtonIndex].iconType}
                  options={["preset", "custom", "none"].map((o) => ({
                    label: __(o),
                    value: o,
                  }))}
                  onChange={(iconType) =>
                    setAttributes({
                      buttons: [
                        ...buttons.slice(0, activeButtonIndex),
                        Object.assign({}, buttons[activeButtonIndex], {
                          iconType,
                        }),
                        ...buttons.slice(activeButtonIndex + 1),
                      ],
                    })
                  }
                />
                {buttons[activeButtonIndex].iconType === "preset" && (
                  <div style={{ gridColumn: "1/-1" }}>
                    <IconControl
                      onIconSelect={(val) => {
                        setAttributes({
                          buttons: [
                            ...buttons.slice(0, activeButtonIndex),
                            Object.assign({}, buttons[activeButtonIndex], {
                              chosenIcon: val,
                            }),
                            ...buttons.slice(activeButtonIndex + 1),
                          ],
                        });
                      }}
                      label={__("Icon", "ultimate-blocks-pro")}
                      selectedIcon={buttons[activeButtonIndex].chosenIcon}
                    />
                  </div>
                )}
              </div>
              {buttons[activeButtonIndex].iconType === "custom" && (
                <>
                  <MediaUpload
                    onSelect={(img) => {
                      setAttributes({
                        buttons: [
                          ...buttons.slice(0, activeButtonIndex),
                          Object.assign({}, buttons[activeButtonIndex], {
                            imageID: img.id,
                            imageAlt: img.alt,
                            imageURL: img.url,
                          }),
                          ...buttons.slice(activeButtonIndex + 1),
                        ],
                      });
                    }}
                    allowedTypes={["image"]}
                    value={buttons[activeButtonIndex].imageID}
                    render={({ open }) => (
                      <Button isSecondary isSmall onClick={open}>
                        {__(
                          buttons[activeButtonIndex].imageID
                            ? "Replace custom image"
                            : "Upload custom image"
                        )}
                      </Button>
                    )}
                  />
                  {buttons[activeButtonIndex].imageID > 0 && (
                    <Button
                      isSecondary
                      isSmall
                      onClick={() =>
                        setAttributes({
                          buttons: [
                            ...buttons.slice(0, activeButtonIndex),
                            Object.assign({}, buttons[activeButtonIndex], {
                              imageID: 0,
                              imageAlt: "",
                              imageURL: "",
                            }),
                            ...buttons.slice(activeButtonIndex + 1),
                          ],
                        })
                      }
                    >
                      {__("Remove custom image")}
                    </Button>
                  )}
                </>
              )}
              <RadioControl
                className="ub-button-icon-position"
                label={__("Icon position")}
                selected={buttons[activeButtonIndex].iconPosition}
                options={[
                  {
                    label: __("Left", "ultimate-blocks-pro"),
                    value: "left",
                  },
                  {
                    label: __("Right", "ultimate-blocks-pro"),
                    value: "right",
                  },
                ]}
                onChange={(pos) =>
                  setAttributes({
                    buttons: [
                      ...buttons.slice(0, activeButtonIndex),
                      Object.assign({}, buttons[activeButtonIndex], {
                        iconPosition: pos,
                      }),
                      ...buttons.slice(activeButtonIndex + 1),
                    ],
                  })
                }
              />
              {(buttons[activeButtonIndex].chosenIcon !== "" ||
                buttons[activeButtonIndex].imageURL !== "") && (
                <>
                  <ToggleControl
                    label={__("Change icon size", "ultimate-blocks-pro")}
                    checked={buttons[activeButtonIndex].iconSize > 0}
                    onChange={(isOn) => {
                      let newAttributes = {
                        iconUnit: "px",
                      };

                      newAttributes = Object.assign({}, newAttributes, {
                        iconSize: isOn
                          ? presetIconSize[buttons[activeButtonIndex].size]
                          : 0,
                      });

                      setAttributes({
                        buttons: [
                          ...buttons.slice(0, activeButtonIndex),
                          Object.assign(
                            {},
                            buttons[activeButtonIndex],
                            newAttributes
                          ),
                          ...buttons.slice(activeButtonIndex + 1),
                        ],
                      });
                    }}
                  />
                  {buttons[activeButtonIndex].iconSize > 0 && (
                    <div id="ub-button-radius-panel">
                      <RangeControl
                        label={__("Icon size")}
                        value={buttons[activeButtonIndex].iconSize}
                        step={
                          buttons[activeButtonIndex].iconUnit === "em" ? 0.1 : 1
                        }
                        onChange={(value) =>
                          setAttributes({
                            buttons: [
                              ...buttons.slice(0, activeButtonIndex),
                              Object.assign({}, buttons[activeButtonIndex], {
                                iconSize: value,
                              }),
                              ...buttons.slice(activeButtonIndex + 1),
                            ],
                          })
                        }
                      />
                      <ButtonGroup
                        aria-label={__(
                          "Button Size Unit",
                          "ultimate-blocks-pro"
                        )}
                      >
                        {["px", "em"].map((b) => (
                          <Button
                            isLarge
                            isPrimary={
                              b === buttons[activeButtonIndex].iconUnit
                            }
                            aria-pressed={
                              b === buttons[activeButtonIndex].iconUnit
                            }
                            onClick={() =>
                              setAttributes({
                                buttons: [
                                  ...buttons.slice(0, activeButtonIndex),
                                  Object.assign(
                                    {},
                                    buttons[activeButtonIndex],
                                    {
                                      iconUnit: b,
                                    }
                                  ),
                                  ...buttons.slice(activeButtonIndex + 1),
                                ],
                              })
                            }
                          >
                            {b}
                          </Button>
                        ))}
                      </ButtonGroup>
                    </div>
                  )}
                </>
              )}
            </PanelBody>
          </InspectorControls>
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
              <SpacingControl
                minimumCustomValue={-Infinity}
                showByDefault
                attrKey="margin"
                label={__("Margin", "ultimate-blocks-pro")}
              />
              <SpacingControl
                showByDefault
                sides={["all"]}
                attrKey="blockSpacing"
                label={__("Block Spacing", "ultimate-blocks-pro")}
              />
            </PanelBody>
          </InspectorControls>
          {isSelected && buttons.length > 0 && activeButtonIndex > -1 && (
            <InspectorControls group="color">
              <TabsPanelControl
                tabs={[
                  {
                    name: "normalState",
                    title: __("Normal", "ultimate-blocks-pro"),
                    component: normalStateColors,
                  },
                  {
                    name: "hoverState",
                    title: __("Hover", "ultimate-blocks-pro"),
                    component: hoverStateColors,
                  },
                ]}
              />
            </InspectorControls>
          )}
          {!isEmpty(buttons[activeButtonIndex]) && (
            <InspectorControls group="border">
              <ToolsPanelItem
                panelId={clientId}
                isShownByDefault
                resetAllFilter={() =>
                  setAttributes({
                    buttons: [
                      ...buttons.slice(0, activeButtonIndex),
                      Object.assign({}, buttons[activeButtonIndex], {
                        borderRadius: {},
                      }),
                      ...buttons.slice(activeButtonIndex + 1),
                    ],
                  })
                }
                label={__("Button Radius", "ultimate-blocks-pro")}
                hasValue={() =>
                  !isEmpty(buttons[activeButtonIndex]["borderRadius"])
                }
                onDeselect={() => {
                  setAttributes({
                    buttons: [
                      ...buttons.slice(0, activeButtonIndex),
                      Object.assign({}, buttons[activeButtonIndex], {
                        borderRadius: {},
                      }),
                      ...buttons.slice(activeButtonIndex + 1),
                    ],
                  });
                }}
              >
                <BaseControl.VisualLabel as="legend">
                  {__("Button Radius", "ultimate-blocks-pro")}
                </BaseControl.VisualLabel>
                <div className="ub-border-radius-control">
                  <WPBorderRadiusControl
                    values={buttons[activeButtonIndex]["borderRadius"]}
                    onChange={(newBorderRadius) => {
                      const splitted = splitBorderRadius(newBorderRadius);
                      setAttributes({
                        buttons: [
                          ...buttons.slice(0, activeButtonIndex),
                          Object.assign({}, buttons[activeButtonIndex], {
                            borderRadius: splitted,
                          }),
                          ...buttons.slice(activeButtonIndex + 1),
                        ],
                      });
                    }}
                  />
                </div>
              </ToolsPanelItem>
            </InspectorControls>
          )}
        </Fragment>
      ),
      <>
        <div
          className={`ub-buttons align-button-${align} orientation-button-${orientation}${flexWrapClass}`}
          style={generateStyles(styles)}
        >
          {buttons.map((b, i) => (
            <div
              className={`ub-button-container${
                b.buttonWidth === "full" ? " ub-button-full-container" : ""
              }`}
            >
              {buttons.length > 1 && (
                <div className="ub-button-delete">
                  <span
                    title={__("Delete This Button")}
                    onClick={() => {
                      this.setState({
                        activeButtonIndex:
                          activeButtonIndex > i
                            ? activeButtonIndex - 1
                            : Math.min(activeButtonIndex, buttons.length - 2),
                      });
                      setAttributes({
                        buttons: [
                          ...buttons.slice(0, i),
                          ...buttons.slice(i + 1),
                        ],
                      });
                    }}
                    className="dashicons dashicons-dismiss"
                  />
                </div>
              )}
              <div
                className={`set-style-here ub-button-block-main ub-button-${
                  b.size
                } ${
                  b.buttonWidth === "full"
                    ? "ub-button-full-width"
                    : b.buttonWidth === "flex"
                      ? `ub-button-flex-${b.size}`
                      : ""
                } ${
                  b.animation === "wipe"
                    ? `ub-button-wipe-${b.wipeDirection}`
                    : ""
                }`}
                onMouseEnter={() => this.setState({ hoveredButton: i })}
                onMouseLeave={() => this.setState({ hoveredButton: -1 })}
                onClick={() => this.setState({ activeButtonIndex: i })}
                style={{
                  backgroundColor: b.buttonIsTransparent
                    ? "transparent"
                    : hoveredButton === i && b.animation === "fade"
                      ? b.buttonHoverColor
                      : b.buttonColor,
                  color:
                    hoveredButton === i
                      ? b.buttonIsTransparent
                        ? b.buttonHoverColor
                        : b.buttonTextHoverColor || "inherit"
                      : b.buttonIsTransparent
                        ? b.buttonColor
                        : b.buttonTextColor || "inherit",
                  borderTopLeftRadius: b?.borderRadius?.topLeft,
                  borderTopRightRadius: b?.borderRadius?.topRight,
                  borderBottomLeftRadius: b?.borderRadius?.bottomLeft,
                  borderBottomRightRadius: b?.borderRadius?.bottomRight,
                  borderStyle: b.buttonIsTransparent ? "solid" : "none",
                  borderColor: b.buttonIsTransparent
                    ? hoveredButton === i
                      ? b.buttonHoverColor
                      : b.buttonColor
                    : null,
                  boxShadow:
                    isSelected && activeButtonIndex === i
                      ? "0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 -10px 8px 0 rgba(0, 0, 0, 0.2)"
                      : null,
                }}
              >
                <div
                  className="ub-button-content-holder"
                  style={{
                    flexDirection:
                      b.iconPosition === "left" ? "row" : "row-reverse",
                  }}
                >
                  {b.iconType === "preset" &&
                    b.chosenIcon !== "" &&
                    b.chosenIcon !== null &&
                    allIcons.hasOwnProperty(
                      `fa${dashesToCamelcase(b.chosenIcon)}`
                    ) && (
                      <div className="ub-button-icon-holder">
                        {generateIcon(
                          allIcons[`fa${dashesToCamelcase(b.chosenIcon)}`],
                          b.iconSize || presetIconSize[b.size],
                          b.iconUnit || "px"
                        )}
                      </div>
                    )}
                  {b.iconType === "custom" && b.imageID > 0 && (
                    <img
                      className="ub-button-image"
                      src={b.imageURL}
                      alt={b.imageAlt}
                      style={{
                        maxHeight: `${b.iconSize || presetIconSize[b.size]}${
                          b.iconUnit || "px"
                        }`,
                      }}
                    />
                  )}
                  <RichText
                    className="ub-button-block-btn"
                    placeholder={__("Button Text", "ultimate-blocks-pro")}
                    onChange={(value) =>
                      setAttributes({
                        buttons: [
                          ...buttons.slice(0, i),
                          Object.assign({}, buttons[i], {
                            buttonText: value,
                          }),
                          ...buttons.slice(i + 1),
                        ],
                      })
                    }
                    unstableOnFocus={() =>
                      this.setState({
                        activeButtonIndex: i,
                      })
                    }
                    value={b.buttonText}
                    allowedFormats={[
                      "core/bold",
                      "core/italic",
                      "core/strikethrough",
                    ]}
                    keepPlaceholderOnFocus={true}
                  />
                </div>
              </div>
              {activeButtonIndex === i && enableLinkInput && (
                <URLInputBox
                  {...this.props}
                  index={i}
                  hideLinkInput={() =>
                    this.setState({
                      enableLinkInput: false,
                    })
                  }
                  showLinkInput={() =>
                    this.setState({
                      enableLinkInput: true,
                    })
                  }
                />
              )}
            </div>
          ))}
          <button
            className="ub-add-button"
            onClick={() => {
              const buttonProps = this.props.applyFilters(
                hookTypes.filters.ADD_SUB_COMPONENT,
                defaultButtonProps
              );
              setAttributes({
                buttons: [...buttons, buttonProps],
              });
              this.setState({
                activeButtonIndex: buttons.length,
              });
            }}
          >
            +
          </button>
        </div>
        <style
          dangerouslySetInnerHTML={{
            __html: buttons
              .map((b, i) =>
                b.animation === "wipe"
                  ? `.ub-button-container:nth-child(${
                      i + 1
                    }) .ub-button-block-main{
										position: relative;
									}
									.ub-button-container:nth-child(${i + 1}) .ub-button-block-main:after{
										content: "";
										position: absolute;
										z-index: 5;
										background-color: ${b.buttonHoverColor};
										transition: all 0.5s;
								}
								.ub-button-container:nth-child(${i + 1}) .ub-button-content-holder{
								top: 0;
								z-index: 6;
							}
							`
                  : ""
              )
              .join(""),
          }}
        />
      </>,
    ];
  }
}

export const NewButtonBlock = withHookManager(NewButtonBlockComponent);
