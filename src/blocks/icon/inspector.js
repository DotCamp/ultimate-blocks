/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { PanelBody, RangeControl } from "@wordpress/components";
import { InspectorControls, HeightControl } from "@wordpress/block-editor";
/**
 * Custom Imports
 */
import ColorSettings from "./components/ColorSettings";

function CustomInspectorControls(props) {
	const {
		setAttributes,
		attributes: { size, iconRotation },
	} = props;
	return (
		<>
			<InspectorControls>
				<PanelBody>
					<HeightControl
						value={size}
						label={__("Icon Size", "ultimate-blocks")}
						onChange={(newSize) => setAttributes({ size: newSize })}
					/>
					<RangeControl
						max={180}
						min={-180}
						allowReset
						resetFallbackValue={0}
						value={iconRotation}
						defaultValue={0}
						label={__("Rotation", "ultimate-blocks")}
						onChange={(newSize) => setAttributes({ iconRotation: newSize })}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls group="color">
				<ColorSettings />
			</InspectorControls>
		</>
	);
}
export default CustomInspectorControls;