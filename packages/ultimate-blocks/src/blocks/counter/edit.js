import { __ } from "@wordpress/i18n";
import { isEmpty } from "lodash";
import {
	useBlockProps,
	BlockControls,
	AlignmentToolbar,
	RichText,
} from "@wordpress/block-editor";

import Inspector from "./inspector";

import { useCounter } from "./hooks/use-counter";
import {
	generateStyles,
	getSpacingCss,
	getSpacingPresetCssVar,
} from "../utils/styling-helpers";

function Edit(props) {
	const { attributes, setAttributes } = props;
	let counter = useCounter(attributes);
	const {
		endNumber,
		prefix,
		suffix,
		alignment,
		label,
		labelPosition,
		padding,
		margin,
	} = attributes;

	const paddingObj = getSpacingCss(padding);
	const marginObj = getSpacingCss(margin);
	const gap = getSpacingPresetCssVar(attributes.gap?.all) ?? "";
	const counterFontStyle = !isEmpty(attributes.counterFontAppearance.fontStyle)
		? attributes.counterFontAppearance.fontStyle
		: "";
	const counterFontWeight = !isEmpty(
		attributes.counterFontAppearance.fontWeight,
	)
		? attributes.counterFontAppearance.fontWeight
		: "";
	const labelFontStyle = !isEmpty(attributes.labelFontAppearance.fontStyle)
		? attributes.labelFontAppearance.fontStyle
		: "";
	const labelFontWeight = !isEmpty(attributes.labelFontAppearance.fontWeight)
		? attributes.labelFontAppearance.fontWeight
		: "";

	const counterWrapperStyles = {
		gap: gap,
	};
	const labelStyles = {
		color: attributes?.labelColor,
		fontSize: attributes?.labelFontSize,
		fontFamily: attributes.labelFontFamily,
		textDecoration: attributes.labelDecoration,
		lineHeight: attributes.labelLineHeight,
		letterSpacing: attributes.labelLetterSpacing,
		fontStyle: labelFontStyle,
		fontWeight: labelFontWeight,
	};
	const counterStyles = {
		fontSize: attributes?.counterFontSize,
		fontFamily: attributes.counterFontFamily,
		textDecoration: attributes.counterDecoration,
		lineHeight: attributes.counterLineHeight,
		"letter-spacing": attributes.counterLetterSpacing,
		fontStyle: counterFontStyle,
		fontWeight: counterFontWeight,
	};
	const containerStyles = {
		paddingTop: paddingObj?.top,
		paddingRight: paddingObj?.right,
		paddingBottom: paddingObj?.bottom,
		paddingLeft: paddingObj?.left,
		marginTop: marginObj?.top,
		marginRight: marginObj?.right,
		marginBottom: marginObj?.bottom,
		marginLeft: marginObj?.left,
	};

	const blockProps = useBlockProps({
		className: `ub_counter-container`,
		style: generateStyles(containerStyles),
	});

	return (
		<div {...blockProps}>
			<BlockControls>
				<AlignmentToolbar
					value={alignment}
					onChange={(newValue) => setAttributes({ alignment: newValue })}
				/>
			</BlockControls>
			<div
				className={`ub_counter ub_text-${alignment}`}
				style={generateStyles(counterWrapperStyles)}
			>
				{labelPosition === "top" && (
					<div
						className="ub_counter-label-wrapper"
						style={generateStyles(labelStyles)}
					>
						<RichText
							tagName="span"
							value={label}
							placeholder={__("Add a Label", "ultimate-blocks")}
							className="ub_counter-label"
							onChange={(newLabel) => setAttributes({ label: newLabel })}
						/>
					</div>
				)}
				<div
					className="ub_counter-number-wrapper"
					style={generateStyles(counterStyles)}
				>
					<span className="ub_counter-prefix">{prefix}</span>
					<span className="ub_counter-number">{counter}</span>
					<span className="ub_counter-suffix">{suffix}</span>
				</div>
				{labelPosition === "bottom" && (
					<div
						className="ub_counter-label-wrapper"
						style={generateStyles(labelStyles)}
					>
						<RichText
							tagName="span"
							value={label}
							placeholder={__("Add a Label", "ultimate-blocks")}
							className="ub_counter-label"
							onChange={(newLabel) => setAttributes({ label: newLabel })}
						/>
					</div>
				)}
			</div>
			<Inspector {...props} />
		</div>
	);
}

export default Edit;
