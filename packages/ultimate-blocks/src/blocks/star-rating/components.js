import { Star } from "./icons";

import {
	CustomFontSizePicker,
	CustomToggleGroupControl,
	SpacingControl,
} from "../components";
import { __ } from "@wordpress/i18n";
import {
	InspectorControls,
	RichText,
	BlockControls,
	ColorPalette,
} from "@wordpress/block-editor";
import {
	PanelBody,
	RangeControl,
	ToolbarGroup,
	ToolbarButton,
	ToggleControl,
} from "@wordpress/components";
import { generateStyles } from "../utils/styling-helpers";

export const blockControls = (props) => {
	const { attributes, setAttributes } = props;

	const { reviewTextAlign, starAlign, textPosition } = attributes;
	return (
		<BlockControls>
			<ToolbarGroup>
				{["left", "center", "right"].map((a) => (
					<ToolbarButton
						icon={`align-${a}`}
						isActive={starAlign === a}
						label={__(`Align stars ${a}`)}
						onClick={() => setAttributes({ starAlign: a })}
					/>
				))}
			</ToolbarGroup>
			{(textPosition === "top" || textPosition === "bottom") && (
				<ToolbarGroup>
					{["left", "center", "right", "justify"].map((a) => (
						<ToolbarButton
							icon={`editor-${a === "justify" ? a : "align" + a}`}
							label={__(
								(a !== "justify" ? "Align " : "") +
									a[0].toUpperCase() +
									a.slice(1),
							)}
							isActive={reviewTextAlign === a}
							onClick={() => setAttributes({ reviewTextAlign: a })}
						/>
					))}
				</ToolbarGroup>
			)}
		</BlockControls>
	);
};

export const inspectorControls = (props) => {
	const { attributes, setAttributes } = props;

	const {
		starCount,
		starSize,
		starColor,
		selectedStars,
		reviewTextColor,
		isShowReviewText,
	} = attributes;
	return (
		<>
			<InspectorControls group="settings">
				<PanelBody title={__("General")} initialOpen={true}>
					<CustomToggleGroupControl
						label={__("Text Position", "ultimate-blocks")}
						attributeKey="textPosition"
						isBlock
						options={[
							{ label: __("Top", "ultimate-blocks"), value: "top" },
							{ label: __("Right", "ultimate-blocks"), value: "right" },
							{ label: __("Bottom", "ultimate-blocks"), value: "bottom" },
							{ label: __("Left", "ultimate-blocks"), value: "left" },
						]}
					/>
					<RangeControl
						label={__("Number of stars")}
						value={starCount}
						onChange={(value) =>
							setAttributes({
								starCount: value,
								selectedStars: value < selectedStars ? value : selectedStars,
							})
						}
						min={5}
						max={10}
						beforeIcon="star-empty"
					/>
					<RangeControl
						label={__("Star value")}
						value={selectedStars}
						onChange={(selectedStars) => setAttributes({ selectedStars })}
						min={0.1}
						max={starCount}
						step={0.1}
						beforeIcon="star-half"
					/>
					<ToggleControl
						label={__("Show Review Text", "ultimate-blocks")}
						checked={isShowReviewText}
						onChange={() =>
							setAttributes({ isShowReviewText: !isShowReviewText })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="typography">
				<CustomFontSizePicker
					attrKey="textFontSize"
					label={__("Text Font Size", "ultimate-blocks")}
				/>
			</InspectorControls>
			<InspectorControls group="styles">
				<PanelBody title={__("General")} initialOpen={true}>
					<RangeControl
						label={__("Star size")}
						value={starSize}
						onChange={(value) => setAttributes({ starSize: value })}
						min={10}
						max={30}
						beforeIcon="editor-contract"
						afterIcon="editor-expand"
					/>
				</PanelBody>
				<PanelBody title={__("Colors")}>
					<p>
						{__("Star Color")}
						<span
							class="component-color-indicator"
							aria-label={`(Color: ${starColor})`}
							style={{ background: starColor }}
						/>
					</p>
					<ColorPalette
						value={starColor}
						onChange={(colorValue) => setAttributes({ starColor: colorValue })}
					/>
					<p>
						{__("Text Color")}
						{reviewTextColor && (
							<span
								class="component-color-indicator"
								aria-label={`(Color: ${reviewTextColor})`}
								style={{ background: reviewTextColor }}
							/>
						)}
					</p>
					<ColorPalette
						value={reviewTextColor}
						onChange={(reviewTextColor) => setAttributes({ reviewTextColor })}
					/>
				</PanelBody>
				<PanelBody
					title={__("Dimension Settings", "ultimate-blocks")}
					initialOpen={false}
				>
					<SpacingControl
						showByDefault
						attrKey="padding"
						label={__("Padding", "ultimate-blocks")}
					/>
					<SpacingControl
						minimumCustomValue={-Infinity}
						showByDefault
						attrKey="margin"
						label={__("Margin", "ultimate-blocks")}
					/>
					<SpacingControl
						showByDefault
						sides={["all"]}
						attrKey="gap"
						label={__("Gap", "ultimate-blocks")}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export const editorDisplay = (props) => {
	const { setAttributes, setHighlightedStars, highlightedStars } = props;

	const {
		blockID,
		starCount,
		starSize,
		starColor,
		selectedStars,
		reviewText,
		reviewTextColor,
		reviewTextAlign,
		starAlign,
		isShowReviewText,
		textFontSize,
	} = props.attributes;
	const reviewTextStyles = {
		textAlign: reviewTextAlign,
		color: reviewTextColor || "inherit",
		fontSize: textFontSize,
	};
	return (
		<>
			<div
				className="ub-star-outer-container"
				style={{
					justifyContent:
						starAlign === "center"
							? "center"
							: `flex-${starAlign === "left" ? "start" : "end"}`,
				}}
			>
				<div
					className="ub-star-inner-container"
					onMouseLeave={() => setHighlightedStars(0)}
				>
					{[...Array(starCount)].map((e, i) => (
						<div
							key={i}
							onMouseEnter={() => setHighlightedStars(i + 1)}
							onClick={() => {
								if (selectedStars % 1 === 0) {
									setAttributes({
										selectedStars: i + (selectedStars - 1 === i ? 0.5 : 1),
									});
								} else {
									setAttributes({
										selectedStars: i + (selectedStars - 0.5 === i ? 1 : 0.5),
									});
								}
							}}
						>
							<Star
								id={blockID}
								index={i}
								size={starSize}
								value={
									(highlightedStars -
										(highlightedStars === selectedStars ? 0.5 : 0) ||
										selectedStars) - i
								}
								displayColor={starColor}
							/>
						</div>
					))}
				</div>
			</div>
			{isShowReviewText && (
				<RichText
					tagName="div"
					className="ub-review-text"
					placeholder={__("The text of the review goes here")}
					value={reviewText}
					style={generateStyles(reviewTextStyles)}
					onChange={(text) => setAttributes({ reviewText: text })}
					keepPlaceholderOnFocus={true}
					allowedFormats={[
						"core/bold",
						"core/italic",
						"core/strikethrough",
						"core/link",
					]}
				/>
			)}
		</>
	);
};
