/**
 * WordPress dependencies
 */
import { isEmpty } from "lodash";
import { select } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";

/**
 * Hook that provides the taxonomy terms associated with a specific taxonomy.
 *
 * @param {string} slug The taxonomy slug
 * @param {number[]|-1} includeTermIds Term ids to include, will include all terms if -1.
 * @param {boolean} hideEmpty Weather to hide terms not assigned to any posts.
 *
 * @return {{ terms: Object[]; isResolved: boolean; }} An array of associated taxonomy terms.
 */
export const getTaxonomyTerms = (
  slug,
  includeTermIds,
  hideEmpty = false,
  postType
) => {
  const { getEntityRecords, hasFinishedResolution } = select(coreStore);

  const query = {
    order: "asc",
    context: "view",
    orderby: "name",
    per_page: -1,
    hide_empty: hideEmpty,
    count: true,
  };

  if (includeTermIds !== -1) {
    query.include = includeTermIds;
  }

  const selectorArgs = ["taxonomy", slug, query];

  return {
    terms: getEntityRecords(...selectorArgs),
    isResolved: hasFinishedResolution("getEntityRecords", selectorArgs),
  };
};
