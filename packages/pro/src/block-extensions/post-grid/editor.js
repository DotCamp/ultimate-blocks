import FeaturedImage from "./image";
import moment from "moment";
import { getStyles } from "./get-styles";
import NewPostGridPagination from "./pagination";
// Setup the block
import { isEmpty } from "lodash";
import { __ } from "@wordpress/i18n";
import { decodeEntities } from "@wordpress/htmlEntities";
import { getTaxonomyTerms } from "./utils/get-terms";
import LoadMorePagination from "./loadMorePagination";

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
    },
    className,
    posts,
    taxonomies,
  } = props;

  const PostTag = postTitleTag;

  const styles = getStyles(props.attributes);
  const equalHeightClass = isEqualHeight ? " is-equal-height " : "";
  const isPreservePostImageAspectRatio = preservePostImageAspectRatio
    ? " preserve-post-image-aspect-ratio "
    : "";

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

  return (
    <section
      className={`${
        className ? `${className} ` : ""
      }${equalHeightClass}${isPreservePostImageAspectRatio}ub-block-post-grid`}
      style={styles}
    >
      <div
        className={`ub-post-grid-items ${
          postLayout === "list" ? "is-list" : `is-grid columns-${columns}`
        }`}
      >
        {posts?.map((post, i) => {
          const { terms, isResolved } = getPostCategories(post);
          const shouldShowTerms =
            isResolved && !isEmpty(terms) && displayTaxonomy;
          return (
            <article
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
                  <div className="ub-block-post-grid-image">
                    <FeaturedImage
                      {...props}
                      imgID={post?.featured_media}
                      imgSizeLandscape={post?.featured_image_src}
                    />
                  </div>
                ) : null}
                <div className="ub-block-post-grid-text">
                  {shouldShowTerms && taxonomyPosition === "above-title" && (
                    <div className="ub-block-post-grid-taxonomies ub-taxonomies-above-title">
                      {terms.map((term) => {
                        return (
                          <a
                            href={term.link}
                            className="ub-block-post-grid-taxonomy"
                          >
                            {term.name}
                          </a>
                        );
                      })}
                    </div>
                  )}
                  <header className="ub_block-post-grid-header">
                    {checkPostTitle && (
                      <PostTag className="ub-block-post-grid-title">
                        <a href={post?.link} target="_blank" rel="bookmark">
                          {decodeEntities(post?.title?.rendered?.trim()) ||
                            __("(Untitled)", "ultimate-blocks-pro")}
                        </a>
                      </PostTag>
                    )}
                    {checkPostAuthor && post?.author_info && (
                      <div className="ub-block-post-grid-author">
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
                      >
                        {moment(post?.date_gmt)
                          .local()
                          .format("MMMM DD, Y", "ultimate-blocks-pro")}
                      </time>
                    )}
                    {shouldShowTerms && taxonomyPosition === "with-meta" && (
                      <div className="ub-block-post-grid-taxonomies ub-taxonomies-with-meta">
                        {terms.map((term) => {
                          return (
                            <a
                              href={term.link}
                              className="ub-block-post-grid-taxonomy"
                            >
                              {term.name}
                            </a>
                          );
                        })}
                      </div>
                    )}
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
                      />
                    )}
                    {checkPostLink && (
                      <p>
                        <a
                          className="ub-block-post-grid-more-link ub-text-link"
                          href={post?.link}
                          target="_blank"
                          rel="bookmark"
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
        <NewPostGridPagination {...props} />
      )}
      {pagination && paginationType === "load-more" && (
        <LoadMorePagination {...props} />
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
