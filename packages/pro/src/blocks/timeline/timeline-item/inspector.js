/**
 * Wordpress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
/**
 * Internal Imports
 */
import {
  ColorSettings,
  ColorSettingsWithGradient,
  BorderControl,
  SpacingControlWithToolsPanel,
} from "../../../components/StylingControls";

function Inspector(props) {
  return (
    <>
      <InspectorControls group="color">
        <ColorSettings
          attrKey="contentColor"
          label={__("Content Color", "ultimate-blocks-pro")}
        />
        <ColorSettingsWithGradient
          attrBackgroundKey="contentBackground"
          attrGradientKey="contentGradient"
          label={__("Content Background", "ultimate-blocks-pro")}
        />
      </InspectorControls>
      <InspectorControls group="border">
        <BorderControl
          showDefaultBorder
          showDefaultBorderRadius
          attrBorderKey="contentBorder"
          attrBorderRadiusKey="contentBorderRadius"
          borderLabel={__("Content Border", "ultimate-blocks-pro")}
          borderRadiusLabel={__("Content Border Radius", "ultimate-blocks-pro")}
        />
      </InspectorControls>
      <InspectorControls group="dimensions">
        <SpacingControlWithToolsPanel
          showByDefault
          attrKey="contentPadding"
          label={__("Content Padding", "ultimate-blocks-pro")}
        />
      </InspectorControls>
    </>
  );
}
export default Inspector;
