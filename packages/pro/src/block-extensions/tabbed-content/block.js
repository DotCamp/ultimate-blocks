/**
 * BLOCK: tabbed-content
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { compose } from "@wordpress/compose";
import { withSelect, withDispatch } from "@wordpress/data";
import { TabHolder } from "./components/editorDisplay";

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
        getSelectedBlock,
        getClientIdsWithDescendants,
        getBlockRootClientId,
      } = select("core/block-editor") || select("core/editor");
      const block = getBlock(ownProps.clientId);
      const rootBlockClientId = getBlockRootClientId(block.clientId);
      return {
        block,
        selectedBlock: getSelectedBlock(),
        getBlock,
        getClientIdsWithDescendants,
        rootBlockClientId,
      };
    }),
    withDispatch((dispatch) => {
      const {
        updateBlockAttributes,
        insertBlock,
        removeBlock,
        moveBlockToPosition,
        selectBlock,
      } = dispatch("core/block-editor") || dispatch("core/editor");

      return {
        updateBlockAttributes,
        insertBlock,
        removeBlock,
        moveBlockToPosition,
        selectBlock,
      };
    }),
  ])(component);
};

/**
 * @module TabHolder
 */
export default withCompose(TabHolder);
