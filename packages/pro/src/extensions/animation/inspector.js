/**
 * WordPress dependencies.
 */
import { __ } from "@wordpress/i18n";
import { startCase, isEmpty } from "lodash";

import { CustomToggleGroupControl } from "../../components/StylingControls";
import { useState } from "@wordpress/element";
import { InspectorControls } from "@wordpress/block-editor";
import {
  Button,
  Dropdown,
  Icon,
  MenuGroup,
  MenuItem,
  PanelBody,
  TextControl,
  RangeControl,
} from "@wordpress/components";

/**
 * Internal dependencies.
 */
import { animationsList, categories, repeatOptions } from "./constants";
import { panelIcon } from "./icon";

function Inspector(props) {
  const { attributes, setAttributes } = props;
  const [currentInput, setCurrentInput] = useState("");
  const [animationFound, setAnimationFound] = useState(false);

  const getAnimations = (animation, onToggle) => {
    let match = true;

    if (currentInput) {
      const inputWords = currentInput.toLowerCase().split(" ");
      inputWords.forEach((word) => {
        if (!animation.label.toLowerCase().includes(word)) {
          match = false;
        }
      });
    }

    if (match && !animationFound) {
      setAnimationFound(true);
    }

    return (
      match && (
        <MenuItem
          className={
            attributes.selectedAnimation === animation.value
              ? "is-selected"
              : ""
          }
          onClick={() => {
            setAttributes({ selectedAnimation: animation.value });
            onToggle();
          }}
        >
          {startCase(animation.label)}
        </MenuItem>
      )
    );
  };
  const onPreviewAnimation = () => {
    const selectedBlock = document.getElementById(`block-${props.clientId}`);
    selectedBlock.classList.remove(attributes.selectedAnimation);
    setTimeout(() => {
      selectedBlock.classList.add(attributes.selectedAnimation);
    }, 100);
  };
  return (
    <InspectorControls>
      <PanelBody
        icon={panelIcon}
        title={__("Animation", "ultimate-blocks")}
        initialOpen={false}
      >
        <Dropdown
          className="ub-animations-control__popover"
          contentClassName="ub-animations-content"
          position="bottom center"
          renderToggle={({ isOpen, onToggle }) => (
            <Button
              className="ub-animations-control__button"
              onClick={onToggle}
              __next40pxDefaultSize
              icon={<Icon icon={"arrow-down-alt2"} />}
              iconPosition="right"
              iconSize={15}
              aria-expanded={isOpen}
            >
              {startCase(attributes.selectedAnimation)}
            </Button>
          )}
          renderContent={({ onToggle }) => (
            <MenuGroup label={__("Animations", "ultimate-blocks")}>
              <TextControl
                __next40pxDefaultSize
                placeholder={__("Search", "ultimate-blocks")}
                value={currentInput}
                onChange={(e) => {
                  setCurrentInput(e);
                  setAnimationFound(false);
                }}
              />

              <div className="components-popover__items">
                {animationsList.map((animation) => {
                  return (
                    <>
                      {"" === currentInput &&
                        categories.map((category) => {
                          return !isEmpty(animation.category) &&
                            category.value === animation.category ? (
                            <div className="ub-animations-control__category">
                              {startCase(animation.label)}
                            </div>
                          ) : (
                            ""
                          );
                        })}

                      {getAnimations(animation, onToggle)}
                    </>
                  );
                })}

                {!animationFound && (
                  <div>
                    {__(
                      "Nothing found. Try searching for something else!",
                      "ultimate-blocks"
                    )}
                  </div>
                )}
              </div>
            </MenuGroup>
          )}
        />
        <br></br>
        {attributes.selectedAnimation !== "none" && (
          <>
            <CustomToggleGroupControl
              isBlock
              options={repeatOptions}
              attributeKey="animationRepeat"
              label={__("Repeat", "ultimate-blocks-pro")}
            />
            {attributes.animationRepeat === "repeat" && (
              <RangeControl
                min={1}
                allowReset
                resetFallbackValue={1}
                label={__("Repeat Count", "ultimate-blocks-pro")}
                __next40pxDefaultSize
                value={attributes.animationRepeatCount}
                onChange={(newCount) =>
                  setAttributes({ animationRepeatCount: newCount })
                }
              />
            )}
            <RangeControl
              min={0.1}
              allowReset
              resetFallbackValue={1}
              step={0.1}
              label={__("Duration (Seconds)", "ultimate-blocks-pro")}
              __next40pxDefaultSize
              value={attributes.animationDuration}
              onChange={(newCount) =>
                setAttributes({ animationDuration: newCount })
              }
            />
            <RangeControl
              step={0.1}
              allowReset
              resetFallbackValue={0}
              label={__("Delay (Seconds)", "ultimate-blocks-pro")}
              __next40pxDefaultSize
              value={attributes.animationDelay}
              onChange={(newCount) =>
                setAttributes({ animationDelay: newCount })
              }
            />
            <Button
              variant="secondary"
              __next40pxDefaultSize
              style={{ width: "100%", justifyContent: "center" }}
              onClick={onPreviewAnimation}
            >
              {__("Preview Animation", "ultimate-blocks")}
            </Button>
          </>
        )}
      </PanelBody>
    </InspectorControls>
  );
}

export default Inspector;
