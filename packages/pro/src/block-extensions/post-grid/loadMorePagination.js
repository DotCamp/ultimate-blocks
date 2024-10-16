import React from "react";
import { omitBy, isUndefined, trim, isEmpty } from "lodash";
import {
  generateStyles,
  getBorderCSS,
  getBorderStyles,
  getBorderVariablesCss,
} from "../../utils/styling-helpers";

function LoadMorePagination(props) {
  const { attributes } = props;
  const { loadMoreBorder, loadMoreBorderRadius } = attributes;
  const loadMoreBorderCSS = getBorderStyles(loadMoreBorder);

  const loadMoreInlineStyles = {
    "border-top-left-radius": loadMoreBorderRadius?.topLeft,
    "border-top-right-radius": loadMoreBorderRadius?.topRight,
    "border-bottom-left-radius": loadMoreBorderRadius?.bottomLeft,
    "border-bottom-right-radius": loadMoreBorderRadius?.bottomRight,
    ...loadMoreBorderCSS,
  };
  return (
    <div
      className={`ub-post-grid-pagination ub-pagination-justify-${attributes.paginationAlignment} ub-${attributes.paginationType}`}
      style={generateStyles(props.styles)}
    >
      <button
        className="ub-load-more-button"
        style={generateStyles(loadMoreInlineStyles)}
      >
        {attributes.loadMoreText}
      </button>
    </div>
  );
}

export default LoadMorePagination;
