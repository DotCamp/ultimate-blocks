import { __ } from "@wordpress/i18n";
import Inspector from "./inspector";
import { RichText } from "@wordpress/block-editor";
import IndexDataRegistry from "../inc/js/IndexDataRegistry";
import { useState } from "react";
import TabTitleImage from "./tabImage/TabImage";
import TabTitleIcon from "./tabIcon/TabTitleIcon";

export const TabHolder = (props) => {
  const [isIconSelected, setIsIconSelected] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const { attributes, setAttributes, BlockEdit } = props;
  const {
    tabIndex,
    tabCallToAction,
    activeTab,
    tabsSubTitle,
    tabsSubTitleEnabled,
    tabsIconStatus,
    tabIconSize,
    tabIcons,
    tabImages,
    tabImageWidth,
    tabImageHeight,
    tabsImageStatus,
  } = attributes;
  const proOnRemoveTitle = (i) => {
    const tabIconsUse = IndexDataRegistry.removeData(i, tabIcons);

    const tabsSubTitleToUse = IndexDataRegistry.removeData(i, tabsSubTitle);

    const cTAToUse = IndexDataRegistry.removeData(i, tabCallToAction, null);

    setAttributes({
      tabsSubTitle: tabsSubTitleToUse,
      tabIcons: tabIconsUse,
      tabCallToAction: cTAToUse,
    });
  };
  const proOnSortEnd = () => {
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
  };
  const checkIsIconSelected = (e) => {
    const iconElements = ["path", "svg"];
    const isIconTargeted =
      e.target.classList.contains("ultimate-blocks-icon-component") ||
      iconElements.includes(e.target.nodeName.toLowerCase());
    setIsIconSelected(isIconTargeted);
  };
  const checkIsImageSelected = (e) => {
    const imageElements = ["figure", "img"];
    const isImageTargeted =
      e.target.classList.contains("ultimate-blocks-tabbed-image-component") ||
      imageElements.includes(e.target.nodeName.toLowerCase());
    setIsImageSelected(isImageTargeted);
  };
  const CTATab = (
    <i className={"ub-pro-cta-editor-message"}>
      {__(
        "Current tab is assigned as call-to-action, this message will not be visible on client side.",
        "ultimate-blocks-pro"
      )}
    </i>
  );
  const TabsSubTitleElem = (i, onChangeSubTitle) => {
    return (
      <RichText
        tagName="div"
        className={"tab-sub-title"}
        value={tabsSubTitle[i]}
        allowedFormats={["core/bold", "core/italic"]}
        placeholder={__("sub text", "ultimate-blocks-pro")}
        onChange={(val) => onChangeSubTitle(val, tabIndex)}
      />
    );
  };
  const TabTitleImageElem = (props) => {
    const { i, attributes } = props;
    const {
      activeTab,
      tabIconSize,
      tabsImageStatus,
      tabImageWidth,
      tabImageHeight,
    } = attributes;
    return (
      <TabTitleImage
        imageIsSelected={activeTab === i && isImageSelected}
        image={tabImages[i] ?? {}}
        tabIconSize={tabIconSize}
        tabImageWidth={tabImageWidth}
        tabImageHeight={tabImageHeight}
        enabledStatus={tabsImageStatus}
      />
    );
  };

  const TabTitleIconElem = (props) => {
    const { i } = props;
    const { activeTab, tabIconSize, tabsIconStatus } = attributes;
    return (
      <TabTitleIcon
        iconIsSelected={activeTab === i && isIconSelected}
        iconName={tabIcons[i] ?? ""}
        size={tabIconSize}
        enabledStatus={tabsIconStatus}
      />
    );
  };
  const ProInspectorControls = (
    <Inspector
      {...{ attributes, setAttributes }}
      showIconControls={isIconSelected}
      showImageControls={isIconSelected}
    />
  );
  const propProps = {
    TabTitleImageElem,
    TabTitleIconElem,
    checkIsImageSelected,
    checkIsIconSelected,
    isImageSelected,
    isIconSelected,
    proOnSortEnd,
    proOnRemoveTitle,
    isCTAEnabled: typeof tabCallToAction[activeTab] === "string",
    CTATab,
    tabsSubTitleEnabled,
    TabsSubTitleElem,
    ProInspectorControls,
  };
  return <BlockEdit {...props} {...propProps} />;
};
