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
  const [taxonomiesOptions, setTaxonomyOptions] = useState([]);

  const {
    attributes: {
      postType,
      pagination,
      displayTaxonomy,
      taxonomyType,
      loadMoreText,
      paginationType,
    },
    setAttributes,
    taxonomies,
  } = props;
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
  const normalStateColors = (
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
  const hoverStateColors = (
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
  return (
    <>
      <InspectorControls group="settings">
        <PanelBody title={__("PRO Settings", "ultimate-blocks-pro")}>
          <SelectControl
            __nextHasNoMarginBottom
            options={postTypesSelectOptions}
            value={postType}
            label={__("Post type", "ultimate-blocks-pro")}
            onChange={onPostTypeChange}
          />
          <ToggleControl
            label={__("Display Taxonomy", "ultimate-blocks")}
            checked={displayTaxonomy}
            onChange={toggleDisplayTaxonomy}
          />
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
      <InspectorControls group="border">
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
