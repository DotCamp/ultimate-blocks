import React, { Component } from "react";
import { dashesToCamelcase, splitArray } from "../../global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import SavedStylesInspectorPanel from "@Components/SavedStyles/SavedStylesInspectorPanel";
import { IconControl } from "@Library/ub-common/Components";

library.add(fas, fab, faEye, faEyeSlash);

const allIcons = Object.assign(fas, fab);

import {
  ToggleControl,
  PanelBody,
  SelectControl,
  RangeControl,
} from "@wordpress/components";
import { select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { loadPromise, models } from "@wordpress/api";

class OptionalParent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.enabled) {
      return (
        <div className={this.props.className} style={this.props.style}>
          {this.props.children}
        </div>
      );
    }
    return <>{this.props.children}</>;
  }
}

export class NewTableOfContents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canRemoveItemFocus: false,
      selectedIcon: "",
      iconChoices: [],
      availableIcons: [],
      iconSearchTerm: "",
      iconSearchResultsPage: 0,
      recentSelection: "",
      selectionTime: 0,
      hasApiAccess: false,
    };
    this.setState = this.setState.bind(this);
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
        } else {
          this.setState({
            availableIcons: iconList.map((name) => allIcons[name]),
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
    const { attributes, setAttributes } = this.props;
    const { toggleButtonType, blockID } = attributes;
    const { getBlock, getClientIdsWithDescendants } =
      select("core/block-editor") || select("core/editor");
    this.loadIconList();

    if (toggleButtonType === "") {
      setAttributes({ toggleButtonType: "text" });
    }

    if (
      blockID === "" ||
      getClientIdsWithDescendants().some(
        (ID) =>
          "blockID" in getBlock(ID).attributes &&
          getBlock(ID).attributes.blockID === blockID
      )
    ) {
      setAttributes({ blockID: this.props.clientId });
    }
  }

  render() {
    const { isSelected, attributes, setAttributes, BlockEdit } = this.props;

    const {
      blockID,
      showList,
      titleColor,
      listColor,
      listStyle,
      listIcon,
      listIconColor,
      toggleButtonType,
      isSticky,
      stickyTOCPosition,
      hideStickyTOCOnMobile,
      stickyTOCWidth,
    } = attributes;

    c;

    const parseProList = (list, currentlyEditedItem) =>
      list.map((item) => (
        <li
          style={
            listIcon
              ? {
                  display: "grid",
                  gridTemplateAreas: `'listicon content buttons'
					'extra extra extra'`,
                  gridTemplateColumns: "1.2em auto auto",
                  alignItems: "baseline",
                }
              : null
          }
        >
          <OptionalParent
            enabled={
              listStyle === "plain" ||
              (listStyle === "bulleted" && listIcon === "")
            }
            style={{
              display: "flex",
              justifyItems: "space-between",
            }}
          >
            {isSelected && currentlyEditedItem === item.clientId ? (
              <input
                style={{ gridArea: "content" }}
                type="text"
                value={item.customContent}
                onChange={(e) => {
                  const revisedHeaders = JSON.parse(
                    JSON.stringify(this.state.headers)
                  );
                  revisedHeaders[item.index].customContent = e.target.value;
                  this.setState({
                    headers: revisedHeaders,
                  });
                }}
                onBlur={readCustomHeadingInput}
              />
            ) : (
              <a
                style={{ gridArea: "content" }}
                href={`#${item.anchor}`}
                dangerouslySetInnerHTML={{
                  __html: `${item.disabled ? "<del>" : ""}${
                    item.customContent ||
                    (typeof item.content === "undefined"
                      ? ""
                      : item.content.replace(/(<.+?>)/g, ""))
                  }${item.disabled ? "</del>" : ""}`,
                }}
              />
            )}
            {isSelected && (
              <div
                className="ub_toc_button_container"
                style={{ gridArea: "buttons" }}
              >
                {!item.disabled && (
                  <button
                    onClick={() => {
                      const revisedHeaders = JSON.parse(
                        JSON.stringify(this.state.headers)
                      );
                      if (!revisedHeaders[item.index].customContent) {
                        revisedHeaders[item.index].customContent =
                          revisedHeaders[item.index].content.replace(
                            /<.+?>/g,
                            ""
                          );
                        this.setState({
                          headers: revisedHeaders,
                        });
                      }
                      this.setState({
                        currentlyEditedItem: item.clientId,
                      });
                    }}
                  >
                    <span className="dashicons dashicons-edit-large"></span>
                  </button>
                )}
                <button
                  onClick={() => {
                    const revisedHeaders = JSON.parse(
                      JSON.stringify(this.state.headers)
                    );
                    revisedHeaders[item.index].disabled =
                      !revisedHeaders[item.index].disabled;
                    this.setState({
                      headers: revisedHeaders,
                    });
                  }}
                >
                  <FontAwesomeIcon icon={item.disabled ? faEye : faEyeSlash} />
                </button>
              </div>
            )}
          </OptionalParent>
          {item.children &&
            (listStyle === "numbered" ? (
              <ol>{parseProList(item.children)}</ol>
            ) : (
              <ul
                className={listIcon ? "fa-ul" : null}
                style={{
                  listStyle: listStyle === "plain" ? "none" : null,
                  gridArea:
                    listStyle === "bulleted" && listIcon ? "extra" : null,
                }}
              >
                {parseProList(item.children)}
              </ul>
            ))}
        </li>
      ));
    const createColorSetting = (attrKey, label) => ({
      value: attributes[attrKey],
      onChange: (newValue) => setAttributes({ [attrKey]: newValue }),
      label: __(label),
    });
    const stickyColorSettings = createColorSetting(
      "stickyButtonIconColor",
      __("Sticky Button Icon Color", "ultimate-blocks-pro")
    );
    const hideElementPro = toggleButtonType !== "text" && (
      <div
        className="ub_table-of-contents-toggle-icon-container"
        onClick={() => setAttributes({ showList: !showList })}
      >
        {toggleButtonType === "chevron" && (
          <>
            <span
              className="ub_table-of-contents-chevron-left"
              style={{
                backgroundColor: titleColor,
                transform: `rotate(${showList ? 135 : 225}deg)`,
              }}
            />
            <span
              className="ub_table-of-contents-chevron-right"
              style={{
                backgroundColor: titleColor,
                transform: `rotate(${showList ? 225 : 135}deg)`,
              }}
            />
          </>
        )}
        {toggleButtonType === "plus" && (
          <>
            <span
              className="ub_table-of-contents-plus-part"
              style={{
                backgroundColor: titleColor,
                transform: `rotate(${showList ? 180 : 90}deg)`,
              }}
            />
            <span
              className="ub_table-of-contents-plus-part"
              style={{
                backgroundColor: showList ? "transparent" : titleColor,
                transform: `rotate(${showList ? 90 : 0}deg)`,
              }}
            />
          </>
        )}
      </div>
    );
    const styleTagPro = (
      <style
        dangerouslySetInnerHTML={{
          __html: `
          #block-${blockID} .ub_table-of-contents-container li{
							color: ${listIconColor};
          }
            #ub_table-of-contents-${blockID} .ub_table-of-contents-container a{
						color: ${listColor};
					}${
            listStyle !== "bulleted" || listIcon === ""
              ? ""
              : `#ub_table-of-contents-${blockID} li{
									list-style: none;
								}
								#ub_table-of-contents-${blockID} li:before{
									top: 0.2em;
									grid-area: listicon;
									content: '';
                  display: inline-block;
									position: relative;
									background-repeat: no-repeat;
									height: 1em;
									width: 1em;
									background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${
                    allIcons[`fa${dashesToCamelcase(listIcon)}`].icon[0]
                  } ${
                    allIcons[`fa${dashesToCamelcase(listIcon)}`].icon[1]
                  }' color='${
                    listIconColor ? `%23${listIconColor.slice(1)}` : "inherit"
                  }'><path fill='currentColor' d='${
                    allIcons[`fa${dashesToCamelcase(listIcon)}`].icon[4]
                  }'></path></svg>");
								}
								#ub_table-of-contents-${blockID} .ub_table-of-contents-container .fa-ul {
									margin-left: -1em;
								}`
          }`,
        }}
      />
    );

    const savedStylePro = (
      <SavedStylesInspectorPanel
        visibility={false}
        attributes={() => {
          // eslint-disable-next-line no-unused-vars
          const { blockID, title, ...rest } = attributes;

          return rest;
        }}
        setAttribute={setAttributes}
        previewAttributeCallback={(attr) => attr}
        previewElementCallback={(el) => el}
        previewsEnabled={false}
      />
    );
    const iconControlPro = listStyle === "bulleted" && (
      <IconControl
        label={__("Current icon", "ultimate-blocks-pro")}
        onIconSelect={(val) => setAttributes({ listIcon: val })}
        selectedIcon={listIcon}
      />
    );
    const toggleButtonTypeControl = (
      <SelectControl
        label={__("Toggle button type")}
        value={toggleButtonType}
        options={["text", "chevron", "plus"].map((a) => ({
          label: __(a),
          value: a,
        }))}
        onChange={(toggleButtonType) =>
          setAttributes({
            toggleButtonType,
          })
        }
      />
    );
    const stickyControl = (
      <PanelBody
        title={__("Sticky", "ultimate-blocks-pro")}
        initialOpen={false}
      >
        <ToggleControl
          label={__("Sticky", "ultimate-blocks-pro")}
          checked={isSticky}
          onChange={() =>
            setAttributes({
              isSticky: !isSticky,
            })
          }
        />
        <ToggleControl
          label={__("Hide On Mobile", "ultimate-blocks-pro")}
          checked={hideStickyTOCOnMobile}
          onChange={() =>
            setAttributes({
              hideStickyTOCOnMobile: !hideStickyTOCOnMobile,
            })
          }
        />
        <RangeControl
          min={0}
          max={100}
          allowReset
          value={stickyTOCPosition}
          resetFallbackValue={75}
          onChange={(newValue) => {
            setAttributes({
              stickyTOCPosition: newValue,
            });
          }}
          label={__("Position (%)", "ultimate-blocks-pro")}
        />
        <RangeControl
          min={0}
          max={1500}
          allowReset
          value={stickyTOCWidth}
          resetFallbackValue={350}
          onChange={(newValue) => {
            setAttributes({
              stickyTOCWidth: newValue,
            });
          }}
          label={__("Width (PX)", "ultimate-blocks-pro")}
        />
      </PanelBody>
    );
    const proPros = {
      stickyControl,
      hideElementPro,
      listIcon,
      toggleButtonType,
      styleTagPro,
      savedStylePro,
      iconControlPro,
      toggleButtonTypeControl,
      isSticky,
      stickyColorSettings,
      parseProList,
    };
    return <BlockEdit {...this.props} {...proPros} />;
  }
}
