import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import classNames from "classnames";
import { getStyles } from "./get-styles";
import Inspector from "./inspector";
import SVGComponent from "../get-icon";
import { useEffect } from "@wordpress/element";
import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";

function Edit(props) {
  const { attributes, setAttributes, context } = props;
  const { oppositeText } = attributes;
  const { showOppositeText, iconConnector, icon } = context;
  const { parentBlock } = useSelect((select) => {
    const { getBlock, getBlockRootClientId } = select("core/block-editor");
    const parentBlockID = getBlockRootClientId(props.clientId);
    const parentBlock = getBlock(parentBlockID);

    return { parentBlock };
  });
  const parentAttributes = parentBlock?.attributes;
  const timelineType = parentAttributes.timelineType;
  const blockProps = useBlockProps({
    className: classNames("ub-timeline-item", {
      ["swiper-slide"]: timelineType === "horizontal",
    }),
    style: getStyles(props.attributes),
  });
  useEffect(() => {
    if (!isEmpty(timelineType)) {
      setAttributes({ timelineType });
    }
  }, [timelineType]);
  const template = [
    ["core/heading", { content: "Title", textAlign: "center" }],
    [
      "core/paragraph",
      {
        content:
          "Vestibulum facilisis, purus nec pulvinar iaculis, ligula mi congue nunc, vitae euismod ligula urna in dolor.",
        align: "center",
      },
    ],
  ];

  const hasIcon = !isEmpty(icon);
  return (
    <>
      {timelineType === "horizontal" && (
        <div {...blockProps}>
          <div className="timeline__content">
            <div className="ub-timeline-item-connector">
              {iconConnector && hasIcon && <SVGComponent icon={icon} />}
              {showOppositeText && (
                <RichText
                  tagName="p"
                  value={oppositeText}
                  className="ub-timeline-item-opposite-text"
                  placeholder={__("Text/Label", "ultimate-blocks-pro")}
                  onChange={(newValue) =>
                    setAttributes({ oppositeText: newValue })
                  }
                />
              )}
            </div>
            <div className="ub-timeline-item-content">
              <InnerBlocks template={template} />
            </div>
          </div>
          <Inspector {...props} />
        </div>
      )}
      {timelineType === "vertical" && (
        <>
          <div {...blockProps}>
            <div className="ub-timeline-item-connector">
              {iconConnector && hasIcon && <SVGComponent icon={icon} />}
              {showOppositeText && (
                <RichText
                  tagName="p"
                  value={oppositeText}
                  className="ub-timeline-item-opposite-text"
                  placeholder={__("Text/Label", "ultimate-blocks-pro")}
                  onChange={(newValue) =>
                    setAttributes({ oppositeText: newValue })
                  }
                />
              )}
            </div>
            <div className="ub-timeline-item-content">
              <InnerBlocks template={template} />
            </div>
          </div>
          <Inspector {...props} />
        </>
      )}
    </>
  );
}
export default Edit;
