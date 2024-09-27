import React from "react";
import { compose } from "@wordpress/compose";
import { withSelect, withDispatch } from "@wordpress/data";
import PanelContent from "./components/editorDisplay";

/**
 * Compose given component with extra properties.
 *
 * @param {React.ElementType} component component
 * @return {Function} composed component
 */
const withCompose = (component) => {
  return compose([
    withSelect((select, ownProps) => {
      const {
        getBlock,
        getSelectedBlockClientId,
        getBlockRootClientId,
        getClientIdsWithDescendants,
      } = select("core/block-editor") || select("core/editor");
      const block = getBlock(ownProps.clientId);
      const rootBlockClientId = getBlockRootClientId(block.clientId);
      return {
        block,
        selectedBlock: getSelectedBlockClientId(),
        getBlock,
        rootBlockClientId,
        getClientIdsWithDescendants,
      };
    }),
    withDispatch((dispatch) => {
      const { updateBlockAttributes, insertBlock, removeBlock, selectBlock } =
        dispatch("core/block-editor") || dispatch("core/editor");

      return {
        updateBlockAttributes,
        insertBlock,
        removeBlock,
        selectBlock,
      };
    }),
  ])(component);
};

/**
 * @module PanelContent
 */
export default withCompose(PanelContent);
