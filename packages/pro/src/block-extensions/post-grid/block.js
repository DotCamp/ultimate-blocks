// Import icon.

import { __ } from "@wordpress/i18n"; // Import __() from wp.i18n
import PostGridBlock from "./editor";
import Inspector from "./inspector";

import { useSelect } from "@wordpress/data";
import { BlockControls, BlockAlignmentControl } from "@wordpress/block-editor";
import {
  Placeholder,
  Spinner,
  ToolbarGroup,
  QueryControls,
} from "@wordpress/components";
import { addQueryArgs } from "@wordpress/url";
import { apiFetch } from "@wordpress/api-fetch";
import { useTaxonomies } from "./hooks/use-taxonomy";
const canSelectMultipleCategories =
  QueryControls.toString().includes("selectedCategories");

//function below taken from https://stackoverflow.com/a/37616104
const filterObjectAttributes = (obj, condition) =>
  Object.fromEntries(Object.entries(obj).filter(condition));

export default function NewPostGrid(props) {
  const { attributes, setAttributes } = props;
  const {
    postLayout,
    wrapAlignment,
    categories,
    order,
    categoryArray,
    excludedCategories,
    orderBy,
    amountPosts,
    offset,
    tagArray,
    authorArray,
    postType,
  } = attributes;
  const { posts } = useSelect((select) => {
    const { getEntityRecords } = select("core");
    const { getCurrentPostId } = select("core/editor");

    const getPosts = filterObjectAttributes(
      {
        categories: canSelectMultipleCategories
          ? categoryArray && categoryArray.length > 0
            ? categoryArray.map((cat) => cat.id)
            : []
          : categories,
        categories_exclude: excludedCategories.map((cat) => cat.id),
        order,
        orderby: orderBy,
        per_page: amountPosts,
        offset: offset,
        exclude: [getCurrentPostId()],
        tags: tagArray,
        author: authorArray,
      },
      (value) => typeof value !== "undefined"
    );

    return {
      posts: getEntityRecords("postType", postType, getPosts),
    };
  });
  const taxonomies = useTaxonomies(postType);
  const emptyPosts = Array.isArray(posts) && posts.length;

  if (categories !== "" && canSelectMultipleCategories) {
    apiFetch({
      path: addQueryArgs("/wp/v2/categories", {
        per_page: -1,
      }),
    })
      .then((categoriesList) => {
        setAttributes({
          categoryArray: categoriesList.filter(
            (c) => c.id === Number(categories)
          ),
          categories: "",
        });
      })
      .catch(() => {
        setAttributes({
          categoryArray: [],
          categories: "",
        });
      });
  }

  if (!emptyPosts) {
    return (
      <Placeholder
        icon="admin-post"
        label={__("Ultimate Blocks Post Grid", "ultimate-blocks-pro")}
      >
        {!Array.isArray(posts) ? (
          <Spinner />
        ) : (
          <>
            <Inspector {...{ ...props }} />
            <div>{__("No posts found.", "ultimate-blocks-pro")}</div>
          </>
        )}
      </Placeholder>
    );
  }

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
    posts,
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
