import {
  oneColumnIcon,
  twoColumnsIcon,
  threeColumnsIcon,
  plainList,
} from "./icons";
import React, { Component, Fragment } from "react";
import { SpacingControl } from "../../components/StylingControls";
import { getStyles } from "./get-styles";
import {
  getDescendantBlocks,
  mergeRichTextArray,
  dashesToCamelcase,
  splitArray,
  splitArrayIntoChunks,
  generateIcon,
} from "../../global";
import toLatin from "./localToLatin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import filterDiacritics from "./removeDiacritics";
import { fas, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import SavedStylesInspectorPanel from "@Components/SavedStyles/SavedStylesInspectorPanel";
import { IconControl } from "@Library/ub-common/Components";
import InspectorControlsStylesTab from "@Components/Common/InspectorControlsStylesTab";

library.add(fas, fab, faEye, faEyeSlash);

const allIcons = Object.assign(fas, fab);

import {
  ToggleControl,
  PanelRow,
  PanelBody,
  ToolbarGroup,
  ToolbarButton,
  SelectControl,
  CheckboxControl,
  RangeControl,
  TextControl,
  Dropdown,
  Button,
  Disabled,
} from "@wordpress/components";
import {
  InspectorControls,
  BlockControls,
  PanelColorSettings,
  RichText,
  AlignmentToolbar,
  BlockAlignmentControl,
} from "@wordpress/block-editor";
import { select, dispatch, subscribe } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { loadPromise, models } from "@wordpress/api";
import { generateStyles, getSpacingCss } from "../../utils/styling-helpers";

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

class TableOfContents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: props.headers,
      unsubscribe: null,
      breaks: [],
      currentlyEditedItem: "", //set to clientid of heading
      hasIdMismatch: false,
      replacementHeaders: [],
    };
  }

  componentDidMount() {
    const { updateBlockAttributes } =
      dispatch("core/block-editor") || dispatch("core/editor");
    const { getBlock } = select("core/block-editor") || select("core/editor");

    const getHeadingBlocks = () => {
      const headings = [];

      let pageNum = 1;

      const pageBreaks = [];

      const rootBlocks = (
        select("core/block-editor") || select("core/editor")
      ).getBlocks();
      rootBlocks.forEach((block) => {
        if (block.name === "core/heading") {
          headings.push(block);
          pageBreaks.push(pageNum);
        } else {
          const newBlock = Object.assign({}, block);
          const blockAttributes = block.attributes;
          if (block.name === "ub/advanced-heading") {
            newBlock.attributes = Object.assign({}, blockAttributes, {
              level: Number(blockAttributes.level.charAt(1)),
            });
            headings.push(newBlock);
            pageBreaks.push(pageNum);
          } else if (block.name === "uagb/advanced-heading") {
            newBlock.attributes = Object.assign(blockAttributes, {
              content: blockAttributes.headingTitle || "",
            });
            headings.push(newBlock);
            pageBreaks.push(pageNum);
          } else if (block.name === "themeisle-blocks/advanced-heading") {
            if (
              ["h1", "h2", "h3", "h4", "h5", "h6"].includes(
                block.attributes.tag
              )
            ) {
              newBlock.attributes = Object.assign(blockAttributes, {
                level: Number(blockAttributes.tag.charAt(1)),
                anchor: `themeisle-otter ${blockAttributes.id}`,
              });
              headings.push(newBlock);
              pageBreaks.push(pageNum);
            }
          } else if (block.name === "kadence/advancedheading") {
            if (!("content" in newBlock.attributes)) {
              newBlock.attributes.content = "";
            }
            headings.push(newBlock);
            pageBreaks.push(pageNum);
          } else if (block.name === "generateblocks/headline") {
            if (
              ["h1", "h2", "h3", "h4", "h5", "h6"].includes(
                newBlock.attributes.element
              )
            ) {
              newBlock.attributes = Object.assign(
                {},
                {
                  content: Array.isArray(blockAttributes.content)
                    ? mergeRichTextArray(blockAttributes.content)
                    : blockAttributes.content,
                  level: Number(blockAttributes.element.charAt(1)),
                  anchor: blockAttributes.elementId,
                }
              );
              //also set elementID to generated anchor value
              headings.push(newBlock);
            }
          } else if (block.name === "ub/content-toggle-panel-block") {
            if (block.attributes.useToggleInToC) {
              newBlock.attributes = Object.assign(
                {},
                {
                  content: blockAttributes.panelTitle,
                  level: Number(blockAttributes.titleTag.charAt(1)),
                  anchor: blockAttributes.toggleID,
                }
              );
              headings.push(newBlock);
            }
          } else if (block.name === "core/nextpage") {
            pageNum++;
          }
          if (block.innerBlocks.length > 0) {
            let internalHeadings = getDescendantBlocks(block).filter(
              (block) =>
                [
                  "core/heading",
                  "kadence/advancedheading",
                  "themeisle-blocks/advanced-heading",
                  "uagb/advanced-heading",
                  "generateblocks/headline",
                  "ub/advanced-heading",
                ].includes(block.name) ||
                (block.name === "ub/content-toggle-panel-block" &&
                  block.attributes.useToggleInToC)
            );

            if (internalHeadings.length > 0) {
              internalHeadings = internalHeadings.map((h) => {
                switch (h.name) {
                  case "ub/advanced-heading":
                    h.attributes = Object.assign({}, h.attributes);
                    if (typeof h.attributes.level !== "number") {
                      h.attributes.level = Number(h.attributes.level.charAt(1));
                    }
                    break;
                  case "kadence/advancedheading":
                    if (!("content" in h.attributes)) {
                      h.attributes.content = "";
                    }
                    break;
                  case "themeisle-blocks/advanced-heading":
                    h.attributes.level = [...Array(6).keys()]
                      .map((a) => `h${a + 1}`)
                      .includes(h.attributes.tag)
                      ? Number(h.attributes.tag.charAt(1))
                      : 0;
                    h.attributes.anchor = `themeisle-otter ${h.attributes.id}`;
                    break;
                  case "uagb/advanced-heading":
                    h.attributes.content = h.attributes.headingTitle || "";
                    break;
                  case "generateblocks/headline":
                    h.attributes = Object.assign({}, h.attributes);
                    h.attributes.level = [...Array(6).keys()]
                      .map((a) => `h${a + 1}`)
                      .includes(h.attributes.element)
                      ? Number(h.attributes.element.charAt(1))
                      : 0;
                    if (Array.isArray(h.attributes.content)) {
                      h.attributes.content = mergeRichTextArray(
                        h.attributes.content
                      );
                    }
                    break;
                  case "ub/content-toggle-panel-block":
                    h.attributes.content = h.attributes.panelTitle;
                    h.attributes.level = Number(
                      blockAttributes.titleTag.charAt(1)
                    );
                    h.attributes.anchor = h.attributes.toggleID;

                    break;
                  default:
                    break;
                }
                return h;
              });
              internalHeadings.filter((h) => h.attributes.level > 0);
            }

            if (internalHeadings.length > 0) {
              headings.push(...internalHeadings);
              pageBreaks.push(...Array(internalHeadings.length).fill(pageNum));
            }
          }
        }
      });

      if (JSON.stringify(this.state.breaks) !== JSON.stringify(pageBreaks)) {
        this.setState({ breaks: pageBreaks });
      }

      return headings;
    };

    const setHeadings = (checkIDs = true) => {
      const { removeDiacritics } = this.props;
      const headers = getHeadingBlocks().map((header) =>
        Object.assign(header.attributes, {
          clientId: header.clientId,
          blockName: header.name,
        })
      );

      headers.forEach((heading, key) => {
        if (
          !heading.anchor ||
          heading.anchor.indexOf("themeisle-otter ") === -1
        ) {
          heading.anchor = `${key}-${
            typeof heading.content === "undefined"
              ? ""
              : (this.props.allowToLatin
                  ? toLatin("all", heading.content.toString())
                  : heading.content.toString()
                )
                  .toLowerCase()
                  .replace(/( |<.+?>|&nbsp;)/g, "-")
          }`;

          heading.anchor = heading.anchor
            .replace(/[^\w\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s-]/g, "")
            .replace(/-{2,}/g, "-");

          if (removeDiacritics) {
            heading.anchor = filterDiacritics(heading.anchor).replace(
              /[\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF]/g,
              ""
            );
          }

          heading.anchor = encodeURIComponent(heading.anchor);

          if (
            heading.blockName === "generateblocks/headline" &&
            heading.anchor !== getBlock(heading.clientId).attributes.anchor
          ) {
            updateBlockAttributes(heading.clientId, {
              anchor: heading.anchor,
            });
          }

          if (
            heading.blockName === "ub/advanced-heading" &&
            heading.anchor !== getBlock(heading.clientId).attributes.anchor
          ) {
            updateBlockAttributes(heading.clientId, {
              anchor: heading.anchor,
            });
          }

          if (
            heading.blockName === "ub/content-toggle-panel-block" &&
            heading.anchor !== getBlock(heading.clientId).attributes.toggleID
          ) {
            updateBlockAttributes(heading.clientId, {
              toggleID: heading.anchor,
            });
          }
        }
      });

      const currentIDs = this.state.headers
        ? this.state.headers.map((header) => header.clientId)
        : [];

      const hasHeadings =
        Array.isArray(this.state.headers) && this.state.headers.length > 0;

      const newHeaders = headers.map((header, i) => ({
        blockName: header.blockName,
        clientId: header.clientId,
        content: header.content,
        level: header.level,
        anchor: header.anchor,
        index: i,
        disabled:
          hasHeadings &&
          this.state.headers[i] &&
          "disabled" in this.state.headers[i]
            ? checkIDs
              ? currentIDs.indexOf(header.clientId) > -1
                ? this.state.headers[currentIDs.indexOf(header.clientId)]
                    .disabled
                : false
              : this.state.headers[i].disabled
            : false,
        customContent:
          hasHeadings &&
          this.state.headers[i] &&
          "customContent" in this.state.headers[i]
            ? checkIDs
              ? currentIDs.indexOf(header.clientId) > -1
                ? this.state.headers[currentIDs.indexOf(header.clientId)]
                    .customContent
                : ""
              : this.state.headers[i].customContent
            : "",
      }));

      if (JSON.stringify(newHeaders) !== JSON.stringify(this.state.headers)) {
        if (Array.isArray(this.state.headers)) {
          if (this.state.headers.length === newHeaders.length) {
            const hasMismatch = false;

            this.state.headers.some(
              (h, i) => h.clientId !== newHeaders[i].clientId
            );

            if (checkIDs && hasMismatch) {
              this.setState({
                hasIdMismatch: true,
                replacementHeaders: newHeaders,
              });
            } else {
              this.setState({
                headers: this.state.headers.map((hd, i) => {
                  const defaultReplacement =
                    this.state.headers[
                      this.state.headers
                        .map((h) => h.clientId)
                        .indexOf(newHeaders[i].clientId)
                    ] || hd;
                  return Object.assign({}, newHeaders[i], {
                    disabled:
                      newHeaders[i].disabled || defaultReplacement.disabled,
                    customContent:
                      newHeaders[i].customContent ||
                      defaultReplacement.customContent,
                  });
                }),
              });
            }
          } else {
            this.setState({
              hasIdMismatch: true,
              replacementHeaders: newHeaders,
            });
          }
        } else {
          this.setState({ headers: newHeaders });
        }
      }
    };

    setHeadings(false);

    const unsubscribe = subscribe(() => setHeadings());
    this.setState({ unsubscribe });

    // bind setHeadings to component context
    this.setHeadings = setHeadings.bind(this);
  }

  componentWillUnmount() {
    this.state.unsubscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    // call header manipulation to trigger latin alphabet conversion of links
    const { setAttributes, attributes } = this.props.blockProp;
    const { headers, replacementHeaders, breaks, currentlyEditedItem } =
      this.state;

    if (
      this.props.allowToLatin !== prevProps.allowToLatin ||
      this.props.removeDiacritics !== prevProps.removeDiacritics
    ) {
      this.setHeadings();
      setAttributes({ links: JSON.stringify(headers) });
      return;
    }

    if (JSON.stringify(headers) !== JSON.stringify(prevState.headers)) {
      setAttributes({ links: JSON.stringify(headers) });
    }
    if (breaks !== attributes.gaps) {
      setAttributes({ gaps: breaks });
    }

    if (this.state.hasIdMismatch) {
      const oldIDs = Array.isArray(headers)
        ? headers.map((h) => h.clientId)
        : [];
      const newIDs = replacementHeaders.map((h) => h.clientId);

      if (oldIDs.length === newIDs.length) {
        const mismatchLocs = [];
        for (let i = 0; i < replacementHeaders.length; i++) {
          if (headers[i].clientId !== replacementHeaders[i].clientId) {
            mismatchLocs.push(i);
          }
        }
        let replacements = JSON.parse(JSON.stringify(replacementHeaders)).sort(
          (a, b) =>
            newIDs.indexOf(a.clientId) > newIDs.indexOf(b.clientId) ? 1 : -1
        );

        if (mismatchLocs.length < 1) {
          replacements = replacements.map((h, i) =>
            Object.assign({}, h, {
              disabled: headers[newIDs.indexOf(headers[i].clientId)].disabled,
              customContent:
                headers[newIDs.indexOf(headers[i].clientId)].customContent,
            })
          );
        }

        this.setState({
          headers: JSON.parse(JSON.stringify(replacements)),
        });
      } else {
        const diff = [];
        let currentHeaders = JSON.parse(JSON.stringify(headers)) || [];
        if (oldIDs.length < newIDs.length) {
          const insertionSpots = [];
          newIDs.forEach((nh, i) => {
            if (oldIDs.indexOf(nh) === -1) {
              diff.push(nh);
              insertionSpots.push(i);
            }
          });

          insertionSpots.forEach((index, i) => {
            const currentHeader = replacementHeaders.filter(
              (nh) => nh.clientId === diff[i]
            )[0];
            currentHeaders.splice(index, 0, currentHeader);
          });
        } else {
          const deletionSpots = [];

          oldIDs.forEach((nh, i) => {
            if (newIDs.indexOf(nh) === -1) {
              diff.push(nh);
              deletionSpots.push(i);
            }
          });

          if (newIDs.length) {
            deletionSpots.forEach((index) => {
              if (index !== currentHeaders[index].index) {
                //heading split, transfer extra attributes of old heading to first of two new ones
                Object.assign(currentHeaders[currentHeaders[index].index], {
                  disabled: currentHeaders[index].disabled,
                  customContent: currentHeaders[index].customContent,
                });
              }
              currentHeaders.splice(index, 1);
            });
          } else {
            currentHeaders = [];
          }
        }
        this.setState({ headers: currentHeaders });
      }

      this.setState({ hasIdMismatch: false });
    }

    if (this.props.canRemoveItemFocus) {
      if (currentlyEditedItem) {
        this.setState({ currentlyEditedItem: "" });
      }
      this.props.itemFocusRemoved();
    }
  }

  render() {
    const {
      allowedHeaders,
      blockProp,
      style,
      numColumns,
      listStyle,
      listIcon,
    } = this.props;

    const { isSelected } = blockProp;

    const { headers, currentlyEditedItem } = this.state;

    const placeItem = (arr, item) => {
      if (arr.length === 0 || arr[0].level === item.level) {
        arr.push(Object.assign({}, item));
      } else if (arr[arr.length - 1].level < item.level) {
        if (!arr[arr.length - 1].children) {
          arr[arr.length - 1].children = [Object.assign({}, item)];
        } else placeItem(arr[arr.length - 1].children, item);
      }
    };

    const makeHeaderArray = (origHeaders) => {
      const array = [];

      origHeaders
        .filter((header) => allowedHeaders[header.level - 1])
        .filter((header) => !header.disabled || isSelected)
        .forEach((header) => placeItem(array, header));

      return array;
    };

    const readCustomHeadingInput = () => {
      const revisedHeaders = JSON.parse(JSON.stringify(this.state.headers));

      const currentlyEditedHeader = revisedHeaders.filter(
        (h) => h.clientId === currentlyEditedItem
      )[0];

      if (
        currentlyEditedHeader.customContent ===
        currentlyEditedHeader.content.replace(/<.+?>/g, "")
      ) {
        //no changes detected
        revisedHeaders[currentlyEditedHeader.index].customContent = "";
        this.setState({ headers: revisedHeaders });
      }
      this.setState({ currentlyEditedItem: "" });
    };

    const parseList = (list) =>
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
              <ol>{parseList(item.children)}</ol>
            ) : (
              <ul
                className={listIcon ? "fa-ul" : null}
                style={{
                  listStyle: listStyle === "plain" ? "none" : null,
                  gridArea:
                    listStyle === "bulleted" && listIcon ? "extra" : null,
                }}
              >
                {parseList(item.children)}
              </ul>
            ))}
        </li>
      ));

    if (!isSelected) {
      if (currentlyEditedItem) {
        readCustomHeadingInput();
      }
    }

    if (
      headers.length > 0 &&
      headers.filter((header) => allowedHeaders[header.level - 1]).length > 0
    ) {
      return (
        <div
          style={style}
          className={`ub_table-of-contents-container ub_table-of-contents-${numColumns}-column`}
        >
          {listStyle === "numbered" ? (
            <ol>{parseList(makeHeaderArray(headers))}</ol>
          ) : (
            <ul
              className={listIcon ? "fa-ul" : null}
              style={{
                listStyle: listStyle === "plain" ? "none" : null,
              }}
            >
              {parseList(makeHeaderArray(headers))}
            </ul>
          )}
        </div>
      );
    }
    return (
      blockProp && (
        <p className="ub_table-of-contents-placeholder">
          {__("Add a heading to begin generating the table of contents")}
        </p>
      )
    );
  }
}

const blockControls = (props) => {
  const { setAttributes } = props;
  const { numColumns, titleAlignment, listStyle, align } = props.attributes;
  return (
    <BlockControls group="block">
      <BlockAlignmentControl
        value={align}
        controls={["wide", "full"]}
        onChange={(newAlign) => setAttributes({ align: newAlign })}
      />
      <ToolbarGroup>
        <ToolbarButton
          className={"ub_toc_column_selector"}
          icon={oneColumnIcon}
          label={__("One column")}
          isPrimary={numColumns === 1}
          onClick={() => setAttributes({ numColumns: 1 })}
        />
        <ToolbarButton
          className={"ub_toc_column_selector"}
          icon={twoColumnsIcon}
          label={__("Two columns")}
          isPrimary={numColumns === 2}
          onClick={() => setAttributes({ numColumns: 2 })}
        />
        <ToolbarButton
          className={"ub_toc_column_selector"}
          icon={threeColumnsIcon}
          label={__("Three columns")}
          isPrimary={numColumns === 3}
          onClick={() => setAttributes({ numColumns: 3 })}
        />
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarButton
          icon="editor-ul"
          label={__("Bulleted list")}
          isPrimary={listStyle === "bulleted"}
          onClick={() => setAttributes({ listStyle: "bulleted" })}
        />
        <ToolbarButton
          icon="editor-ol"
          label={__("Numbered list")}
          isPrimary={listStyle === "numbered"}
          onClick={() => setAttributes({ listStyle: "numbered", listIcon: "" })}
        />
        <ToolbarButton
          icon={plainList}
          label={__("Plain list")}
          isPrimary={listStyle === "plain"}
          onClick={() => setAttributes({ listStyle: "plain", listIcon: "" })}
        />
      </ToolbarGroup>
      <AlignmentToolbar
        value={titleAlignment}
        onChange={(value) => setAttributes({ titleAlignment: value })}
      />
    </BlockControls>
  );
};

const editorDisplay = (props, _, setState) => {
  const { setAttributes, canRemoveItemFocus } = props;

  const {
    links,
    title,
    allowedHeaders,
    showList,
    allowToCHiding,
    numColumns,
    listStyle,
    titleAlignment,
    allowToLatin,
    removeDiacritics,
    titleColor,
    titleBackgroundColor,
    listColor,
    listBackgroundColor,
    listIcon,
    blockID,
    toggleButtonType,
    listIconColor,
  } = props.attributes;

  return (
    <>
      <div
        className="ub_table-of-contents-header"
        style={{
          textAlign: titleAlignment,
          backgroundColor: titleBackgroundColor,
        }}
      >
        <div
          className="ub_table-of-contents-title"
          style={{ color: titleColor }}
        >
          <RichText
            placeholder={__("Optional title")}
            className="ub_table-of-contents-title"
            onFocus={() => setState({ canRemoveItemFocus: true })}
            onChange={(text) => setAttributes({ title: text })}
            value={title}
            keepPlaceholderOnFocus={true}
          />
        </div>
        {allowToCHiding && (
          <div id="ub_table-of-contents-header-toggle">
            {toggleButtonType === "text" && (
              <div id="ub_table-of-contents-toggle">
                [
                <a
                  className="ub_table-of-contents-toggle-link"
                  href="#"
                  onClick={() => setAttributes({ showList: !showList })}
                >
                  {showList ? __("hide") : __("show")}
                </a>
                ]
              </div>
            )}
            {toggleButtonType !== "text" && (
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
            )}
          </div>
        )}
      </div>
      {showList && (
        <TableOfContents
          listStyle={listStyle}
          listIcon={listIcon}
          numColumns={numColumns}
          allowedHeaders={allowedHeaders}
          headers={links && JSON.parse(links)}
          blockProp={props}
          allowToLatin={allowToLatin}
          removeDiacritics={removeDiacritics}
          canRemoveItemFocus={canRemoveItemFocus}
          itemFocusRemoved={() => setState({ canRemoveItemFocus: false })}
          style={{
            color: listColor,
            backgroundColor: listBackgroundColor,
          }}
          toggleButtonType={toggleButtonType}
        />
      )}
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
    </>
  );
};

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
    const { isSelected, attributes, setAttributes } = this.props;

    const {
      blockID,
      allowedHeaders,
      showList,
      hideOnMobile,
      allowToCHiding,
      enableSmoothScroll,
      allowToLatin,
      removeDiacritics,
      scrollOption,
      scrollOffset,
      scrollTarget,
      scrollTargetType,
      titleColor,
      titleBackgroundColor,
      listColor,
      listStyle,
      listIcon,
      listIconColor,
      listBackgroundColor,
      toggleButtonType,
      numColumns,
      isSticky,
      stickyButtonIconColor,
      stickyTOCPosition,
      hideStickyTOCOnMobile,
      stickyTOCWidth,
      linkToDivider,
      padding,
      margin,
    } = attributes;

    const {
      availableIcons,
      hasApiAccess,
      recentSelection,
      selectionTime,
      iconChoices,
      selectedIcon,
      iconSearchResultsPage,
      iconSearchTerm,
    } = this.state;

    const { updateBlockAttributes } =
      dispatch("core/block-editor") || dispatch("core/editor");
    const { getBlocks } = select("core/block-editor") || select("core/editor");

    const iconListPage = splitArrayIntoChunks(
      availableIcons.filter((i) => i.iconName.includes(iconSearchTerm)),
      20
    );
    const paddingObj = getSpacingCss(padding);
    const marginObj = getSpacingCss(margin);

    let styles = {
      paddingTop: paddingObj?.top,
      paddingRight: paddingObj?.right,
      paddingBottom: paddingObj?.bottom,
      paddingLeft: paddingObj?.left,
      marginTop: marginObj?.top,
      marginRight: marginObj?.right,
      marginBottom: marginObj?.bottom,
      marginLeft: marginObj?.left,
    };

    const createColorSetting = (attrKey, label) => ({
      value: attributes[attrKey],
      onChange: (newValue) => setAttributes({ [attrKey]: newValue }),
      label: __(label),
    });

    const getColorSettings = () => {
      const settings = [
        createColorSetting("titleColor", "Title Color"),
        createColorSetting("titleBackgroundColor", "Title Background Color"),
        createColorSetting("listColor", "List Color"),
        createColorSetting("listBackgroundColor", "List Background Color"),
        ...(listStyle !== "plain"
          ? [
              createColorSetting(
                "listIconColor",
                listStyle === "numbered"
                  ? "Item number color"
                  : "List icon color"
              ),
            ]
          : []),
        ...(isSticky
          ? [
              createColorSetting(
                "stickyButtonIconColor",
                __("Sticky Button Icon Color", "ultimate-blocks-pro")
              ),
            ]
          : []),
      ];
      return settings.filter((setting) => Object.keys(setting).length > 0);
    };
    return [
      isSelected && (
        <Fragment>
          <InspectorControlsStylesTab>
            <SavedStylesInspectorPanel
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
            <PanelBody
              title={__("Colors", "ultimate-blocks-pro")}
              initialOpen={false}
            >
              <PanelColorSettings
                title={__("Color Settings")}
                initialOpen={false}
                colorSettings={getColorSettings()}
              />
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
            <PanelBody
              title={__("Allowed Headings", "ultimate-blocks-pro")}
              initialOpen={true}
            >
              <div className="ub_toc_heading_selection">
                {allowedHeaders.map((a, i) => (
                  <CheckboxControl
                    label={`H${i + 1}`}
                    checked={a}
                    onChange={() =>
                      setAttributes({
                        allowedHeaders: [
                          ...allowedHeaders.slice(0, i),
                          !allowedHeaders[i],
                          ...allowedHeaders.slice(i + 1),
                        ],
                      })
                    }
                  />
                ))}
              </div>
            </PanelBody>
            <PanelBody
              title={__("Layout", "ultimate-blocks-pro")}
              initialOpen={false}
            >
              <PanelRow>
                <p>{__("Columns")}</p>
                <ToolbarGroup>
                  <ToolbarButton
                    className={"ub_toc_column_selector"}
                    icon={oneColumnIcon}
                    label={__("One column")}
                    isPrimary={numColumns === 1}
                    onClick={() => setAttributes({ numColumns: 1 })}
                  />
                  <ToolbarButton
                    className={"ub_toc_column_selector"}
                    icon={twoColumnsIcon}
                    label={__("Two columns")}
                    isPrimary={numColumns === 2}
                    onClick={() => setAttributes({ numColumns: 2 })}
                  />
                  <ToolbarButton
                    className={"ub_toc_column_selector"}
                    icon={threeColumnsIcon}
                    label={__("Three columns")}
                    isPrimary={numColumns === 3}
                    onClick={() => setAttributes({ numColumns: 3 })}
                  />
                </ToolbarGroup>
              </PanelRow>
              <PanelRow>
                <p>{__("List type")}</p>
                <ToolbarGroup>
                  <ToolbarButton
                    icon="editor-ul"
                    label={__("Bulleted list")}
                    isPrimary={listStyle === "bulleted"}
                    onClick={() =>
                      setAttributes({
                        listStyle: "bulleted",
                      })
                    }
                  />
                  <ToolbarButton
                    icon="editor-ol"
                    label={__("Numbered list")}
                    isPrimary={listStyle === "numbered"}
                    onClick={() =>
                      setAttributes({
                        listStyle: "numbered",
                      })
                    }
                  />
                  <ToolbarButton
                    icon={plainList}
                    label={__("Plain list")}
                    isPrimary={listStyle === "plain"}
                    onClick={() =>
                      setAttributes({
                        listStyle: "plain",
                      })
                    }
                  />
                </ToolbarGroup>
              </PanelRow>
              <br></br>
              {listStyle === "bulleted" && (
                <IconControl
                  label={__("Current icon", "ultimate-blocks-pro")}
                  onIconSelect={(val) => setAttributes({ listIcon: val })}
                  selectedIcon={listIcon}
                />
              )}
            </PanelBody>
            <PanelBody
              title={__("Collapsible", "ultimate-blocks-pro")}
              initialOpen={false}
            >
              <ToggleControl
                label={__("Collapsible", "ultimate-blocks")}
                id="ub_toc_toggle_display"
                checked={allowToCHiding}
                onChange={(allowToCHiding) =>
                  setAttributes({
                    allowToCHiding,
                    showList: allowToCHiding ? showList : true,
                    hideOnMobile: false,
                  })
                }
              />
              {allowToCHiding && (
                <>
                  <ToggleControl
                    label={__("Initial Show", "ultimate-blocks")}
                    id="ub_show_toc"
                    checked={showList}
                    onChange={() => setAttributes({ showList: !showList })}
                  />
                  <ToggleControl
                    label={__("Initial Hide on Mobile", "ultimate-blocks")}
                    id="ub_hide_on_mobile"
                    checked={hideOnMobile}
                    onChange={() =>
                      setAttributes({ hideOnMobile: !hideOnMobile })
                    }
                  />
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
                </>
              )}
            </PanelBody>
            <PanelBody
              title={__("Scroll", "ultimate-blocks-pro")}
              initialOpen={false}
            >
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
                  {
                    label: __("No adjustments"),
                    value: "off",
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
              <ToggleControl
                label={__("Enable smooth scrolling", "ultimate-blocks")}
                id="ub_toc_scroll"
                checked={enableSmoothScroll}
                onChange={() => {
                  const tocInstances = getBlocks().filter(
                    (block) => block.name === "ub/table-of-contents-block"
                  );
                  tocInstances.forEach((instance) => {
                    updateBlockAttributes(instance.clientId, {
                      enableSmoothScroll: !enableSmoothScroll,
                    });
                  });
                }}
              />
            </PanelBody>
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
            <PanelBody title={__("Additional")} initialOpen={false}>
              <Disabled isDisabled={isSticky} style={{ marginBottom: "24px" }}>
                <ToggleControl
                  label={__("Link to divider", "ultimate-blocks")}
                  checked={linkToDivider}
                  onChange={() =>
                    setAttributes({ linkToDivider: !linkToDivider })
                  }
                />
              </Disabled>
              <ToggleControl
                label={__("Romanize anchor links", "ultimate-blocks")}
                id="ub_toc_enable_latin_conversion"
                checked={allowToLatin}
                onChange={(e) => setAttributes({ allowToLatin: e })}
              />
              <ToggleControl
                label={__(
                  "Remove diacritics from anchor links",
                  "ultimate-blocks"
                )}
                id="ub_toc_toggle_diacritics"
                checked={removeDiacritics}
                onChange={(removeDiacritics) =>
                  setAttributes({ removeDiacritics })
                }
              />
            </PanelBody>
          </InspectorControls>
        </Fragment>
      ),
      isSelected && blockControls(this.props),
      <div
        id={`ub_table-of-contents-${blockID}`}
        style={generateStyles(styles)}
      >
        {editorDisplay(this.props, this.state, this.setState)}
      </div>,
    ];
  }
}
