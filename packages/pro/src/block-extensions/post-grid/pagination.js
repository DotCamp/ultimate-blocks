import { generateStyles } from "../../utils/styling-helpers";

function NewPostGridPagination(props) {
  const { paginationAlignment, paginationType } = props.attributes;

  const createPaginationItem = (content, Tag = "a", extraClass = "") => (
    <Tag className={`page-numbers ${extraClass}`}>{content}</Tag>
  );

  const previewPaginationNumbers = () => (
    <>
      {createPaginationItem("Previous")}
      {createPaginationItem(1, "a", "current")}
      {createPaginationItem(2)}
      {createPaginationItem(3)}
      {createPaginationItem(4)}
      {createPaginationItem("...")}
      {createPaginationItem(15)}
      {createPaginationItem("Next")}
    </>
  );

  return (
    <div
      style={generateStyles(props.styles)}
      className={`ub-post-grid-pagination ub-pagination-justify-${paginationAlignment} ub-${paginationType}`}
    >
      {previewPaginationNumbers()}
    </div>
  );
}
export default NewPostGridPagination;
