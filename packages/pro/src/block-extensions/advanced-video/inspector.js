import { isEmpty } from "lodash";
import { InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
function Inspector(props) {
  const {
    attributes: { showChannelDetails, videoEmbedCode, videoSource },
    setAttributes,
  } = props;

  return (
    <>
      <InspectorControls>
        {!isEmpty(videoEmbedCode) && videoSource === "youtube" && (
          <PanelBody title={__("Channel Settings", "ultimate-blocks-pro")}>
            <ToggleControl
              label={__("Show Subscribe Button", "ultimate-blocks-pro")}
              checked={showChannelDetails}
              onChange={() =>
                setAttributes({ showChannelDetails: !showChannelDetails })
              }
            />
          </PanelBody>
        )}
      </InspectorControls>
    </>
  );
}

export default Inspector;
