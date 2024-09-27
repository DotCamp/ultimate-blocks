import "./timeline-item";
import { registerBlockType } from "@wordpress/blocks";
import metadata from "./block.json";
import Edit from "./edit";
import Save from "./save";
import { icon } from "./icons";

registerBlockType(metadata.name, {
  ...metadata,
  attributes: metadata.attributes,
  icon: icon,
  edit: Edit,
  save: Save,
});
