import { omitBy, isUndefined, trim, isEmpty, isNumber } from "lodash";
import { getSpacingCss } from "../utils/styling-helpers";

export function getStyles(attributes) {
	const {
		padding,
		alignment,
		textColor,
		backgroundColor,
		fontSize,
		textTransform,
		letterSpacing,
		fontFamily,
		fontWeight,
		lineHeight,
		margin,
	} = attributes;
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
		textAlign: alignment,
		color: textColor,
		backgroundColor,
		fontSize: fontSize ? `${fontSize}px` : null,
		letterSpacing: isNumber(letterSpacing) ? `${letterSpacing}px` : "",
		textTransform,
		fontFamily: fontFamily.includes(" ") ? `'${fontFamily}'` : fontFamily,
		fontWeight,
		lineHeight: lineHeight ? `${lineHeight}px` : null,
	};

	return omitBy(
		styles,
		(value) =>
			value === false ||
			isEmpty(value) ||
			isUndefined(value) ||
			trim(value) === "" ||
			trim(value) === "undefined undefined undefined",
	);
}
