import SavedStylesInspectorPanel from "@Components/SavedStyles/SavedStylesInspectorPanel";

import { MediaUpload } from "@wordpress/block-editor";
import { PanelRow, Button, SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export const presetIconSize = { small: 25, medium: 30, large: 35, larger: 40 };
const defaultButtonProps = {
  buttonText: "Button Text",
  url: "",
  size: "medium",
  buttonColor: "#313131",
  buttonHoverColor: "#313131",
  buttonTextColor: "#ffffff",
  buttonTextHoverColor: "#ffffff",
  buttonRounded: true,
  buttonRadius: 10,
  buttonRadiusUnit: "px",
  borderRadius: {
    topLeft: "10px",
    topRight: "10px",
    bottomLeft: "10px",
    bottomRight: "10px",
  },
  topLeftRadius: 10,
  topLeftRadiusUnit: "px",
  topRightRadius: 10,
  topRightRadiusUnit: "px",
  bottomLeftRadius: 10,
  bottomLeftRadiusUnit: "px",
  bottomRightRadius: 10,
  bottomRightRadiusUnit: "px",
  iconType: "none",
  chosenIcon: "",
  imageID: 0,
  imageURL: "",
  imageAlt: "",
  iconPosition: "left",
  iconSize: 0,
  iconUnit: "px",
  buttonIsTransparent: false,
  addNofollow: true,
  openInNewTab: true,
  addSponsored: false,
  buttonWidth: "fixed",
  animation: "fade",
  wipeDirection: "right",
};

export function NewButtonBlock(props) {
  const { attributes, setAttributes, BlockEdit } = props;
  const { buttons, activeButtonIndex } = attributes;
  const proAnimationControl = buttons[activeButtonIndex]?.animation ===
    "wipe" && (
    <PanelRow>
      <p>{__("Wipe direction")}</p>
      <SelectControl
        className="ub-button-grid-selector"
        value={buttons[activeButtonIndex]?.wipeDirection}
        options={[
          {
            label: __("Up", "ultimate-blocks-pro"),
            value: "up",
          },
          {
            label: __("Down", "ultimate-blocks-pro"),
            value: "down",
          },
          {
            label: __("Left", "ultimate-blocks-pro"),
            value: "left",
          },
          {
            label: __("Right", "ultimate-blocks-pro"),
            value: "right",
          },
        ]}
        onChange={(wipeDirection) =>
          setAttributes({
            buttons: [
              ...buttons.slice(0, activeButtonIndex),
              Object.assign({}, buttons[activeButtonIndex], {
                wipeDirection,
              }),
              ...buttons.slice(activeButtonIndex + 1),
            ],
          })
        }
      />
    </PanelRow>
  );
  const proSaveStyledControl = (
    <SavedStylesInspectorPanel
      visibility={false}
      attributes={buttons[activeButtonIndex]}
      defaultAttributes={(() => {
        // eslint-disable-next-line no-unused-vars
        const { buttonText, url, ...rest } = defaultButtonProps;

        return rest;
      })()}
      attributesToSave={(() => {
        // eslint-disable-next-line no-unused-vars
        const { buttonText, url, ...rest } = defaultButtonProps;
        return Object.keys(rest).filter((key) => {
          return Object.prototype.hasOwnProperty.call(rest, key);
        });
      })()}
      setAttribute={(styleObject) => {
        setAttributes({
          buttons: [
            ...buttons.slice(0, activeButtonIndex),
            {
              ...buttons[activeButtonIndex],
              ...styleObject,
            },
            ...buttons.slice(activeButtonIndex + 1),
          ],
        });
      }}
      previewAttributeCallback={(attr, styleName) => {
        return {
          buttons: [{ ...attr, buttonText: styleName }],
        };
      }}
      previewElementCallback={(el) => {
        if (el && typeof el.querySelector === "function") {
          const plusButton = el.querySelector("button");

          const textEditor = el.querySelector('div[role="textbox"]');
          if (textEditor) {
            // disable in-place text editor
            textEditor.setAttribute("contenteditable", false);
          }

          el.removeChild(plusButton);
        }

        return el;
      }}
    />
  );
  const proIconType = (
    <SelectControl
      label={__("Icon Type", "ultimate-blocks-pro")}
      value={buttons[activeButtonIndex]?.iconType}
      options={["preset", "custom", "none"]?.map((o) => ({
        label: __(o),
        value: o,
      }))}
      onChange={(iconType) =>
        setAttributes({
          buttons: [
            ...buttons.slice(0, activeButtonIndex),
            Object.assign({}, buttons[activeButtonIndex], {
              iconType,
            }),
            ...buttons.slice(activeButtonIndex + 1),
          ],
        })
      }
    />
  );
  const proCustomImageControl = buttons[activeButtonIndex]?.iconType ===
    "custom" && (
    <>
      <MediaUpload
        onSelect={(img) => {
          setAttributes({
            buttons: [
              ...buttons.slice(0, activeButtonIndex),
              Object.assign({}, buttons[activeButtonIndex], {
                imageID: img.id,
                imageAlt: img.alt,
                imageURL: img.url,
              }),
              ...buttons.slice(activeButtonIndex + 1),
            ],
          });
        }}
        allowedTypes={["image"]}
        value={buttons[activeButtonIndex]?.imageID}
        render={({ open }) => (
          <Button isSecondary isSmall onClick={open}>
            {__(
              buttons[activeButtonIndex]?.imageID
                ? "Replace custom image"
                : "Upload custom image"
            )}
          </Button>
        )}
      />
      {buttons[activeButtonIndex]?.imageID > 0 && (
        <Button
          isSecondary
          isSmall
          onClick={() =>
            setAttributes({
              buttons: [
                ...buttons.slice(0, activeButtonIndex),
                Object.assign({}, buttons[activeButtonIndex], {
                  imageID: 0,
                  imageAlt: "",
                  imageURL: "",
                }),
                ...buttons.slice(activeButtonIndex + 1),
              ],
            })
          }
        >
          {__("Remove custom image")}
        </Button>
      )}
    </>
  );
  const proCustomImage = (b) => {
    return (
      b.iconType === "custom" &&
      b.imageID > 0 && (
        <img
          className="ub-button-image"
          src={b.imageURL}
          alt={b.imageAlt}
          style={{
            maxHeight: `${b.iconSize || presetIconSize[b.size]}${
              b.iconUnit || "px"
            }`,
          }}
        />
      )
    );
  };
  const proStyleTag = (
    <style
      dangerouslySetInnerHTML={{
        __html: buttons
          .map((b, i) =>
            b.animation === "wipe"
              ? `.ub-button-container:nth-child(${i + 1}) .ub-button-block-main{
										position: relative;
									}
									.ub-button-container:nth-child(${i + 1}) .ub-button-block-main:after{
										content: "";
										position: absolute;
										z-index: 5;
										background-color: ${b.buttonHoverColor};
										transition: all 0.5s;
								}
								.ub-button-container:nth-child(${i + 1}) .ub-button-content-holder{
								top: 0;
								z-index: 6;
							}
							`
              : ""
          )
          .join(""),
      }}
    />
  );
  const proPros = {
    proAnimationControl,
    proSaveStyledControl,
    proIconType,
    proCustomImageControl,
    proCustomImage,
    proStyleTag,
  };

  return (
    <>
      <BlockEdit {...props} {...proPros} />
    </>
  );
}
