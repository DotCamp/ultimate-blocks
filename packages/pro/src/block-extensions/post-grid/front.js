function getNextPage(buttonWrapper, buttonWrapperIndex, button, buttonIndex) {
  const nextPage = button.href;
  const postGridWrapper = buttonWrapper.parentNode;
  const itemsWrapper = postGridWrapper.querySelector(".ub-post-grid-items");
  const url = new URL(nextPage);
  const searchParams = new URLSearchParams(url.search);
  const ubPage = searchParams.get("ub-page");

  const loaderContainer = document.createElement("div");
  loaderContainer.classList.add("ub-post-grid-loader");
  postGridWrapper.classList.add("is-loading");
  postGridWrapper.appendChild(loaderContainer);
  fetch(nextPage)
    .then((response) => response.text())
    .then((response) => {
      const parser = new DOMParser();
      const responseDocument = parser.parseFromString(response, "text/html");
      const newPostsWrapper = responseDocument.querySelectorAll(
        `.wp-block-ub-post-grid .ub-post-grid-items`
      )[buttonWrapperIndex];
      const paginationWrapper = responseDocument.querySelectorAll(
        `.wp-block-ub-post-grid .ub-post-grid-pagination`
      )[buttonWrapperIndex];
      const buttons = paginationWrapper.querySelectorAll("a.page-numbers");
      buttons.forEach((nextPageButton, nextPageButtonIndex) => {
        nextPageButton.addEventListener("click", (e) => {
          e.preventDefault();
          getNextPage(
            paginationWrapper,
            buttonWrapperIndex,
            nextPageButton,
            nextPageButtonIndex
          );
        });
      });
      itemsWrapper.replaceWith(newPostsWrapper);
      buttonWrapper.replaceWith(paginationWrapper);

      postGridWrapper.classList.remove("is-loading");
      postGridWrapper.removeChild(loaderContainer);

      let queryParams = new URLSearchParams(window.location.search);
      if (ubPage) {
        queryParams.set("ub-page", ubPage);
      } else {
        queryParams.delete("ub-page");
      }
      history.pushState(null, null, "?" + queryParams.toString());
    })
    .catch((error) => {
      console.error(error);
    });
}
let currentPage = 1;
function addNewPosts(buttonWrapper, wrapperIndex, button) {
  const url = new URL(location.href);
  const pagekey = "ub-page";
  const totalPages = Number(buttonWrapper.dataset.total_pages);
  url.searchParams.set(pagekey, currentPage + 1);
  const postsWrapper = buttonWrapper.previousElementSibling;
  const buttonInnerText = button.innerText;
  button.innerText = "Loading...";
  if (currentPage < totalPages) {
    fetch(url.href)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.text();
      })
      .then((responseText) => {
        const parser = new DOMParser();
        const responseDocument = parser.parseFromString(
          responseText,
          "text/html"
        );

        const newPostsWrapper =
          responseDocument.querySelectorAll(`.ub-post-grid-items`)[
            wrapperIndex
          ];

        const newPosts = newPostsWrapper.querySelectorAll(`article`);
        newPosts.forEach((post) => postsWrapper.appendChild(post));

        currentPage++;
        button.innerText = buttonInnerText;
        if (currentPage >= totalPages - 1) {
          buttonWrapper.style.display = "none";
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
}
window.addEventListener("DOMContentLoaded", () => {
  const paginationWrappers = document.querySelectorAll(
    ".ub-post-grid-pagination"
  );
  paginationWrappers.forEach((wrapper, wrapperIndex) => {
    if (wrapper.classList.contains("ub-number-pagination")) {
      const buttons = wrapper.querySelectorAll("a.page-numbers");
      buttons.forEach((button, buttonIndex) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          getNextPage(wrapper, wrapperIndex, button, buttonIndex);
        });
      });
    } else {
      const loadMoreButton = wrapper.querySelector(".ub-load-more-button");
      loadMoreButton.addEventListener("click", () => {
        addNewPosts(wrapper, wrapperIndex, loadMoreButton);
      });
    }
  });
});
