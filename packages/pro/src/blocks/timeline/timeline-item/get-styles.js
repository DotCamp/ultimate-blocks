/**
 * WordPress Dependencies
 */
import { isUndefined, trim, isEmpty, omitBy, isNumber } from "lodash";
import {
  getBorderVariablesCss,
  getSpacingCss,
} from "../../../utils/styling-helpers";
/**
 *
 * @param {Array} attributes
 *
 * @return {object} - Block styles
 */

export function getStyles(attributes) {
  const timelineContentBorder = getBorderVariablesCss(
    attributes.contentBorder,
    "timeline-item-content"
  );
  const paddingObj = getSpacingCss(attributes.contentPadding);

  const borderRadius = {
    "--ub-timeline-item-content-top-left-radius":
      attributes.contentBorderRadius?.topLeft,
    "--ub-timeline-item-content-top-right-radius":
      attributes.contentBorderRadius?.topRight,
    "--ub-timeline-item-content-bottom-left-radius":
      attributes.contentBorderRadius?.bottomLeft,
    "--ub-timeline-item-content-bottom-right-radius":
      attributes.contentBorderRadius?.bottomRight,
  };

  let styles = {
    "--ub-timeline-item-content-background-color": !isEmpty(
      attributes?.contentBackground
    )
      ? attributes.contentBackground
      : attributes?.contentGradient,
    "--ub-timeline-item-content-color": attributes?.contentColor,
    "--ub-timeline-item-content-padding-top": paddingObj?.top,
    "--ub-timeline-item-content-padding-right": paddingObj?.right,
    "--ub-timeline-item-content-padding-bottom": paddingObj?.bottom,
    "--ub-timeline-item-content-padding-left": paddingObj?.left,
    ...timelineContentBorder,
    ...borderRadius,
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
