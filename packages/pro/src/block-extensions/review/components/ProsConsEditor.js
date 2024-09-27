// eslint-disable-next-line no-unused-vars
import React, { createContext, Fragment, useEffect } from "react";
import { PanelBody } from "@wordpress/components";
import { InspectorControls } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import IconEditorControls from "./IconEditorControls";
import TextEditorControls from "./TextEditorControls";
import GeneralEditorControls from "./GeneralEditorControls";
import ConditionalRenderer from "./ConditionalRenderer";
import ColorEditorControls from "./ColorEditorControls";
import AdvancedControl from "./AdvancedControl";
import EnabledStatusRenderer from "./EnabledStatusRenderer";
import LayoutControls from "./LayoutControls";
import withProMainStore from "@Stores/proStore/hoc/withProMainStore.js";
import CardLayoutRelatedRender from "./CardLayoutRelatedRender";
import ColorControlPortal from "./ColorControlPortal";
import InspectorControlsStylesTab from "@Components/Common/InspectorControlsStylesTab";

/**
 * Pros/Const editor component.
 *
 * @param {Object}   props               component properties
 * @param {Object}   props.attributes    block attributes
 * @param {Function} props.setAttributes set block attributes function
 * @param {Object}   props.layoutTypes   layout types, will be supplied via HOC
 * @function Object() { [native code]
 */
function ProsConsEditor({ attributes, setAttributes, layoutTypes, rootBlock }) {
  // these attributes will be reset to default values when advanced controls are toggled off
  const advancedControlAttributeIds = [
    "syncIconFontSize",
    "syncTitleContentFontSize",
  ];

  // revert advanced controls to their default values on disable
  useEffect(() => {
    if (!rootBlock) {
      if (!attributes.prosConsAdvancedControls) {
        const defaultValues = attributes.__defaults;
        // eslint-disable-next-line array-callback-return
        advancedControlAttributeIds.map((attributeId) => {
          const val = defaultValues[attributeId];
          if (val !== undefined) {
            setAttributes({ [attributeId]: val });
          }
        });
      }
    }
  }, [attributes.prosConsAdvancedControls]);

  return (
    <Fragment>
      <InspectorControlsStylesTab>
        <ColorControlPortal.Consumer>
          <AdvancedControl>
            <ConditionalRenderer
              attributeKey={"prosConsLayout"}
              targetValue={[layoutTypes.CARD, layoutTypes.GRAPH]}
            >
              <ColorEditorControls />
            </ConditionalRenderer>
          </AdvancedControl>
        </ColorControlPortal.Consumer>
      </InspectorControlsStylesTab>
      <InspectorControls>
        <PanelBody
          title={__("Pros/Cons", "ultimate-blocks-pro")}
          initialOpen={false}
        >
          <GeneralEditorControls />
          <EnabledStatusRenderer>
            <LayoutControls />
          </EnabledStatusRenderer>
          <CardLayoutRelatedRender>
            <ConditionalRenderer
              attributeKey={"syncIconFontSize"}
              targetValue={false}
            >
              <IconEditorControls />
            </ConditionalRenderer>
          </CardLayoutRelatedRender>
          <EnabledStatusRenderer>
            <TextEditorControls />
          </EnabledStatusRenderer>
        </PanelBody>
      </InspectorControls>
    </Fragment>
  );
}

// pro main store selection mapping
const proMainStoreSelectMapping = ({ getExtensionExtraData }) => {
  return {
    layoutTypes: getExtensionExtraData("ub/review", "prosConsLayoutTypes"),
  };
};

/**
 * @module ProsConsEditor
 */
export default withProMainStore(proMainStoreSelectMapping)(ProsConsEditor);
