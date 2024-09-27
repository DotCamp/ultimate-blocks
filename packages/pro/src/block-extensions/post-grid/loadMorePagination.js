import React from "react";

function LoadMorePagination(props) {
  const { attributes } = props;
  return (
    <div
      className={`ub-post-grid-pagination ub-pagination-justify-${attributes.paginationAlignment} ub-${attributes.paginationType}`}
    >
      <button className="ub-load-more-button">{attributes.loadMoreText}</button>
    </div>
  );
}

export default LoadMorePagination;
