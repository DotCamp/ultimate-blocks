// Import icon.

import { __ } from "@wordpress/i18n"; // Import __() from wp.i18n
import PostGridBlock from "./editor";
import Inspector from "./inspector";

import { BlockControls, BlockAlignmentControl } from "@wordpress/block-editor";
import { ToolbarGroup } from "@wordpress/components";
import { useTaxonomies } from "./hooks/use-taxonomy";

export default function NewPostGrid(props) {
  const { attributes, setAttributes } = props;
  const { postLayout, wrapAlignment, postType } = attributes;

  const taxonomies = useTaxonomies(postType);

  const toolBarButton = [
    {
      icon: "grid-view",
      title: __("Grid View", "ultimate-blocks-pro"),
      onClick: () => setAttributes({ postLayout: "grid" }),
      isActive: "grid" === postLayout,
    },
    {
      icon: "list-view",
      title: __("List View", "ultimate-blocks-pro"),
      onClick: () => setAttributes({ postLayout: "list" }),
      isActive: "list" === postLayout,
    },
  ];
  const postGridProps = {
    ...props,
    taxonomies,
  };
  return (
    <>
      <Inspector {...postGridProps} />
      <BlockControls group="block">
        <BlockAlignmentControl
          value={wrapAlignment}
          controls={["center", "wide", "full"]}
          onChange={(value) => setAttributes({ wrapAlignment: value })}
        />
        <ToolbarGroup controls={toolBarButton} />
      </BlockControls>
      <PostGridBlock {...postGridProps} />
    </>
  );
}
