import {
  arrayMove,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from "react-sortable-hoc";
import { __ } from "@wordpress/i18n";
import { createBlock } from "@wordpress/blocks";
import Inspector from "./inspector";
import { Component } from "react";
import {
  BlockControls,
  InnerBlocks,
  BlockAlignmentControl,
} from "@wordpress/block-editor";
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";
import TabTitle from "./TabTitle";
import IndexDataRegistry from "../inc/js/IndexDataRegistry";
import { getParentBlock } from "../../../common";
import { generateStyles, getSpacingCss } from "../../../utils/styling-helpers";

export class TabHolder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: -1,
      oldArrangement: [],
      showIconControls: false,
      showImageControls: false,
    };

    // context bindings
    this.isCTAEnabled = this.isCTAEnabled.bind(this);
  }

  /**
   * Get call-to-action status for current active tab.
   *
   * @return {boolean} status
   */
  isCTAEnabled() {
    const { attributes } = this.props;
    const { tabCallToAction, activeTab } = attributes;

    return typeof tabCallToAction[activeTab] === "string";
  }

  componentDidMount() {
    const { attributes, setAttributes } = this.props;
    const { tabsTitle, tabsTitleAlignment, tabsAnchor, useAnchors } =
      attributes;

    if (tabsTitle.length !== tabsTitleAlignment.length) {
      setAttributes({
        tabsTitleAlignment: Array(tabsTitle.length).fill("center"),
      });
    }

    if (useAnchors && tabsTitle.length > tabsAnchor.length) {
      setAttributes({
        tabsAnchor: tabsAnchor.concat(
          Array(tabsTitle.length - tabsAnchor.length).fill("")
        ),
      });
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.checkWidth);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.attributes.blockID !== this.props.block.clientId) {
      this.props.setAttributes({ blockID: this.props.block.clientId });
    }
  }
  render() {
    const {
      setAttributes,
      attributes,
      isSelected,
      moveBlockToPosition,
      updateBlockAttributes,
      removeBlock,
      selectedBlock,
      selectBlock,
      insertBlock,
      getBlock,
      getClientIdsWithDescendants,
      rootBlockClientId,
    } = this.props;

    const { oldArrangement } = this.state;

    const className = "wp-block-ub-tabbed-content";

    window.ubTabbedContentBlocks = window.ubTabbedContentBlocks || [];

    const {
      tabsTitle,
      tabsSubTitle,
      tabsTitleAlignment,
      useAnchors,
      tabsAnchor,
      activeTab,
      tabsAlignment,
      tabVertical,
      blockID,
      tabStyle,
      tabsSubTitleEnabled,
      tabsIconStatus,
      tabIcons,
      tabIconSize,
      align,
      padding,
      margin,
    } = attributes;
    const rootBlock = getParentBlock(rootBlockClientId, "core/block");

    let block = null;

    for (const bl of window.ubTabbedContentBlocks) {
      if (bl.id === attributes.id) {
        block = bl;
        break;
      }
    }

    if (!block) {
      block = {
        id: this.props.block.clientId,
        SortableItem: null,
        SortableList: null,
      };
      window.ubTabbedContentBlocks.push(block);
      if (!rootBlock) {
        setAttributes({ id: block.id });
      }
    }

    if (!attributes.tabsTitle) {
      attributes.tabsTitle = [];
    }

    const tabs = this.props.block.innerBlocks;

    const showControls = (type, index) => {
      setAttributes({
        activeControl: `${type}-${index}`,
        activeTab: index,
      });

      tabs.forEach((tab, i) => {
        updateBlockAttributes(tab.clientId, { isActive: index === i });
      });
    };

    const addTab = (i) => {
      insertBlock(
        createBlock("ub/tab-block", {}),
        i,
        this.props.block.clientId
      );
      setAttributes({
        tabsTitle: [...tabsTitle, `Tab ${i + 1}`],
        tabsTitleAlignment: [...tabsTitleAlignment, "left"],
        activeTab: i,
        tabsAnchor: useAnchors ? [...tabsAnchor, ""] : [],
      });

      showControls("tab-title", i);
    };

    if (attributes.tabsTitle.length === 0) {
      addTab(0);
    }

    const DragHandle = SortableHandle(() => (
      <span className="dashicons dashicons-move drag-handle" />
    ));

    if (!block.SortableItem) {
      block.SortableItem = SortableElement(
        ({
          value,
          i,
          propz,
          onChangeTitle,
          onChangeSubTitle,
          onRemoveTitle,
          toggleTitle,
        }) => {
          const {
            attributes: {
              tabsTitleAlignment,
              activeTab,
              tabStyle,
              theme,
              normalColor,
              titleColor,
              normalTitleColor,
              activeControl,
              isSelected,
              tabsSubTitle,
              tabsSubTitleEnabled,
              tabsIconStatus,
              tabIconSize,
              tabIcons,
              tabsImageStatus,
              tabImages,
              tabImageWidth,
              tabImageHeight,
              tabButtonsBorderRadius,
            },
          } = propz;

          return (
            <TabTitle
              borderRadius={tabButtonsBorderRadius}
              masterClassName={className}
              titleAlignment={tabsTitleAlignment[i]}
              tabIndex={i}
              activeTabIndex={activeTab}
              isTabVertical={tabVertical}
              tabStyle={tabStyle}
              theme={theme}
              normalBgColor={normalColor}
              textColor={titleColor}
              normalTextColor={normalTitleColor}
              toggleTitle={toggleTitle}
              titleMainText={value}
              activeControlName={activeControl}
              isSelected={isSelected}
              onChangeTitle={onChangeTitle}
              onChangeSubTitle={onChangeSubTitle}
              sortHandles={<DragHandle />}
              onRemoveTitle={onRemoveTitle}
              titleSubText={tabsSubTitle[i] ?? ""}
              tabsSubTitleEnabled={tabsSubTitleEnabled}
              tabsIconStatus={tabsIconStatus}
              tabIconName={tabIcons[i] ?? ""}
              tabImage={tabImages[i] ?? {}}
              tabIconSize={tabIconSize}
              tabImageWidth={tabImageWidth}
              tabImageHeight={tabImageHeight}
              iconIsSelected={activeTab === i && this.state.showIconControls}
              imageIsSelected={activeTab === i && this.state.showImageControls}
              tabsImageStatus={tabsImageStatus}
              onClick={(e) => {
                const iconElements = ["path", "svg"];
                const isIconTargeted =
                  e.target.classList.contains(
                    "ultimate-blocks-icon-component"
                  ) || iconElements.includes(e.target.nodeName.toLowerCase());
                this.setState({
                  showIconControls: isIconTargeted,
                });
                const imageElements = ["figure", "img"];
                const isImageTargeted =
                  e.target.classList.contains(
                    "ultimate-blocks-tabbed-image-component"
                  ) || imageElements.includes(e.target.nodeName.toLowerCase());
                this.setState({
                  showImageControls: isImageTargeted,
                });
              }}
            />
          );
        }
      );
    }

    if (!block.SortableList) {
      block.SortableList = SortableContainer(
        ({
          items,
          propz,
          onChangeTitle,
          onChangeSubTitle,
          onRemoveTitle,
          toggleTitle,
          onAddTab,
        }) => (
          <div
            className={`${className}-tabs-title${
              propz.attributes.tabVertical ? "-vertical-tab" : ""
            } SortableList`}
            style={{
              justifyContent:
                propz.attributes.tabsAlignment === "center"
                  ? "center"
                  : `flex-${
                      propz.attributes.tabsAlignment === "left"
                        ? "start"
                        : "end"
                    }`,
            }}
            useWindowAsScrollContainer={true}
          >
            {items.map((value, index) => (
              <block.SortableItem
                propz={propz}
                key={`item-${index}`}
                i={index}
                index={index}
                value={value}
                onChangeTitle={onChangeTitle}
                onChangeSubTitle={onChangeSubTitle}
                onRemoveTitle={onRemoveTitle}
                toggleTitle={toggleTitle}
              />
            ))}
            <div
              className={`${className}-tab-title-${
                attributes.tabVertical ? "vertical-" : ""
              }wrap`}
              key={propz.attributes.tabsTitle.length}
              onClick={() => onAddTab(propz.attributes.tabsTitle.length)}
            >
              <span className="dashicons dashicons-plus-alt" />
            </div>
          </div>
        )
      );
    }

    const newArrangement = tabs.map((tab) => tab.attributes.index);

    if (!newArrangement.every((i, j) => i === oldArrangement[j])) {
      tabs.forEach((tab, i) =>
        updateBlockAttributes(tab.clientId, {
          index: i,
          isActive: attributes.activeTab === i,
        })
      );
      this.setState({ oldArrangement: newArrangement });
    }

    if (selectedBlock && selectedBlock.clientId !== this.props.block.clientId) {
      if (
        tabs.filter((innerblock) => innerblock.attributes.isActive).length === 0
      ) {
        showControls("tab-title", tabs.length - 1);
      }
      if (
        tabs.filter((tab) => tab.clientId === selectedBlock.clientId).length >
          0 &&
        !selectedBlock.attributes.isActive
      ) {
        selectBlock(this.props.block.clientId);
      }
    }

    if (blockID === "") {
      setAttributes({ blockID: this.props.block.clientId });
    }
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

    const tabContentsStyles = generateStyles({
      borderTopLeftRadius: attributes.tabContentsBorderRadius?.topLeft,
      borderTopRightRadius: attributes.tabContentsBorderRadius?.topRight,
      borderBottomLeftRadius: attributes.tabContentsBorderRadius?.bottomLeft,
      borderBottomRightRadius: attributes.tabContentsBorderRadius?.bottomRight,
      "--ub-tab-content-color": contentColor,
      "--ub-tab-content-background": contentBackground,
    });
    return [
      isSelected && (
        <BlockControls>
          <BlockControls group="block">
            <BlockAlignmentControl
              value={align}
              controls={["wide", "full"]}
              onChange={(value) => setAttributes({ align: value })}
            />
          </BlockControls>
          <ToolbarGroup>
            {["left", "center", "right"].map((a) => (
              <ToolbarButton
                icon={`editor-align${a}`}
                label={__(`Align Tab Title ${a[0].toUpperCase() + a.slice(1)}`)}
                isActive={tabsTitleAlignment[activeTab] === a}
                onClick={() =>
                  setAttributes({
                    tabsTitleAlignment: [
                      ...tabsTitleAlignment.slice(0, activeTab),
                      a,
                      ...tabsTitleAlignment.slice(activeTab + 1),
                    ],
                  })
                }
              />
            ))}
          </ToolbarGroup>
          <ToolbarGroup>
            {["left", "center", "right"].map((a) => (
              <ToolbarButton
                icon={`align-${a}`}
                label={__(`Align Tabs ${a[0].toUpperCase() + a.slice(1)}`)}
                onClick={() => setAttributes({ tabsAlignment: a })}
              />
            ))}
          </ToolbarGroup>
        </BlockControls>
      ),
      isSelected && (
        <Inspector
          {...{ attributes, setAttributes }}
          showIconControls={this.state.showIconControls}
          showImageControls={this.state.showImageControls}
        />
      ),
      <div
        className={`${className}${tabStyle === "tabs" ? "" : `-${tabStyle}`}`}
        style={generateStyles(styles)}
      >
        <div
          className={`${className}-holder ${
            attributes.tabVertical ? "vertical-holder" : ""
          }`}
        >
          <div
            className={`${className}-tab-holder ${
              attributes.tabVertical ? "vertical-tab-width" : ""
            }`}
            data-title-sub-text-status={tabsSubTitleEnabled}
          >
            <block.SortableList
              axis={attributes.tabVertical ? "y" : "x"}
              propz={this.props}
              items={attributes.tabsTitle}
              onSortEnd={({ oldIndex, newIndex }) => {
                const titleItems = attributes.tabsTitle.slice(0);
                const alignments = attributes.tabsTitleAlignment.slice(0);
                setAttributes({
                  tabsTitle: arrayMove(titleItems, oldIndex, newIndex),
                  tabsTitleAlignment: arrayMove(alignments, oldIndex, newIndex),
                  activeTab: newIndex,
                });

                moveBlockToPosition(
                  tabs.filter((tab) => tab.attributes.index === oldIndex)[0]
                    .clientId,
                  this.props.block.clientId,
                  this.props.block.clientId,
                  newIndex
                );

                setAttributes({
                  activeControl: `tab-title-${newIndex}`,
                  activeTab: newIndex,
                });

                tabs.forEach((tab, i) => {
                  updateBlockAttributes(tab.clientId, {
                    isActive: oldIndex === i,
                  });
                });
                const { tabsSubTitle, tabIcons, tabCallToAction } = attributes;

                const tabsSubTitleToUse = IndexDataRegistry.moveData(
                  oldIndex,
                  newIndex,
                  tabsSubTitle
                );

                const tabsIconsToUse = IndexDataRegistry.moveData(
                  oldIndex,
                  newIndex,
                  tabIcons
                );

                const cTAToUse = IndexDataRegistry.moveData(
                  oldIndex,
                  newIndex,
                  tabCallToAction,
                  null
                );

                setAttributes({
                  tabsSubTitle: tabsSubTitleToUse,
                  tabIcons: tabsIconsToUse,
                  tabCallToAction: cTAToUse,
                });
              }}
              onRemoveTitle={(i) => {
                setAttributes({
                  tabsTitle: [
                    ...tabsTitle.slice(0, i),
                    ...tabsTitle.slice(i + 1),
                  ],
                  tabsTitleAlignment: [
                    ...tabsTitleAlignment.slice(0, i),
                    ...tabsTitleAlignment.slice(i + 1),
                  ],
                  activeTab: 0,
                  tabsAnchor: useAnchors
                    ? [...tabsAnchor.slice(0, i), ...tabsAnchor.slice(i + 1)]
                    : [],
                });

                removeBlock(
                  tabs.filter((tab) => tab.attributes.index === i)[0].clientId
                );

                showControls("tab-title", 0);

                const { tabsSubTitle, tabIcons, tabCallToAction } = attributes;

                const tabIconsUse = IndexDataRegistry.removeData(i, tabIcons);

                const tabsSubTitleToUse = IndexDataRegistry.removeData(
                  i,
                  tabsSubTitle
                );

                const cTAToUse = IndexDataRegistry.removeData(
                  i,
                  tabCallToAction,
                  null
                );

                setAttributes({
                  tabsSubTitle: tabsSubTitleToUse,
                  tabIcons: tabIconsUse,
                  tabCallToAction: cTAToUse,
                });
              }}
              onAddTab={addTab}
              toggleTitle={showControls}
              useDragHandle={true}
              onChangeTitle={(content, i) => {
                setAttributes({
                  tabsTitle: [
                    ...attributes.tabsTitle.slice(0, i),
                    content,
                    ...attributes.tabsTitle.slice(i + 1),
                  ],
                });
              }}
              onChangeSubTitle={(val, tabIndex) => {
                const { tabsSubTitle } = attributes;

                const tabsSubTitleToUse = IndexDataRegistry.addToIndexData(
                  val,
                  tabIndex,
                  tabsSubTitle
                );

                setAttributes({
                  tabsSubTitle: tabsSubTitleToUse,
                });
              }}
            />
          </div>
          <div
            className={`${className}-tabs-content ${
              this.props.attributes.tabVertical ? "vertical-content-width" : ""
            }`}
            style={tabContentsStyles}
          >
            {this.isCTAEnabled() ? (
              <i className={"ub-pro-cta-editor-message"}>
                {__(
                  "Current tab is assigned as call-to-action, this message will not be visible on client side.",
                  "ultimate-blocks-pro"
                )}
              </i>
            ) : (
              <InnerBlocks
                templateLock={false}
                allowedBlocks={["ub/tab-block"]}
                template={[["ub/tab-block"]]}
              />
            )}
          </div>
        </div>
      </div>,
    ];
  }
}
