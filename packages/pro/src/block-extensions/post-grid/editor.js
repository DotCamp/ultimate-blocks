import FeaturedImage from "./image";
import moment from "moment";
import NewPostGridPagination from "./pagination";
// Setup the block
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/htmlEntities";
import { getTaxonomyTerms } from "./utils/get-terms";
import LoadMorePagination from "./loadMorePagination";
import { generateStyles, getSpacingCss } from "../../utils/styling-helpers";

export default function PostGridBlock(props) {
  const {
    attributes: {
      checkPostImage,
      checkPostAuthor,
      checkPostDate,
      checkPostExcerpt,
      checkPostLink,
      checkPostTitle,
      excerptLength,
      readMoreText,
      postLayout,
      columns,
      postTitleTag,
      isEqualHeight,
      postType,
      taxonomyType,
      taxonomyPosition,
      displayTaxonomy,
      pagination,
      paginationType,
      preservePostImageAspectRatio,
      postPadding,
      padding,
      margin,
      linkPadding,
      contentPadding,
      postBorderRadius,
      postBackgroundColor,
      postBackgroundGradient,
      postBackgroundColorHover,
      postBackgroundGradientHover,
      linkBorderRadius,
      linkBackgroundColor,
      linkBackgroundGradient,
      linkColorHover,
      linkBackgroundColorHover,
      linkBackgroundGradientHover,
      linkColor,
      authorColor,
      authorColorHover,
      dateColor,
      dateColorHover,
      excerptColor,
      excerptColorHover,
      imageBorderRadius,
      postTitleColor,
      postTitleColorHover,
      rowGap,
      columnGap,
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
    },
    className,
    posts,
    taxonomies,
  } = props;

  const PostTag = postTitleTag;

  const equalHeightClass = isEqualHeight ? " is-equal-height " : "";
  const isPreservePostImageAspectRatio = preservePostImageAspectRatio
    ? " preserve-post-image-aspect-ratio "
    : "";
  const postPaddingObj = getSpacingCss(postPadding ?? {});
  const sectionPadding = getSpacingCss(padding ?? {});
  const sectionMargin = getSpacingCss(margin ?? {});
  const linkPaddingObj = getSpacingCss(linkPadding ?? {});
  const contentPaddingObj = getSpacingCss(contentPadding ?? {});

  const taxonomyStyles = {
    "--ub-post-grid-taxonomy-background": !isEmpty(taxonomyBackgroundColor)
      ? taxonomyBackgroundColor
      : taxonomyBackgroundGradient,
    "--ub-post-grid-taxonomy-color": taxonomyColor,
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
  const postStyles = {
    "border-top-left-radius": postBorderRadius?.topLeft,
    "border-top-right-radius": postBorderRadius?.topRight,
    "border-bottom-left-radius": postBorderRadius?.bottomLeft,
    "border-bottom-right-radius": postBorderRadius?.bottomRight,
    "--ub-post-grid-post-background": !isEmpty(postBackgroundColor)
      ? postBackgroundColor
      : postBackgroundGradient,
    "--ub-post-grid-post-hover-background": !isEmpty(postBackgroundColorHover)
      ? postBackgroundColorHover
      : postBackgroundGradientHover,
    "padding-top": postPaddingObj?.top,
    "padding-right": postPaddingObj?.right,
    "padding-bottom": postPaddingObj?.bottom,
    "padding-left": postPaddingObj?.left,
  };
  const sectionStyles = {
    paddingTop: sectionPadding?.top,
    paddingRight: sectionPadding?.right,
    paddingBottom: sectionPadding?.bottom,
    paddingLeft: sectionPadding?.left,
    marginTop: sectionMargin?.top,
    marginRight: sectionMargin?.right,
    marginBottom: sectionMargin?.bottom,
    marginLeft: sectionMargin?.left,
  };
  const linkStyles = {
    "border-top-left-radius": linkBorderRadius?.topLeft,
    "border-top-right-radius": linkBorderRadius?.topRight,
    "border-bottom-left-radius": linkBorderRadius?.bottomLeft,
    "border-bottom-right-radius": linkBorderRadius?.bottomRight,
    "--ub-post-grid-link-color": linkColor,
    "--ub-post-grid-link-background": !isEmpty(linkBackgroundColor)
      ? linkBackgroundColor
      : linkBackgroundGradient,
    "--ub-post-grid-link-hover-background": !isEmpty(linkBackgroundColorHover)
      ? linkBackgroundColorHover
      : linkBackgroundGradientHover,
    "--ub-post-grid-link-hover-color": linkColorHover,
    "padding-top": linkPaddingObj?.top,
    "padding-right": linkPaddingObj?.right,
    "padding-bottom": linkPaddingObj?.bottom,
    "padding-left": linkPaddingObj?.left,
  };
  const imageStyles = {
    "--ub-post-grid-image-top-left-radius": imageBorderRadius?.topLeft,
    "--ub-post-grid-image-top-right-radius": imageBorderRadius?.topRight,
    "--ub-post-grid-image-bottom-left-radius": imageBorderRadius?.bottomLeft,
    "--ub-post-grid-image-bottom-right-radius": imageBorderRadius?.bottomRight,
  };
  const titleStyles = {
    "--ub-post-grid-title-color": postTitleColor,
    "--ub-post-grid-title-hover-color": postTitleColorHover,
  };
  const authorStyles = {
    "--ub-post-grid-author-color": authorColor,
    "--ub-post-grid-author-hover-color": authorColorHover,
  };
  const dateStyles = {
    "--ub-post-grid-date-color": dateColor,
    "--ub-post-grid-date-hover-color": dateColorHover,
  };
  const excerptStyles = {
    "--ub-post-grid-excerpt-color": excerptColor,
    "--ub-post-grid-excerpt-hover-color": excerptColorHover,
  };
  const contentStyles = {
    "padding-top": contentPaddingObj?.top,
    "padding-right": contentPaddingObj?.right,
    "padding-bottom": contentPaddingObj?.bottom,
    "padding-left": contentPaddingObj?.left,
  };
  const gridStyles = {
    "row-gap": rowGap,
    "column-gap": columnGap,
  };
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
  const renderTerms = (whereTo, terms) => {
    return (
      <div
        style={generateStyles(taxonomyStyles)}
        className={`ub-block-post-grid-taxonomies ub-taxonomies-${whereTo}`}
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

  return (
    <section
      className={`${
        className ? `${className} ` : ""
      }${equalHeightClass}${isPreservePostImageAspectRatio}ub-block-post-grid`}
      style={generateStyles(sectionStyles)}
    >
      <div
        className={`ub-post-grid-items ${
          postLayout === "list" ? "is-list" : `is-grid columns-${columns}`
        }`}
        style={generateStyles(gridStyles)}
      >
        {posts?.map((post, i) => {
          const { terms, isResolved } = getPostCategories(post);
          const shouldShowTerms =
            isResolved && !isEmpty(terms) && displayTaxonomy;
          return (
            <article
              style={generateStyles(postStyles)}
              key={i}
              id={`post-${post?.id}`}
              className={`post-${post?.id}${
                post?.featured_image_src && checkPostImage
                  ? " has-post-thumbnail"
                  : ""
              }
					`}
            >
              <>
                {checkPostImage && post?.featured_media ? (
                  <div
                    className="ub-block-post-grid-image"
                    style={generateStyles(imageStyles)}
                  >
                    <FeaturedImage
                      {...props}
                      imgID={post?.featured_media}
                      imgSizeLandscape={post?.featured_image_src}
                    />
                  </div>
                ) : null}
                <div
                  className="ub-block-post-grid-text"
                  style={generateStyles(contentStyles)}
                >
                  {shouldShowTerms &&
                    taxonomyPosition === "above-title" &&
                    renderTerms(taxonomyPosition, terms)}
                  <header className="ub_block-post-grid-header">
                    {checkPostTitle && (
                      <PostTag className="ub-block-post-grid-title">
                        <a
                          href={post?.link}
                          target="_blank"
                          rel="bookmark"
                          style={generateStyles(titleStyles)}
                        >
                          {decodeEntities(post?.title?.rendered?.trim()) ||
                            __("(Untitled)", "ultimate-blocks-pro")}
                        </a>
                      </PostTag>
                    )}
                    {checkPostAuthor && post?.author_info && (
                      <div
                        className="ub-block-post-grid-author"
                        style={generateStyles(authorStyles)}
                      >
                        <a
                          className="ub-text-link"
                          target="_blank"
                          href={post?.author_info?.author_link}
                        >
                          {post?.author_info?.display_name}
                        </a>
                      </div>
                    )}
                    {checkPostDate && (
                      <time
                        dateTime={moment(post?.date_gmt).utc().format()}
                        className={"ub-block-post-grid-date"}
                        style={generateStyles(dateStyles)}
                      >
                        {moment(post?.date_gmt)
                          .local()
                          .format("MMMM DD, Y", "ultimate-blocks-pro")}
                      </time>
                    )}
                    {shouldShowTerms &&
                      taxonomyPosition === "with-meta" &&
                      renderTerms(taxonomyPosition, terms)}
                  </header>
                  <div className="ub-block-post-grid-excerpt">
                    {checkPostExcerpt && !isEmpty(post?.excerpt?.rendered) && (
                      <div
                        className="ub-block-post-grid-excerpt-text"
                        dangerouslySetInnerHTML={{
                          __html: cateExcerpt(
                            post?.excerpt?.rendered,
                            excerptLength
                          ),
                        }}
                        style={generateStyles(excerptStyles)}
                      />
                    )}
                    {checkPostLink && (
                      <p>
                        <a
                          className="ub-block-post-grid-more-link ub-text-link"
                          href={post?.link}
                          target="_blank"
                          rel="bookmark"
                          style={generateStyles(linkStyles)}
                        >
                          {readMoreText}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </>
            </article>
          );
        })}
      </div>
      {pagination && paginationType === "number-pagination" && (
        <NewPostGridPagination {...props} styles={paginationStyles} />
      )}
      {pagination && paginationType === "load-more" && (
        <LoadMorePagination {...props} styles={paginationStyles} />
      )}
    </section>
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
