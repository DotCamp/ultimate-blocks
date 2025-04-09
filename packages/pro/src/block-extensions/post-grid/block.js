import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n"; // Import __() from wp.i18n

import {
  PanelBody,
  SelectControl,
  ToggleControl,
  TextControl,
} from "@wordpress/components";
import { useTaxonomies } from "./hooks/use-taxonomy";
import { useEffect, useState } from "@wordpress/element";
import { usePostTypes } from "./hooks/use-post-type";
import { AVAILABLE_JUSTIFICATIONS } from "../../common";
import {
  ColorSettings,
  ColorSettingsWithGradient,
  BorderControl,
  CustomToggleGroupControl,
} from "../../components/StylingControls";
import NewPostGridPagination from "./pagination";
import LoadMorePagination from "./loadMorePagination";
import { getTaxonomyTerms } from "./utils/get-terms";
import { generateStyles } from "../../utils/styling-helpers";

export default function NewPostGrid(props) {
  const [taxonomiesOptions, setTaxonomyOptions] = useState([]);

  const { attributes, setAttributes, BlockEdit } = props;
  const {
    loadMoreText,
    postType,
    taxonomyType,
    taxonomyPosition,
    displayTaxonomy,
    pagination,
    paginationType,
    taxonomyBackgroundColor,
    taxonomyBackgroundGradient,
    taxonomyColor,
    paginationColor,
    paginationBackground,
    paginationGradient,
    activePaginationColor,
    activePaginationBackground,
    activePaginationGradient,
    loadMoreColor,
    loadMoreBackground,
    loadMoreBackgroundGradient,
    loadMoreHoverColor,
    loadMoreHoverBackground,
    loadMoreHoverBackgroundGradient,
  } = attributes;
  const taxonomies = useTaxonomies(postType);

  const { postTypesSelectOptions } = usePostTypes();

  useEffect(() => {
    if (!isEmpty(taxonomiesOptions)) {
      setAttributes({ taxonomyType: taxonomiesOptions[0]?.value });
    }
  }, [taxonomiesOptions]);

  useEffect(() => {
    if (!isEmpty(taxonomies)) {
      const options = taxonomies.map((option) => {
        return {
          label: option.name,
          value: option.slug,
        };
      });
      setTaxonomyOptions(options);
    }
  }, [taxonomies]);

  const onPostTypeChange = (newValue) => {
    setAttributes({ postType: newValue });
  };
  const onTaxonomyChange = (newValue) => {
    setAttributes({ taxonomyType: newValue });
  };
  const toggleDisplayTaxonomy = () => {
    setAttributes({ displayTaxonomy: !displayTaxonomy });
    if (isEmpty(taxonomyType)) {
      setAttributes({ taxonomyType: taxonomiesOptions[0].value });
    }
  };
  const UPDATED_JUSTIFICATION = AVAILABLE_JUSTIFICATIONS.filter(
    (align) => align.value !== "space-between"
  );
  const proNormalStateColors = (
    <>
      <ColorSettings
        attrKey="taxonomyColor"
        label={__("Taxonomy Color", "ultimate-blocks-pro")}
      />
      {paginationType === "number-pagination" && (
        <>
          <ColorSettings
            label={__("Pagination Color", "ultimate-blocks-pro")}
            attrKey="paginationColor"
          />
          <ColorSettings
            label={__("Active Pagination Color", "ultimate-blocks-pro")}
            attrKey="activePaginationColor"
          />
        </>
      )}
      {paginationType === "load-more" && (
        <>
          <ColorSettings
            label={__("Load More Color", "ultimate-blocks-pro")}
            attrKey="loadMoreColor"
          />
        </>
      )}
      <ColorSettingsWithGradient
        attrBackgroundKey="taxonomyBackgroundColor"
        attrGradientKey="taxonomyBackgroundGradient"
        label={__("Taxonomy Background", "ultimate-blocks-pro")}
      />
      {paginationType === "number-pagination" && (
        <>
          <ColorSettingsWithGradient
            attrBackgroundKey="paginationBackground"
            attrGradientKey="paginationGradient"
            label={__("Pagination Background", "ultimate-blocks-pro")}
          />
          <ColorSettingsWithGradient
            attrBackgroundKey="activePaginationBackground"
            attrGradientKey="activePaginationGradient"
            label={__("Active Pagination Background", "ultimate-blocks-pro")}
          />
        </>
      )}
      {paginationType === "load-more" && (
        <>
          <ColorSettingsWithGradient
            attrBackgroundKey="loadMoreBackground"
            attrGradientKey="loadMoreBackgroundGradient"
            label={__("Load More Background", "ultimate-blocks-pro")}
          />
        </>
      )}
    </>
  );
  const proHoverStateColors = (
    <>
      {paginationType === "load-more" && (
        <>
          <ColorSettings
            label={__("Load More Color", "ultimate-blocks-pro")}
            attrKey="loadMoreHoverColor"
          />
        </>
      )}
      {paginationType === "load-more" && (
        <>
          <ColorSettingsWithGradient
            attrBackgroundKey="loadMoreHoverBackground"
            attrGradientKey="loadMoreHoverBackgroundGradient"
            label={__("Load More Background", "ultimate-blocks-pro")}
          />
        </>
      )}
    </>
  );
  const customPostTypeSelector = (
    <SelectControl
      __nextHasNoMarginBottom
      options={postTypesSelectOptions}
      value={postType}
      label={__("Post type", "ultimate-blocks-pro")}
      onChange={onPostTypeChange}
    />
  );
  const paginationPanel = (
    <PanelBody
      title={__("Pagination", "ultimate-blocks-pro")}
      initialOpen={false}
    >
      <ToggleControl
        label={__("Pagination", "ultimate-blocks-pro")}
        checked={pagination}
        onChange={() => setAttributes({ pagination: !pagination })}
      />
      {pagination && (
        <>
          <CustomToggleGroupControl
            isAdaptiveWidth
            attributeKey="paginationType"
            options={[
              {
                label: __("Number Pagination", "ultimate-blocks"),
                value: "number-pagination",
              },
              {
                label: __("Load More", "ultimate-blocks"),
                value: "load-more",
              },
            ]}
            label={__("Pagination Type", "ultimate-blocks")}
          />
          <CustomToggleGroupControl
            attributeKey="paginationAlignment"
            options={UPDATED_JUSTIFICATION}
            label={__("Pagination Alignment", "ultimate-blocks")}
          />
          {paginationType === "load-more" && (
            <TextControl
              value={loadMoreText}
              label={__("Load More Text", "ultimate-blocks")}
              onChange={(newValue) => setAttributes({ loadMoreText: newValue })}
            />
          )}
        </>
      )}
    </PanelBody>
  );
  const taxonomySettings = displayTaxonomy && (
    <>
      <SelectControl
        __nextHasNoMarginBottom
        options={taxonomiesOptions}
        value={taxonomyType}
        label={__("Taxonomy", "ultimate-blocks-pro")}
        onChange={onTaxonomyChange}
      />
      <CustomToggleGroupControl
        isAdaptiveWidth
        attributeKey="taxonomyPosition"
        options={[
          {
            label: __("With Meta", "ultimate-blocks-pro"),
            value: "with-meta",
          },
          {
            label: __("Above Title", "ultimate-blocks-pro"),
            value: "above-title",
          },
        ]}
        label={__("Taxonomy Position", "ultimate-blocks")}
      />
    </>
  );

  const displayTaxonomyControl = (
    <ToggleControl
      label={__("Display Taxonomy", "ultimate-blocks")}
      checked={displayTaxonomy}
      onChange={toggleDisplayTaxonomy}
    />
  );
  const loadMoreBorderRadius = (
    <BorderControl
      showDefaultBorder
      showDefaultBorderRadius
      attrBorderKey="loadMoreBorder"
      attrBorderRadiusKey="loadMoreBorderRadius"
      borderLabel={__("Load More Border", "ultimate-blocks")}
      borderRadiusLabel={__("Load More Border Radius", "ultimate-blocks")}
    />
  );
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
  const getPostTerms = (post) => {
    const { terms, isResolved } = getPostCategories(post);
    return { terms, isResolved };
  };

  const taxonomyStyles = {
    "--ub-post-grid-taxonomy-background": !isEmpty(taxonomyBackgroundColor)
      ? taxonomyBackgroundColor
      : taxonomyBackgroundGradient,
    "--ub-post-grid-taxonomy-color": taxonomyColor,
  };
  const renderTerms = (terms) => {
    if (!terms || !terms.length) {
      return null;
    }
    return (
      <div
        style={generateStyles(taxonomyStyles)}
        className={`ub-block-post-grid-taxonomies ub-taxonomies-${taxonomyPosition}`}
      >
        {terms.map((term) => {
          return (
            <a href={term.link} className="ub-block-post-grid-taxonomy">
              {term.name}
            </a>
          );
        })}
      </div>
    );
  };
  const paginationStyles = {
    "--ub-pagination-color":
      paginationType === "number-pagination" ? paginationColor : loadMoreColor,
    "--ub-hover-pagination-color": loadMoreHoverColor,
    "--ub-active-pagination-color": activePaginationColor,
    "--ub-pagination-background":
      paginationType === "number-pagination"
        ? !isEmpty(paginationBackground)
          ? paginationBackground
          : paginationGradient
        : !isEmpty(loadMoreBackground)
          ? loadMoreBackground
          : loadMoreBackgroundGradient,
    "--ub-active-pagination-background": !isEmpty(activePaginationBackground)
      ? activePaginationBackground
      : activePaginationGradient,
    "--ub-hover-pagination-background": !isEmpty(loadMoreHoverBackground)
      ? loadMoreHoverBackground
      : loadMoreHoverBackgroundGradient,
  };
  const NumberPaginationElem = pagination &&
    paginationType === "number-pagination" && (
      <NewPostGridPagination {...props} styles={paginationStyles} />
    );
  const LoadMorePaginationElem = pagination &&
    paginationType === "load-more" && (
      <LoadMorePagination {...props} styles={paginationStyles} />
    );
  const proProps = {
    customPostTypeSelector,
    paginationPanel,
    taxonomySettings,
    displayTaxonomyControl,
    loadMoreBorderRadius,
    proNormalStateColors,
    proHoverStateColors,
    getPostTerms,
    displayTaxonomy,
    renderTerms,
    taxonomyPosition,
    LoadMorePaginationElem,
    NumberPaginationElem,
    postType,
  };
  return <BlockEdit {...proProps} {...props} />;
}
