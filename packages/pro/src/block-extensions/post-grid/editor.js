import NewPostGridPagination from "./pagination";
// Setup the block
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { getTaxonomyTerms } from "./utils/get-terms";
import LoadMorePagination from "./loadMorePagination";

export default function PostGridBlock(props) {
  const {
    attributes: {
      postType,
      taxonomyType,
      displayTaxonomy,
      pagination,
      paginationType,
    },
    taxonomies,
  } = props;

  const getPostCategories = (post) => {
    const restBase = taxonomies?.find(
      (taxonomy) => taxonomy.slug === taxonomyType
    )?.rest_base;
    const { terms, isResolved } = getTaxonomyTerms(
      taxonomyType,
      post[restBase],
      false,
      postType
    );
    return { terms, isResolved };
  };
  const { terms, isResolved } = getPostCategories({});
  const shouldShowTerms = isResolved && !isEmpty(terms) && displayTaxonomy;
  const BlockEdit = props.BlockEdit;

  return (
    <>
      <BlockEdit {...props} />

      {pagination && paginationType === "number-pagination" && (
        <NewPostGridPagination {...props} />
      )}
      {pagination && paginationType === "load-more" && (
        <LoadMorePagination {...props} />
      )}
    </>
  );
}

// cate excerpt
function cateExcerpt(str, no_words) {
  if (str && str.split(" ").length > no_words) {
    return str.split(" ").splice(0, no_words).join(" ") + "...";
  } else {
    return str.split(" ").splice(0, no_words).join(" ");
  }
}
