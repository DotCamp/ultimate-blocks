import { __ } from "@wordpress/i18n";
import { isEmpty } from "lodash";
import {
  InnerBlocks,
  useBlockProps,
  useInnerBlocksProps,
  BlockControls,
} from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";
import classNames from "classnames";
import Inspector from "./inspector";
import { getStyles } from "./get-styles";
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { useRef, useEffect } from "@wordpress/element";

const ALLOWED_BLOCKS = ["ub/timeline-item"];
function Edit(props) {
  const swiperRef = useRef(null);
  const initializedSwiperRef = useRef(null);
  const { attributes } = props;
  const {
    timelineAlignment,
    timelineItemStartsFrom,
    numberedConnector,
    showConnectors,
    showTimelineProgress,
    connectorPosition,
    showOppositeText,
    timelineType,
    itemsPerView,
    enableDragging,
    showArrow,
  } = attributes;
  const { getBlock } = useSelect((select) => {
    return {
      getBlock: select("core/block-editor").getBlock,
    };
  });
  const { insertBlock } = useDispatch("core/block-editor");
  const blockProps = useBlockProps({
    className: classNames("ub-timeline-wrapper ub-timeline-editor", {
      [`ub-timeline-items-align-${timelineAlignment}`]:
        !isEmpty(timelineAlignment),
      [`ub-timeline-items-starts-from-${timelineItemStartsFrom}`]: !isEmpty(
        timelineItemStartsFrom
      ),
      [`ub-timeline-items-numbered-connectors`]: numberedConnector,
      [`ub-timeline-items-show-connectors`]: showConnectors,
      [`ub-timeline-items-connector-position-${connectorPosition}`]:
        !isEmpty(connectorPosition),
      [`ub-timeline-show-progress`]: showTimelineProgress,
      [`ub-timeline-show-opposite-text`]: showOppositeText,
      ["ub-timeline-vertical"]: timelineType === "vertical",
      ["ub-timeline-horizontal"]: timelineType === "horizontal",
      ["swiper"]: timelineType === "horizontal",
    }),
    style: getStyles(attributes),
  });
  const template = [
    ["ub/timeline-item"],
    ["ub/timeline-item"],
    ["ub/timeline-item"],
  ];
  const { hasInnerBlocks } = useSelect((select) => {
    const { getBlock } = select("core/block-editor");
    const block = getBlock(props.clientId);
    return {
      hasInnerBlocks: !!(block && block.innerBlocks.length),
    };
  });
  const { children, ...innerBlocksProps } = useInnerBlocksProps(blockProps, {
    template,
    renderAppender:
      timelineType === "vertical"
        ? hasInnerBlocks
          ? undefined
          : InnerBlocks.ButtonBlockAppender
        : false,
    allowedBlocks: ALLOWED_BLOCKS,
  });
  const initializeSwiper = () => {
    const config = {
      slidesPerView: itemsPerView,
      spaceBetween: 20,

      allowTouchMove: enableDragging,
      observer: true,
    };
    if (showArrow) {
      config.navigation = {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      };
    }
    if (swiperRef.current) {
      const swiper = new Swiper(swiperRef.current, config);

      initializedSwiperRef.current = swiper;
    }
  };
  useEffect(() => {
    if (timelineType === "horizontal") {
      initializeSwiper();
    }
  }, []);
  useEffect(() => {
    if (timelineType === "horizontal") {
      if (initializedSwiperRef.current !== null) {
        initializedSwiperRef.current.destroy(true, false);
        initializedSwiperRef.current = null;
      }
      initializeSwiper();
    }
  }, [itemsPerView, timelineType, enableDragging, showArrow]);
  const onInsertBlock = () => {
    const createdBlock = createBlock("ub/timeline-item");
    const currentBlock = getBlock(props.clientId);
    const lastBlockPosition = currentBlock.innerBlocks.length;
    insertBlock(
      createdBlock,
      lastBlockPosition + 1,
      currentBlock.clientId,
      true
    );
    if (initializedSwiperRef.current) {
      initializedSwiperRef.current.update();
    }
  };

  return (
    <>
      <BlockControls group="other">
        <ToolbarGroup>
          <ToolbarButton onClick={onInsertBlock}>
            {__("Add Item", "ultimate-blocks-pro")}
          </ToolbarButton>
        </ToolbarGroup>
      </BlockControls>
      {timelineType === "horizontal" && (
        <div {...innerBlocksProps} ref={swiperRef}>
          <div className="ub-timeline-tree">
            {showTimelineProgress && (
              <div class="ub-timeline-tree-progress"></div>
            )}
          </div>
          <div class="swiper-wrapper">{children}</div>
          {showArrow && (
            <>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </>
          )}
        </div>
      )}
      {timelineType === "vertical" && (
        <div {...innerBlocksProps}>
          <div className="ub-timeline-tree">
            {showTimelineProgress && (
              <div class="ub-timeline-tree-progress"></div>
            )}
          </div>

          <InnerBlocks template={template} allowedBlocks={ALLOWED_BLOCKS} />
        </div>
      )}
      <Inspector {...props} />
    </>
  );
}
export default Edit;
