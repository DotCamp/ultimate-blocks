import { useMemo } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
/**
 * Returns a helper object that contains:
 * 1. An `options` object from the available post types, to be passed to a `SelectControl`.
 * 2. A helper map with available taxonomies per post type.
 *
 * @return {Object} The helper object related to post types.
 */
export const usePostTypes = () => {
  const postTypes = useSelect((select) => {
    const { getPostTypes } = select(coreStore);
    const excludedPostTypes = ["attachment"];
    const filteredPostTypes = getPostTypes({ per_page: -1 })?.filter(
      ({ viewable, slug }) => viewable && !excludedPostTypes.includes(slug)
    );
    return filteredPostTypes;
  });

  const postTypesSelectOptions = useMemo(
    () =>
      (postTypes || []).map(({ labels, slug }) => ({
        label: labels.singular_name,
        value: slug,
      })),
    [postTypes]
  );
  return { postTypesSelectOptions, postTypes };
};
