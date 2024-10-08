import React from "react";
import { __ } from "@wordpress/i18n";
import { RichText } from "@wordpress/block-editor";
import TabTitleIcon from "./tabIcon/TabTitleIcon";
import TabTitleImage from "./tabImage/TabImage";
import { generateStyles } from "../../../utils/styling-helpers";

/**
 * Tab title component.
 *
 * @param {Object}                           props                     component properties
 * @param {string}                           props.titleMainText       main title text
 * @param {string}                           [props.titleSubText='']   sub title text
 * @param {number}                           props.tabIndex            tab index
 * @param {number}                           props.activeTabIndex      currently active tab index
 * @param {boolean}                          props.isTabVertical       whether tab container layout is vertical or not
 * @param {string}                           props.masterClassName     master class name to extend
 * @param {string}                           props.titleAlignment      title alignment
 * @param {string}                           props.tabStyle            tab main style type
 * @param {string}                           props.theme               theme
 * @param {string}                           props.normalBgColor       normal background color value
 * @param {string}                           props.textColor           title text color
 * @param {string}                           props.normalTextColor     normal text color value
 * @param {Function}                         props.toggleTitle         title toggle callback function
 * @param {string}                           props.activeControlName   active control class name
 * @param {boolean}                          props.isSelected          selection status of input element
 * @param {Function}                         props.onChangeTitle       title change event callback
 * @param {JSX.Element | Array<JSX.Element>} props.sortHandles         sort related components
 * @param {Function}                         props.onRemoveTitle       title remove callback function
 * @param {Function}                         props.onChangeSubTitle    sub title change callback
 * @param {boolean}                          props.tabsSubTitleEnabled status of sub title functionality
 * @param {boolean}                          props.tabsIconStatus      status of tab header icons
 * @param {boolean}                          props.tabsImageStatus     status of tab header images
 * @param {string}                           props.tabIconName         tab icon name
 * @param {string}                           props.tabImage         	 tab image
 * @param {number}                           props.tabIconSize         tab icon size
 * @param {string}                           props.tabImageWidth       tab image width
 * @param {string}                           props.tabImageHeight      tab image height
 * @param {Function}                         props.onClick             tab click callback
 * @param {Function}                         props.onClick             tab click callback
 * @param {boolean}                          props.iconIsSelected      icon is selected on editor
 * @param {boolean}                          props.imageIsSelected     image is selected on editor
 *
 * @function Object() { [native code] }
 */
function TabTitle({
  titleMainText,
  titleSubText = "",
  masterClassName,
  tabIndex,
  activeTabIndex,
  isTabVertical,
  titleAlignment,
  tabStyle,
  theme,
  normalBgColor,
  textColor,
  normalTextColor,
  toggleTitle,
  activeControlName,
  isSelected,
  onChangeTitle,
  onChangeSubTitle,
  sortHandles,
  onRemoveTitle,
  tabsSubTitleEnabled,
  tabsIconStatus,
  tabImage,
  tabIconName,
  tabIconSize,
  onClick,
  iconIsSelected,
  tabsImageStatus,
  imageIsSelected,
  tabImageWidth,
  tabImageHeight,
  borderRadius,
}) {
  /**
   * Active status of this tab title component.
   *
   * @return {boolean} active status
   */
  const isTabActive = () => {
    return activeTabIndex === tabIndex;
  };

  /**
   * Prefix given class with master class identifier.
   *
   * @param {string} rawClass raw class name
   *
   * @return {string} generated class name
   */
  const prefixWithMasterClass = (rawClass) => {
    return `${masterClassName}-${rawClass}`;
  };

  const prepareWrapperStyles = () => {
    return {
      textAlign: titleAlignment,
      backgroundColor:
        // eslint-disable-next-line no-nested-ternary
        tabStyle === "underline"
          ? "inherit"
          : isTabActive()
            ? theme
            : normalBgColor || "inherit",
      color: isTabActive()
        ? textColor || "inherit"
        : normalTextColor || "inherit",
      borderBottom:
        isTabActive() && tabStyle === "underline"
          ? `5px solid ${textColor || "inherit"}`
          : null,
      borderTopLeftRadius: borderRadius?.topLeft,
      borderTopRightRadius: borderRadius?.topRight,
      borderBottomLeftRadius: borderRadius?.bottomLeft,
      borderBottomRightRadius: borderRadius?.bottomRight,
    };
  };

  /**
   * Class name for component wrapper class.
   *
   * @return {string} class name
   */
  const componentWrapperClass = () => {
    return prefixWithMasterClass(
      `tab-title-${
        isTabVertical ? "vertical-" : ""
      }wrap ub-tabbed-content-with-sub-title SortableItem${
        isTabActive() ? " active" : ""
      }`
    );
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className={componentWrapperClass()}
      style={generateStyles(prepareWrapperStyles())}
      onClick={(e) => {
        toggleTitle("tab-title", tabIndex);
        onClick(e);
      }}
    >
      <TabTitleImage
        imageIsSelected={imageIsSelected}
        image={tabImage}
        tabImageWidth={tabImageWidth}
        tabImageHeight={tabImageHeight}
        enabledStatus={tabsImageStatus}
      />
      <TabTitleIcon
        iconIsSelected={iconIsSelected}
        iconName={tabIconName}
        size={tabIconSize}
        enabledStatus={tabsIconStatus}
      />
      <RichText
        tagName="div"
        className={prefixWithMasterClass("tab-title")}
        value={titleMainText}
        allowedFormats={["core/bold", "core/italic"]}
        isSelected={activeControlName === `tab-title-${tabIndex}` && isSelected}
        onChange={(content) => onChangeTitle(content, tabIndex)}
        placeholder={`Tab ${tabIndex + 1}`}
      />
      {tabsSubTitleEnabled && (
        <RichText
          tagName="div"
          className={"tab-sub-title"}
          value={titleSubText}
          allowedFormats={["core/bold", "core/italic"]}
          placeholder={__("sub text", "ultimate-blocks-pro")}
          onChange={(val) => onChangeSubTitle(val, tabIndex)}
        />
      )}
      <div
        className={`ub-tab-actions${
          titleMainText.length === 1 ? " ub-hide" : ""
        }`}
      >
        {sortHandles}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <span
          className={"dashicons dashicons-minus remove-tab-icon"}
          onClick={() => onRemoveTitle(tabIndex)}
        />
      </div>
    </div>
  );
}

/**
 * @module TabTitle
 */
export default TabTitle;
