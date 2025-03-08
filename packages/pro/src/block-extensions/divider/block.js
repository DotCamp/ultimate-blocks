import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { dashesToCamelcase } from "../../global";
import { IconControl, IconSizePicker } from "@Library/ub-common/Components";
import { PanelColorSettings } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { PanelBody } from "@wordpress/components";
import {
  CustomToggleGroupControl,
  SpacingControl,
} from "../../components/StylingControls";
import { AVAILABLE_JUSTIFICATIONS } from "../../common";
import {
  generateStyles,
  getSpacingPresetCssVar,
} from "../../utils/styling-helpers";

const allIcons = Object.assign(fas, fab);

function NewDividerBlock(props) {
  const {
    attributes: {
      borderColor,
      borderHeight,
      icon,
      iconBackgroundColor,
      iconSize,
      iconAlignment,
      orientation,
    },
    setAttributes,
    BlockEdit,
  } = props;

  const iconSpacing =
    getSpacingPresetCssVar(props.attributes.iconSpacing?.all) ?? "";

  const horizontalSpacing =
    orientation === "horizontal"
      ? {
          marginTop: borderHeight + "px",
          marginBottom: borderHeight + "px",
        }
      : {};

  const iconStyles = {
    backgroundColor: iconBackgroundColor,
    ...(orientation === "horizontal"
      ? {
          paddingLeft: iconSpacing,
          paddingRight: iconSpacing,
        }
      : { paddingTop: iconSpacing, paddingBottom: iconSpacing }),
    ...horizontalSpacing,
  };
  const iconControls = (
    <PanelBody title={__("Icon", "ultimate-blocks-pro")} initialOpen={false}>
      <IconControl
        label={__("Icon", "ultimate-blocks-pro")}
        selectedIcon={icon}
        onIconSelect={(val) => setAttributes({ icon: val })}
      />
      {icon && (
        <>
          <div className="ub-divider-icon-alignment-vertical">
            <CustomToggleGroupControl
              isAdaptiveWidth
              options={AVAILABLE_JUSTIFICATIONS.slice(
                0,
                AVAILABLE_JUSTIFICATIONS.length - 1
              )}
              attributeKey="iconAlignment"
              label={__("Alignment", "ultimate-blocks-pro")}
            />
          </div>
          <IconSizePicker
            size={iconSize}
            sizeChangeCallback={(val) => setAttributes({ iconSize: val })}
          />
        </>
      )}
    </PanelBody>
  );
  const iconColorControl = (
    <PanelColorSettings
      title={__("Icon", "ultimate-blocks-pro")}
      initialOpen={true}
      colorSettings={[
        {
          value: iconBackgroundColor,
          onChange: (colorVal) =>
            setAttributes({
              iconBackgroundColor: colorVal,
            }),
          label: __("Background", "ultimate-blocks-pro"),
        },
      ]}
    />
  );
  const iconSpacingControl = (
    <SpacingControl
      sides={["all"]}
      showByDefault
      attrKey="iconSpacing"
      label={__("Icon Space", "ultimate-blocks-pro")}
    />
  );
  const iconElement = icon && (
    <div
      data-icon-alignment={iconAlignment}
      className="ub_divider_icon"
      style={generateStyles(iconStyles)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={iconSize}
        width={iconSize}
        viewBox={`0, 0, ${
          allIcons[`fa${dashesToCamelcase(icon)}`].icon[0]
        },  ${allIcons[`fa${dashesToCamelcase(icon)}`].icon[1]}`}
      >
        <path
          fill={borderColor}
          d={allIcons[`fa${dashesToCamelcase(icon)}`].icon[4]}
        />
      </svg>
    </div>
  );

  const proProps = {
    iconControls,
    iconColorControl,
    iconSpacingControl,
    iconElement,
  };
  return (
    <>
      <BlockEdit {...props} {...proProps} />
    </>
  );
}

/**
 * @module NewDividerBlock
 */
export default NewDividerBlock;
