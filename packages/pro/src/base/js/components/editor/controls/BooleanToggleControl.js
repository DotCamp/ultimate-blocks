import React from "react";
import { ToggleControl } from "@wordpress/components";

/**
 * Toggle control for boolean values.
 * This control will automatically assign the inverted boolean value to target attribute.
 *
 * @param {Object}        props                     component properties
 * @param {string}        props.label               control label
 * @param {boolean}       props.value               control value
 * @param {string}        props.attributeId         attribute id
 * @param {Function}      props.setAttributes       attribute update function
 * @param {boolean}       props.disabled       	  if true disabled the control.
 * @param {string | null} [props.help=null]         information for control
 * @param {Function}      props.extraChangeCallback callback to call as extra on change
 * @function Object() { [native code] }
 */
function BooleanToggleControl({
  label,
  value,
  attributeId,
  setAttributes,
  disabled = false,
  help = null,
  extraChangeCallback = () => {},
}) {
  /**
   * Control value changed handler.
   */
  const changeHandler = () => {
    const changedValue = !value;
    setAttributes({ [attributeId]: changedValue });
    extraChangeCallback(changedValue);
  };

  return (
    <ToggleControl
      label={label}
      disabled={disabled}
      checked={value}
      onChange={changeHandler}
      help={help ? help : ""}
    ></ToggleControl>
  );
}

/**
 * @module BooleanToggleControl
 */
export default BooleanToggleControl;
