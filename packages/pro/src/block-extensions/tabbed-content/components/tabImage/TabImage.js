import { isEmpty, get } from "lodash";
/**
 * Tab title icon component.
 *
 * @param {Object}  props                    component properties
 * @param {string}  props.image              target icon name
 * @param {string}  props.tabImageWidth      icon tabImageWidth
 * @param {string}  props.tabImageHeight     icon tabImageHeight
 * @param {boolean} props.enabledStatus      enabled status
 * @param {boolean} props.imageIsSelected    icon is selected on editor
 * @function Object() { [native code] }
 */
function TabTitleImage({
  image,
  tabImageWidth,
  tabImageHeight,
  enabledStatus,
  imageIsSelected,
}) {
  const hasImage = !isEmpty(image) && !isEmpty(image.url);
  const imageURL = get(image, "url", "");
  return (
    enabledStatus && (
      <div
        style={{ width: tabImageWidth, height: tabImageHeight }}
        data-ub-image-selected={imageIsSelected}
        className={
          "ub-pro-tab-title-image ultimate-blocks-tabbed-image-component"
        }
      >
        {hasImage && (
          <figure>
            <img src={imageURL} />
          </figure>
        )}
      </div>
    )
  );
}

/**
 * @module TabTitleImage
 */
export default TabTitleImage;
