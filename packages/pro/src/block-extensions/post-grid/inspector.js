import PropTypes from "prop-types";

import { startCase, isEmpty } from "lodash";
import { useEffect, useState, useRef } from "react";
import {
  BorderControl,
  SpacingControlWithToolsPanel,
  CustomToggleGroupControl,
  ColorSettings,
  ColorSettingsWithGradient,
  TabsPanelControl,
} from "../../components/StylingControls";
import { AVAILABLE_JUSTIFICATIONS } from "../../common";
import { usePostTypes } from "./hooks/use-post-type";
import { __ } from "@wordpress/i18n";
import { InspectorControls, HeightControl } from "@wordpress/block-editor";
import {
  PanelBody,
  SelectControl,
  ToggleControl,
  TextControl,
  RangeControl,
} from "@wordpress/components";
import { addQueryArgs } from "@wordpress/url";
import apiFetch from "@wordpress/api-fetch";
const MAX_POSTS_COLUMNS = 3;

function Autocomplete(props) {
  const [userInput, setUserInput] = useState("");
  const [showSuggestions, setSuggestionDisplay] = useState(false);
  const listItem = useRef(null);

  const filteredList = props.list.filter(
    (i) => i.label.toLowerCase().indexOf(userInput.toLowerCase()) > -1
  );
  useEffect(() => {
    listItem.current = Array(props.list.length);
  }, [props.list]);

  return (
    <div>
      <input
        type="text"
        value={userInput}
        style={{ width: "200px" }}
        onChange={(e) => {
          setUserInput(e.target.value);
          setSuggestionDisplay(e.target.value.length > 0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && filteredList.length) {
            if (showSuggestions) {
              listItem.current[0].focus();
              e.preventDefault();
            } else {
              setSuggestionDisplay(true);
            }
          }
        }}
      />
      {showSuggestions && (
        <div className={props.className} style={{ width: "200px" }}>
          {filteredList.map((item, i) => (
            <div
              className={"ub-autocomplete-list-item"}
              ref={(elem) => {
                listItem.current[i] = elem;
              }}
              onClick={() => {
                props.addToSelection(item);
                setUserInput("");
                setSuggestionDisplay(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  if (i < filteredList.length - 1) {
                    e.preventDefault();
                    listItem.current[i + 1].focus();
                  } else {
                    listItem.current[i].blur();
                    setSuggestionDisplay(false);
                  }
                }
                if (e.key === "ArrowUp") {
                  if (i > 0) {
                    e.preventDefault();
                    listItem.current[i - 1].focus();
                  } else {
                    listItem.current[i].blur();
                    setSuggestionDisplay(false);
                  }
                }
              }}
              tabIndex={0}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Autocomplete.propTypes = {
  list: PropTypes.array,
  selection: PropTypes.array,
};

Autocomplete.defaultProps = {
  list: [],
  selection: PropTypes.array,
};

export default function Inspector(props) {
  const [categoriesList, setCategoriesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [authorsList, setAuthorsList] = useState([]);
  const [stillMounted, setStillMounted] = useState(false);
  const [orderDropdownVal, setOrderDropdownval] = useState(0);
  const [taxonomiesOptions, setTaxonomyOptions] = useState([]);

  const {
    attributes: {
      checkPostImage,
      postImageWidth,
      preservePostImageAspectRatio,
      postImageHeight,
      checkPostAuthor,
      checkPostDate,
      checkPostExcerpt,
      checkPostLink,
      excerptLength,
      readMoreText,
      amountPosts,
      postLayout,
      columns,
      categories, //old stringified list
      excludedCategories,
      categoryArray,
      orderBy,
      order,
      checkPostTitle,
      postTitleTag,
      authorArray,
      tagArray,
      postType,
      pagination,
      isEqualHeight,
      displayTaxonomy,
      taxonomyType,
      rowGap,
      columnGap,
      loadMoreText,
      paginationType,
    },
    setAttributes,
    taxonomies,
    posts,
  } = props;
  const { postTypesSelectOptions } = usePostTypes();

  useEffect(() => {
    if (!isEmpty(taxonomiesOptions)) {
      setAttributes({ taxonomyType: taxonomiesOptions[0]?.value });
    }
  }, [taxonomiesOptions]);
  useEffect(() => {
    setStillMounted(true);
    return () => setStillMounted(false);
  }, []);

  useEffect(() => {
    if (stillMounted) {
      apiFetch({ path: addQueryArgs("/wp/v2/categories", { per_page: -1 }) })
        .then((categoriesList) => {
          setCategoriesList(categoriesList);
        })
        .catch(() => {
          if (stillMounted) {
            setCategoriesList([]);
          }
        });

      apiFetch({ path: addQueryArgs("/wp/v2/tags", { per_page: -1 }) })
        .then((tagsList) => {
          setTagsList(tagsList);
        })
        .catch(() => {
          if (stillMounted) {
            setTagsList([]);
          }
        });

      apiFetch({
        path: addQueryArgs("/wp/v2/users", { per_page: -1, who: "authors" }),
      })
        .then((authorsList) => {
          setAuthorsList(authorsList);
        })
        .catch(() => {
          if (stillMounted) {
            setAuthorsList([]);
          }
        });
    }
  }, [stillMounted]);

  useEffect(() => {
    //initialize orderDropdownVal
    if (orderBy === "title") {
      setOrderDropdownval(order === "asc" ? 2 : 3);
    }
    if (orderBy === "date") {
      setOrderDropdownval(order === "desc" ? 0 : 1);
    }
  }, []);
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
  const hasPosts = Array.isArray(posts) && posts.length;

  // Post type options
  const postTypeOptions = [
    { value: "grid", label: __("Grid", "ultimate-blocks-pro") },
    { value: "list", label: __("List", "ultimate-blocks-pro") },
  ];

  const categorySuggestions = categoriesList.reduce(
    (accumulator, category) => ({
      ...accumulator,
      [category.name]: category,
    }),
    {}
  );
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
  const normalStateColors = (
    <>
      <ColorSettings
        attrKey="postTitleColor"
        label={__("Title Color", "ultimate-blocks-pro")}
      />
      <ColorSettings
        attrKey="authorColor"
        label={__("Author Color", "ultimate-blocks-pro")}
      />
      <ColorSettings
        attrKey="dateColor"
        label={__("Date Color", "ultimate-blocks-pro")}
      />
      <ColorSettings
        attrKey="excerptColor"
        label={__("Excerpt Color", "ultimate-blocks-pro")}
      />
      <ColorSettings
        attrKey="linkColor"
        label={__("Link Color", "ultimate-blocks-pro")}
      />
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
      <ColorSettingsWithGradient
        attrBackgroundKey="linkBackgroundColor"
        attrGradientKey="linkBackgroundGradient"
        label={__("Link Background", "ultimate-blocks-pro")}
      />
      <ColorSettingsWithGradient
        attrBackgroundKey="postBackgroundColor"
        attrGradientKey="postBackgroundGradient"
        label={__("Post Background", "ultimate-blocks-pro")}
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
  const hoverStateColors = (
    <>
      <ColorSettings
        attrKey="postTitleColorHover"
        label={__("Title Color", "ultimate-blocks-pro")}
      />
      <ColorSettings
        attrKey="authorColorHover"
        label={__("Author Color", "ultimate-blocks-pro")}
      />
      <ColorSettings
        attrKey="dateColorHover"
        label={__("Date Color", "ultimate-blocks-pro")}
      />
      <ColorSettings
        attrKey="excerptColorHover"
        label={__("Excerpt Color", "ultimate-blocks-pro")}
      />
      <ColorSettings
        attrKey="linkColorHover"
        label={__("Link Color", "ultimate-blocks-pro")}
      />
      {paginationType === "load-more" && (
        <>
          <ColorSettings
            label={__("Load More Color", "ultimate-blocks-pro")}
            attrKey="loadMoreHoverColor"
          />
        </>
      )}
      <ColorSettingsWithGradient
        attrBackgroundKey="linkBackgroundColorHover"
        attrGradientKey="linkBackgroundGradientHover"
        label={__("Link Background", "ultimate-blocks-pro")}
      />
      <ColorSettingsWithGradient
        attrBackgroundKey="postBackgroundColorHover"
        attrGradientKey="postBackgroundGradientHover"
        label={__("Post Background", "ultimate-blocks-pro")}
      />
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
  return (
    <>
      <InspectorControls group="settings">
        <PanelBody title={__("General", "ultimate-blocks-pro")}>
          {Array.isArray(posts) && posts.length > 0 && (
            <>
              <SelectControl
                label={__("Grid Type", "ultimate-blocks-pro")}
                options={postTypeOptions}
                value={postLayout}
                onChange={(postLayout) => setAttributes({ postLayout })}
              />
              {"grid" === postLayout && (
                <RangeControl
                  label={__("Columns", "ultimate-blocks-pro")}
                  value={columns}
                  onChange={(columns) => setAttributes({ columns })}
                  min={1}
                  max={
                    !hasPosts
                      ? MAX_POSTS_COLUMNS
                      : Math.min(MAX_POSTS_COLUMNS, posts.length)
                  }
                />
              )}
            </>
          )}
          <ToggleControl
            label={__("Equal Height", "ultimate-blocks-pro")}
            checked={isEqualHeight}
            onChange={() => setAttributes({ isEqualHeight: !isEqualHeight })}
          />
          <HeightControl
            label={__("Row Gap", "ultimate-blocks-pro")}
            value={rowGap}
            onChange={(newValue) => setAttributes({ rowGap: newValue })}
          />
          <HeightControl
            label={__("Column Gap", "ultimate-blocks-pro")}
            value={columnGap}
            onChange={(newValue) => setAttributes({ columnGap: newValue })}
          />
        </PanelBody>
        <PanelBody
          title={__("Query", "ultimate-blocks-pro")}
          initialOpen={false}
        >
          <SelectControl
            __nextHasNoMarginBottom
            options={postTypesSelectOptions}
            value={postType}
            label={__("Post type", "ultimate-blocks-pro")}
            onChange={onPostTypeChange}
          />
          <p>{__("Authors")}</p>
          {authorArray && (
            <div className="ub-autocomplete-container">
              {authorsList
                .filter((t) => authorArray.includes(t.id))
                .map((t) => (
                  <span className="ub-autocomplete-selection">
                    {t.name}
                    <span
                      className="dashicons dashicons-dismiss"
                      onClick={() =>
                        setAttributes({
                          authorArray: authorArray.filter(
                            (sel) => sel !== t.id
                          ),
                        })
                      }
                    />
                  </span>
                ))}
            </div>
          )}
          <Autocomplete
            className="ub-autocomplete-list"
            list={authorsList
              .filter((t) => !authorArray.includes(t.id))
              .map((t) => ({ label: t.name, value: t.id }))}
            selection={authorArray}
            addToSelection={(item) => {
              if (!authorArray.includes(item.value)) {
                setAttributes({ authorArray: [...authorArray, item.value] });
              }
            }}
          />
          <label className="components-truncate components-text components-input-control__label">
            {__("Tags")}
          </label>
          {tagArray && (
            <div className="ub-autocomplete-container">
              {tagsList
                .filter((t) => tagArray.includes(t.id))
                .map((t) => (
                  <span className="ub-autocomplete-selection">
                    {t.name}
                    <span
                      className="dashicons dashicons-dismiss"
                      onClick={() => {
                        setAttributes({
                          tagArray: tagArray.filter((sel) => sel !== t.id),
                        });
                      }}
                    />
                  </span>
                ))}
            </div>
          )}
          <Autocomplete
            className="ub-autocomplete-list"
            list={tagsList
              .filter((t) => !tagArray.includes(t.id))
              .map((t) => ({ label: t.name, value: t.id }))}
            selection={tagArray}
            addToSelection={(item) => {
              if (!tagArray.includes(item.value)) {
                setAttributes({ tagArray: [...tagArray, item.value] });
              }
            }}
          />
          <SelectControl
            label={__("Order By", "ultimate-blocks-pro")}
            options={[
              __("Newest to oldest"),
              __("Oldest to newest"),
              __("A → Z"),
              __("Z → A"),
            ].map((a, i) => ({ value: i, label: a }))}
            value={orderDropdownVal}
            onChange={(newDropVal) => {
              setOrderDropdownval(newDropVal);
              setAttributes({
                order: newDropVal % 3 === 0 ? "desc" : "asc",
                orderBy: newDropVal > 1 ? "title" : "date",
              });
            }}
          />

          <label className="components-truncate components-text components-input-control__label">
            {__("Included Categories")}
          </label>
          {categoryArray && (
            <div className="ub-autocomplete-container">
              {categoriesList
                .filter((c) => categoryArray.map((ca) => ca.id).includes(c.id))
                .map((c) => (
                  <span className="ub-autocomplete-selection">
                    {c.name}
                    <span
                      className="dashicons dashicons-dismiss"
                      onClick={() =>
                        setAttributes({
                          categoryArray: categoryArray.filter(
                            (sel) => sel.id !== c.id
                          ),
                        })
                      }
                    />
                  </span>
                ))}
            </div>
          )}
          <Autocomplete
            className="ub-autocomplete-list"
            list={categoriesList
              .filter(
                (cur) =>
                  !excludedCategories.some((other) => cur.id === other.id)
              )
              .filter(
                (cur) => !categoryArray.some((other) => cur.id === other.id)
              )
              .map((c) => ({ label: c.name, value: c.id }))}
            selection={categoryArray}
            addToSelection={(item) => {
              //use full object for full compatibility with querycontrols
              if (!categoryArray.includes(item.value)) {
                setAttributes({
                  categoryArray: [
                    ...categoryArray,
                    ...categoriesList.filter((cat) => cat.id === item.value),
                  ],
                });
              }
            }}
          />

          <label className="components-truncate components-text components-input-control__label">
            {__("Excluded Categories")}
          </label>
          {excludedCategories && (
            <div className="ub-autocomplete-container">
              {categoriesList
                .filter((c) =>
                  excludedCategories.map((ca) => ca.id).includes(c.id)
                )
                .map((c) => (
                  <span className="ub-autocomplete-selection">
                    {c.name}
                    <span
                      className="dashicons dashicons-dismiss"
                      onClick={() => {
                        setAttributes({
                          excludedCategories: excludedCategories.filter(
                            (sel) => sel.id !== c.id
                          ),
                        });
                      }}
                    />
                  </span>
                ))}
            </div>
          )}
          <Autocomplete
            className="ub-autocomplete-list"
            list={categoriesList
              .filter(
                (cur) =>
                  !excludedCategories.some((other) => cur.id === other.id)
              )
              .filter(
                (cur) => !categoryArray.some((other) => cur.id === other.id)
              )
              .map((c) => ({ label: c.name, value: c.id }))}
            selection={excludedCategories}
            addToSelection={(item) => {
              if (!excludedCategories.includes(item.value)) {
                setAttributes({
                  excludedCategories: [
                    ...excludedCategories,
                    ...categoriesList.filter((cat) => cat.id === item.value),
                  ],
                });
              }
            }}
          />
          <br></br>
          {displayTaxonomy && (
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
          )}

          <RangeControl
            label={__("Number of items")}
            value={amountPosts}
            onChange={(amountPosts) => setAttributes({ amountPosts })}
            min={1}
            max={100}
          />
        </PanelBody>
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
                  onChange={(newValue) =>
                    setAttributes({ loadMoreText: newValue })
                  }
                />
              )}
            </>
          )}
        </PanelBody>
        {Array.isArray(posts) && posts.length > 0 && (
          <PanelBody
            title={__("Display", "ultimate-blocks-pro")}
            initialOpen={false}
          >
            <ToggleControl
              label={__("Display Featured Image", "ultimate-blocks-pro")}
              checked={checkPostImage}
              onChange={(checkPostImage) => setAttributes({ checkPostImage })}
            />
            {checkPostImage && (
              <>
                <TextControl
                  label={__("Post Image Width", "ultimate-blocks-pro")}
                  type="number"
                  min={1}
                  value={postImageWidth}
                  onChange={(val) =>
                    setAttributes({ postImageWidth: Number(val) })
                  }
                />
                <ToggleControl
                  label={__("Preserve Aspect Ratio", "ultimate-blocks-pro")}
                  checked={preservePostImageAspectRatio}
                  onChange={(preservePostImageAspectRatio) =>
                    setAttributes({ preservePostImageAspectRatio })
                  }
                />
                {!preservePostImageAspectRatio && (
                  <TextControl
                    label={__("Post Image Height", "ultimate-blocks-pro")}
                    type="number"
                    min={1}
                    value={postImageHeight}
                    onChange={(val) =>
                      setAttributes({ postImageHeight: Number(val) })
                    }
                  />
                )}
              </>
            )}
            <ToggleControl
              label={__("Display Author", "ultimate-blocks-pro")}
              checked={checkPostAuthor}
              onChange={(checkPostAuthor) => setAttributes({ checkPostAuthor })}
            />
            <ToggleControl
              label={__("Display Date", "ultimate-blocks-pro")}
              checked={checkPostDate}
              onChange={(checkPostDate) => setAttributes({ checkPostDate })}
            />
            <ToggleControl
              label={__("Display Excerpt", "ultimate-blocks-pro")}
              checked={checkPostExcerpt}
              onChange={(checkPostExcerpt) =>
                setAttributes({ checkPostExcerpt })
              }
            />
            {checkPostExcerpt && (
              <RangeControl
                label={__("Excerpt Length", "ultimate-blocks-pro")}
                value={excerptLength}
                onChange={(value) => setAttributes({ excerptLength: value })}
                min={0}
                max={200}
              />
            )}
            <ToggleControl
              label={__("Display Continue Reading Link", "ultimate-blocks-pro")}
              checked={checkPostLink}
              onChange={(checkPostLink) => setAttributes({ checkPostLink })}
            />
            {checkPostLink && (
              <TextControl
                label={__(
                  "Customize Continue Reading Text",
                  "ultimate-blocks-pro"
                )}
                type="text"
                value={readMoreText}
                onChange={(value) => setAttributes({ readMoreText: value })}
              />
            )}
            <ToggleControl
              label={__("Display Title", "ultimate-blocks-pro")}
              checked={checkPostTitle}
              onChange={(checkPostTitle) => setAttributes({ checkPostTitle })}
            />
            {checkPostTitle && (
              <SelectControl
                label={__("Title tag", "ultimate-blocks-pro")}
                options={["h2", "h3", "h4"].map((a) => ({
                  value: a,
                  label: __(a),
                }))}
                value={postTitleTag}
                onChange={(postTitleTag) => setAttributes({ postTitleTag })}
              />
            )}
            <ToggleControl
              label={__("Display Taxonomy", "ultimate-blocks")}
              checked={displayTaxonomy}
              onChange={toggleDisplayTaxonomy}
            />
          </PanelBody>
        )}
      </InspectorControls>
      <InspectorControls group="color">
        <TabsPanelControl
          tabs={[
            {
              name: "normalState",
              title: __("Normal", "ultimate-blocks-pro"),
              component: normalStateColors,
            },
            {
              name: "hoverState",
              title: __("Hover", "ultimate-blocks-pro"),
              component: hoverStateColors,
            },
          ]}
        />
      </InspectorControls>
      <InspectorControls group="dimensions">
        <SpacingControlWithToolsPanel
          showByDefault
          attrKey="padding"
          label={__("Padding", "ultimate-blocks-pro")}
        />
        <SpacingControlWithToolsPanel
          minimumCustomValue={-Infinity}
          showByDefault
          attrKey="margin"
          label={__("Margin", "ultimate-blocks-pro")}
        />
        <SpacingControlWithToolsPanel
          showByDefault
          attrKey="contentPadding"
          label={__("Content Padding", "ultimate-blocks-pro")}
        />
        <SpacingControlWithToolsPanel
          showByDefault
          attrKey="linkPadding"
          label={__("Link Padding", "ultimate-blocks-pro")}
        />
        <SpacingControlWithToolsPanel
          showByDefault
          attrKey="postPadding"
          label={__("Post Padding", "ultimate-blocks-pro")}
        />
      </InspectorControls>
      <InspectorControls group="border">
        <BorderControl
          isShowBorder={false}
          showDefaultBorderRadius
          attrBorderRadiusKey="imageBorderRadius"
          borderRadiusLabel={__("Image Border Radius", "ultimate-blocks-pro")}
        />
        <BorderControl
          isShowBorder={false}
          showDefaultBorderRadius
          attrBorderRadiusKey="postBorderRadius"
          borderRadiusLabel={__("Post Border Radius", "ultimate-blocks-pro")}
        />
        <BorderControl
          isShowBorder={false}
          showDefaultBorderRadius
          attrBorderRadiusKey="linkBorderRadius"
          borderRadiusLabel={__("Link Border Radius", "ultimate-blocks-pro")}
        />
        <BorderControl
          showDefaultBorder
          showDefaultBorderRadius
          attrBorderKey="loadMoreBorder"
          attrBorderRadiusKey="loadMoreBorderRadius"
          borderLabel={__("Load More Border", "ultimate-blocks")}
          borderRadiusLabel={__("Load More Border Radius", "ultimate-blocks")}
        />
      </InspectorControls>
    </>
  );
}
