import { useState } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { useBlockEditContext } from "@wordpress/block-editor";
import { Popover, TextControl, DateTimePicker } from "@wordpress/components";

/**
 *
 * @param {object} props - Color settings with gradients props
 * @param {string} props.label - Component Label
 * @param {string} props.attrKey - Attribute key for color
 *
 */
function CustomDatePicker(props) {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const { clientId } = useBlockEditContext();
  const { updateBlockAttributes } = useDispatch("core/block-editor");

  const attributes = useSelect((select) => {
    return select("core/block-editor").getBlockAttributes(clientId);
  });
  const setAttributes = (newAttributes) =>
    updateBlockAttributes(clientId, newAttributes);
  const isoDate = attributes[props.attrKey];
  const date = new Date(isoDate);
  const localStringData = date.toLocaleString();
  return (
    <>
      <TextControl
        __next40pxDefaultSize
        label={props.label}
        value={localStringData}
        onFocus={() => setPopoverOpen(true)}
      />
      {isPopoverOpen && (
        <Popover
          onClose={() => {
            setPopoverOpen(false);
          }}
          placement="left-center"
        >
          <div style={{ padding: "20px" }}>
            <DateTimePicker
              is12Hour
              currentDate={attributes[props.attrKey]}
              onChange={(newValue) => {
                setAttributes({
                  [props.attrKey]: newValue,
                });
              }}
            />
          </div>
        </Popover>
      )}
    </>
  );
}

export default CustomDatePicker;
