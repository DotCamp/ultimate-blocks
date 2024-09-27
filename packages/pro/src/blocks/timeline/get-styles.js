/**
 * WordPress Dependencies
 */
import { isUndefined, trim, isEmpty, omitBy, isNumber } from "lodash";
import {
  getBorderVariablesCss,
  getSpacingCss,
} from "../../utils/styling-helpers";
/**
 *
 * @param {Array} attributes
 *
 * @return {object} - Block styles
 */

export function getStyles(attributes) {
  const timelineContentBorder = getBorderVariablesCss(
    attributes.contentBorder,
    "timeline-items-content"
  );
  const paddingObj = getSpacingCss(attributes.contentPadding);
  const connectorSize = attributes?.connectorSize?.toString() + "px";
  const connectorIconSize = attributes?.connectorIconSize?.toString() + "px";

  const borderRadius = {
    "--ub-timeline-items-content-top-left-radius":
      attributes.contentBorderRadius?.topLeft,
    "--ub-timeline-items-content-top-right-radius":
      attributes.contentBorderRadius?.topRight,
    "--ub-timeline-items-content-bottom-left-radius":
      attributes.contentBorderRadius?.bottomLeft,
    "--ub-timeline-items-content-bottom-right-radius":
      attributes.contentBorderRadius?.bottomRight,
  };

  let styles = {
    "--ub-timeline-items-content-background-color": !isEmpty(
      attributes?.contentBackground
    )
      ? attributes.contentBackground
      : attributes?.contentGradient,
    "--ub-timeline-items-content-color": attributes?.contentColor,
    "--ub-timeline-connector-color": attributes?.connectorColor,
    "--ub-timeline-connector-background-color": attributes?.connectorBackground,
    "--ub-timeline-tree-color": attributes?.lineColor,
    "--ub-timeline-items-content-padding-top": paddingObj?.top,
    "--ub-timeline-items-content-padding-right": paddingObj?.right,
    "--ub-timeline-items-content-padding-bottom": paddingObj?.bottom,
    "--ub-timeline-items-content-padding-left": paddingObj?.left,
    "--ub-timeline-items-connector-size": connectorSize,
    "--ub-timeline-items-connector-icon-color": attributes.connectorIconColor,
    "--ub-timeline-items-connector-icon-size": connectorIconSize,
    "--ub-timeline-progress-line-color": attributes.progressLineColor,
    "--ub-timeline-opposite-text-color": attributes.oppositeTextColor,
    ...timelineContentBorder,
    ...borderRadius,
    "--swiper-navigation-sides-offset": "-3px",
    "--swiper-navigation-top-offset": "40px",
    "--swiper-navigation-color": attributes.arrowColor,
  };

  return omitBy(styles, (value) => {
    return (
      isUndefined(value) ||
      value === false ||
      trim(value) === "" ||
      trim(value) === "undefined undefined undefined" ||
      isEmpty(value)
    );
  });
}
