import { isEmpty } from "lodash";
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import ManagerBase from "@Base/ManagerBase";
import ReviewBlockExtension from "../block-extensions/review";
import ContentToggleExtension, {
  ContentTogglePanelBlockExtension,
  ContentTogglePanelExtension,
} from "../block-extensions/content-toggle";
import TabbedContentExtension from "../block-extensions/tabbed-content";
import BlockExtensionBase from "@Base/BlockExtensionBase.js";
import UbProStore from "@Stores/proStore";
import deepmerge from "deepmerge";
import SocialShareBlockExtension from "../block-extensions/social-share";
import DividerBlockExtension from "../block-extensions/divider";
import { useBlockProps } from "@wordpress/block-editor";

/**
 * Block extension manager.
 *
 * This manager will be responsible for creating/modifying registered block extension bases.
 */
class BlockExtensionManager extends ManagerBase {
  /**
   * Registered block extensions.
   * Add current available extension here for manager to register.
   *
   * @private
   * @type {Array}
   */
  #registeredExtensions = [
    ContentToggleExtension,
    ContentTogglePanelBlockExtension,
    ContentTogglePanelExtension,
    DividerBlockExtension,
    ReviewBlockExtension,
    SocialShareBlockExtension,
    TabbedContentExtension,
  ];

  /**
   * Map object for extension instances.
   * This property will be populated by manager, don't add any default value.
   *
   * @type {Object}
   */
  #extensionInstanceMap = {};

  /**
   * Extension manager init logic.
   *
   * @protected
   */
  _initLogic() {
    // eslint-disable-next-line array-callback-return
    this.#registeredExtensions.map((blockExtension) => {
      // only accept extension extended from BlockExtensionBase
      if (blockExtension.prototype instanceof BlockExtensionBase) {
        const blockExtensionInstance = new blockExtension();

        this.#extensionInstanceMap[blockExtensionInstance.blockName()] =
          blockExtensionInstance;
      }
    });

    this.#addExtensionAttributes();
    this.#filterInspectorControls();
  }

  /**
   * Get extension instance.
   *
   * @param {string} blockName block name
   * @return {null|BlockExtensionBase} extension instance or null if no extension is defined with the given block name
   */
  #getExtensionInstance(blockName) {
    return this.#extensionInstanceMap?.[blockName];
  }

  /**
   * Add extension attributes to target block.
   */
  #addExtensionAttributes() {
    addFilter(
      "blocks.registerBlockType",
      "ultimate-blocks-pro/extension-attributes",
      (blockOptions) => {
        const { attributes, name } = blockOptions;
        const blockExtensionInstance = this.#getExtensionInstance(name);

        if (blockExtensionInstance) {
          const extensionAttributes = UbProStore.select(
            "getExtensionAttribute"
          )(blockExtensionInstance.blockName());

          if (!Array.isArray(extensionAttributes)) {
            extensionAttributes.__defaults = {
              type: "object",
              default: { ...extensionAttributes },
            };

            blockOptions.attributes = deepmerge(
              attributes,
              extensionAttributes
            );
          }
        }

        return blockOptions;
      }
    );
  }

  /**
   * Filter inspector controls.
   */
  #filterInspectorControls() {
    addFilter(
      "editor.BlockEdit",
      `ultimate-blocks-pro/filter-inspector-controls`,
      createHigherOrderComponent(
        (BlockEdit) => (props) => {
          const extensionInstance = this.#getExtensionInstance(props.name);
          if (extensionInstance) {
            const ExtensionComponent = extensionInstance.blockComponent();
            let classes = ["ub-pro-api-v2-wrapper"];

            if (props.name === "ub/divider") {
              if (!isEmpty(props.attributes.align)) {
                classes.push("align" + props.attributes.align);
              }
              classes.push(
                `ub-divider-orientation-${props.attributes.orientation}`
              );
            } else if (props.name === "ub/content-toggle-block") {
              if (!isEmpty(props.attributes.align)) {
                classes.push("align" + props.attributes.align);
              }
            }

            return (
              <div {...useBlockProps({ className: classes.join(" ") })}>
                <ExtensionComponent {...props} />
              </div>
            );
          }

          return <BlockEdit {...props} />;
        },
        "withInspectorControl)"
      )
    );
  }
}

/**
 * @module BlockExtensionManager
 */
export default new BlockExtensionManager();
