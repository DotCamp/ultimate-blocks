import { omitBy, isUndefined, trim, isEmpty } from "lodash";
import {
  getBorderVariablesCss,
  getSpacingCss,
} from "../../utils/styling-helpers";

export function getStyles(attributes) {
  const buttonBorderVariables = getBorderVariablesCss(
    attributes.expandButtonBorder,
    "expand-button"
  );
  const paddingObj = getSpacingCss(attributes.padding);
  const buttonPaddingObj = getSpacingCss(attributes.expandButtonPadding);
  const marginObj = getSpacingCss(attributes.margin);
  const buttonBorderRadius = {
    "--ub-expand-button-top-left-radius":
      attributes.expandButtonBorderRadius?.topLeft,
    "--ub-expand-button-top-right-radius":
      attributes.expandButtonBorderRadius?.topRight,
    "--ub-expand-button-bottom-left-radius":
      attributes.expandButtonBorderRadius?.bottomLeft,
    "--ub-expand-button-bottom-right-radius":
      attributes.expandButtonBorderRadius?.bottomRight,
  };
  let styles = {
    "--ub-expand-button-color": attributes.expandButtonColor,
    "--ub-expand-button-bg-color": !isEmpty(attributes?.expandButtonBgColor)
      ? attributes.expandButtonBgColor
      : attributes?.expandButtonBgGradient,
    "--ub-expand-button-padding-top": buttonPaddingObj?.top,
    "--ub-expand-button-padding-right": buttonPaddingObj?.right,
    "--ub-expand-button-padding-bottom": buttonPaddingObj?.bottom,
    "--ub-expand-button-padding-left": buttonPaddingObj?.left,
    paddingTop: paddingObj?.top,
    paddingRight: paddingObj?.right,
    paddingBottom: paddingObj?.bottom,
    paddingLeft: paddingObj?.left,
    marginTop: marginObj?.top,
    marginRight: marginObj?.right,
    marginBottom: marginObj?.bottom,
    marginLeft: marginObj?.left,
    ...buttonBorderRadius,
    ...buttonBorderVariables,
  };

  return omitBy(
    styles,
    (value) =>
      value === false ||
      isEmpty(value) ||
      isUndefined(value) ||
      trim(value) === "" ||
      trim(value) === "undefined undefined undefined"
  );
}
