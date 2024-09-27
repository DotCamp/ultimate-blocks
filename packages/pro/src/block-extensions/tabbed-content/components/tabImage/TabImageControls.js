import IndexDataRegistry from "../../inc/js/IndexDataRegistry";

/**
 * Wordpress Dependencies
 */
import { __ } from "@wordpress/i18n";
import { isEmpty, get } from "lodash";
import { Button, PanelBody } from "@wordpress/components";
import {
  MediaUpload,
  MediaUploadCheck,
  HeightControl,
} from "@wordpress/block-editor";

/**
 * Tab image related inspector controls.
 *
 * @param {Object}        props                     component properties
 * @param {boolean}       props.tabsImageStatus     status of tab image functionality
 * @param {Function}      props.setAttributes       component attributes setter
 * @param {Array<string>} props.tabImages           tab images name array
 * @param {number}        props.activeTabIndex      active tab index
 * @param {string}        props.tabImageWidth       icon tabImageWidth
 * @param {string}        props.tabImageHeight      icon tabImageHeight
 * @function Object() { [native code] }
 */
function TabImageControls({
  activeTabIndex,
  tabsImageStatus,
  tabImages,
  tabImageWidth,
  tabImageHeight,
  setAttributes,
}) {
  /**
   * Set image value for active tab.
   *
   * @param {object} val image
   */
  const setTabImage = (val) => {
    const tabImagesToUse = IndexDataRegistry.addToIndexData(
      val,
      activeTabIndex,
      tabImages
    );

    setAttributes({
      tabImages: tabImagesToUse,
    });
  };

  const tabImage = tabImages[activeTabIndex];
  const hasImage = !isEmpty(tabImage) && !isEmpty(tabImage.url);
  const tabImageURL = get(tabImage, "url", "");
  const tabImageID = get(tabImage, "id", "");

  return (
    tabsImageStatus && (
      <PanelBody title={__("Tab Image", "ultimate-blocks-pro")}>
        {hasImage && (
          <figure>
            <img
              src={tabImageURL}
              alt={__("Tab image", "ultimate-blocks-pro")}
            />
          </figure>
        )}
        <MediaUploadCheck>
          <MediaUpload
            allowedTypes={["image"]}
            onSelect={(media) => {
              setTabImage(media);
            }}
            value={tabImageID}
            render={({ open }) => (
              <Button
                onClick={open}
                variant="secondary"
                style={{ margin: "5px 5px 5px 0" }}
              >
                {!hasImage
                  ? __("Set Tab Image", "ultimate-blocks-pro")
                  : __("Replace Tab Image", "ultimate-blocks-pro")}
              </Button>
            )}
          />
        </MediaUploadCheck>
        {hasImage && (
          <Button isDestructive variant="link" onClick={() => setTabImage({})}>
            {__("Remove Tab Image", "ultimate-blocks-pro")}
          </Button>
        )}
        <HeightControl
          label={__("Image Height", "ultimate-blocks-pro")}
          value={tabImageHeight}
          onChange={(newValue) => setAttributes({ tabImageHeight: newValue })}
        />
        <HeightControl
          label={__("Image Width", "ultimate-blocks-pro")}
          value={tabImageWidth}
          onChange={(newValue) => setAttributes({ tabImageWidth: newValue })}
        />
      </PanelBody>
    )
  );
}
export default TabImageControls;
