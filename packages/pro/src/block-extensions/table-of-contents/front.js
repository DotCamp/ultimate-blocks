if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

function ub_hashHeaderScroll(scrollType = "auto", target = "", offset = 0) {
  if (window.location.hash) {
    const targetHeading = document.getElementById(
      window.location.hash.slice(1)
    );

    let probableHeaders;

    try {
      probableHeaders = document.elementsFromPoint(window.innerWidth / 2, 0);
    } catch (e) {
      probableHeaders = document.msElementsFromPoint(window.innerWidth / 2, 0);
    }

    const stickyHeaders = Array.prototype.slice
      .call(probableHeaders)
      .filter((e) =>
        ["fixed", "sticky"].includes(window.getComputedStyle(e).position)
      );

    const stickyHeaderHeights = stickyHeaders.map((h) => h.offsetHeight);

    const deficit =
      targetHeading.getBoundingClientRect().y ||
      targetHeading.getBoundingClientRect().top;

    switch (scrollType) {
      default:
        window.scrollBy(0, deficit);
        break;
      case "off":
        window.scrollBy(0, deficit);
        break;
      case "auto":
        window.scrollBy(
          0,
          deficit -
            (stickyHeaders.length
              ? Math.max.apply(Math, stickyHeaderHeights)
              : 0)
        );
        break;
      case "fixedamount":
        window.scrollBy(0, deficit - offset);
        break;
      case "namedelement":
        window.scrollBy(
          0,
          deficit -
            (document.querySelector(target)
              ? document.querySelector(target).offsetHeight
              : 0)
        );
        break;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  let instances = [];
  if (document.getElementById("ub_table-of-contents-toggle-link")) {
    instances.push(document.getElementById("ub_table-of-contents-toggle-link"));
  } else {
    instances = Array.prototype.slice.call(
      document.getElementsByClassName("ub_table-of-contents-toggle-link")
    );
  }
  //also push ToC toggle icon instances here?

  instances = instances.concat(
    Array.prototype.slice.call(
      document.getElementsByClassName(
        "ub_table-of-contents-toggle-icon-container"
      )
    )
  );

  instances.forEach((instance) => {
    const block = instance.closest(".ub_table-of-contents");

    const tocContainer = block.querySelector(".ub_table-of-contents-container");
    const containerStyle = tocContainer.style;

    const tocExtraContainer = block.querySelector(
      ".ub_table-of-contents-extra-container"
    );
    const extraContainerStyle = tocExtraContainer.style;

    const tocMain = tocExtraContainer.parentNode;
    const mainStyle = block.style;

    const showButton = block.getAttribute("data-showtext") || "show";
    const hideButton = block.getAttribute("data-hidetext") || "hide";

    tocContainer.removeAttribute("style");

    let padding = 60;

    function mobileEvent(mql) {
      if (mql.matches) {
        if (!tocMain.classList.contains("ub_table-of-contents-collapsed")) {
          tocMain.classList.add("ub_table-of-contents-collapsed");
          if (
            instance.classList.contains("ub_table-of-contents-toggle-link") ||
            instance.id === "ub_table-of-contents-toggle-link"
          ) {
            instance.innerHTML = showButton;
          }
          tocContainer.classList.add("ub-hide");
        }
      } else {
        if (JSON.parse(tocMain.dataset.initiallyshow)) {
          tocMain.classList.remove("ub_table-of-contents-collapsed");
          if (
            instance.classList.contains("ub_table-of-contents-toggle-link") ||
            instance.id === "ub_table-of-contents-toggle-link"
          ) {
            instance.innerHTML = hideButton;
          }
          tocContainer.classList.remove("ub-hide");
        }
      }
    }

    let mobileQuery = window.matchMedia("(max-width: 800px)");

    if (JSON.parse(block.getAttribute("data-initiallyhideonmobile"))) {
      mobileQuery.addListener(mobileEvent);
    }

    instance.addEventListener("click", function (event) {
      event.preventDefault();
      const curWidth = block.offsetWidth;

      if (block.classList.contains("ub_table-of-contents-collapsed")) {
        //begin showing
        tocExtraContainer.classList.remove("ub-hide");
        tocContainer.classList.remove("ub-hide");
        const targetHeight = tocExtraContainer.offsetHeight + padding / 2; //doesn't include padding
        tocContainer.classList.add("ub-hiding");
        tocExtraContainer.classList.add("ub-hiding");
        mainStyle.width = `${curWidth}px`; //also take into account number of columns

        setTimeout(() => {
          mainStyle.width = "auto";
          block.classList.remove("ub_table-of-contents-collapsed");
          const fullWidth = getComputedStyle(block).width.slice(0, -2);
          mainStyle.width = `${curWidth}px`;

          setTimeout(() => {
            Object.assign(containerStyle, {
              height: `${targetHeight}px`,
              width: "100px",
            });
            Object.assign(extraContainerStyle, {
              height: `${targetHeight}px`,
              width: "100px",
            });
            tocContainer.classList.remove("ub-hiding");
            tocExtraContainer.classList.remove("ub-hiding");

            mainStyle.width = `${fullWidth}px`;

            setTimeout(() => {
              tocContainer.style.width = `${fullWidth - padding}px`;
              tocExtraContainer.style.width = `${fullWidth - padding}px`;
            }, 50);
          }, 50);
        }, 50);
      } else {
        //begin hiding
        mainStyle.width = `${block.offsetWidth}px`;
        Object.assign(containerStyle, {
          height: `${tocContainer.offsetHeight}px`,
          width: `${tocContainer.offsetWidth}px`,
        });
        Object.assign(extraContainerStyle, {
          height: `${tocExtraContainer.offsetHeight}px`,
          width: `${tocExtraContainer.offsetWidth}px`,
        });

        setTimeout(() => {
          tocContainer.classList.add("ub-hiding");
          Object.assign(containerStyle, {
            height: "0",
            width: "0",
          });
          Object.assign(extraContainerStyle, {
            height: "0",
            width: "0",
          });
          block.classList.add("ub_table-of-contents-collapsed");

          padding =
            parseInt(
              getComputedStyle(tocExtraContainer).paddingLeft.slice(0, -2)
            ) +
            parseInt(
              getComputedStyle(tocExtraContainer).paddingRight.slice(0, -2)
            );

          //measure width of toc title + toggle button, then use it as width of block

          mainStyle.width = `${
            5 +
            padding +
            instance.closest(".ub_table-of-contents-header-container")
              .scrollWidth
          }px`;
        }, 50);
      }

      if (
        instance.classList.contains("ub_table-of-contents-toggle-link") ||
        instance.id === "ub_table-of-contents-toggle-link"
      ) {
        instance.innerHTML = tocContainer.classList.contains("ub-hiding")
          ? hideButton
          : showButton;
      } else {
        if (
          instance.children[0].classList.contains(
            "ub_table-of-contents-plus-part"
          )
        ) {
          instance.children[0].classList.toggle("ub_horizontal_bar");
          instance.children[0].classList.toggle("ub_vertical_bar");
          instance.children[1].classList.toggle("ub_vertical_bar");
        } else {
          instance.children[0].classList.toggle("ub_asc_diagonal_bar");
          instance.children[0].classList.toggle("ub_desc_diagonal_bar");
          instance.children[1].classList.toggle("ub_asc_diagonal_bar");
          instance.children[1].classList.toggle("ub_desc_diagonal_bar");
        }
      }

      mobileQuery.removeListener(mobileEvent);
    });

    tocContainer.addEventListener("transitionend", function () {
      if (tocContainer.offsetHeight === 0) {
        //hiding is done
        tocContainer.classList.remove("ub-hiding");
        tocContainer.classList.add("ub-hide");
        tocExtraContainer.classList.remove("ub-hiding");
        tocExtraContainer.classList.add("ub-hide");
        if (containerStyle.display === "block") {
          containerStyle.display = "";
        }
        if (extraContainerStyle.display === "block") {
          extraContainerStyle.display = "";
        }
        mainStyle.minWidth = "";
      }
      Object.assign(containerStyle, {
        height: "",
        width: "",
      });
      Object.assign(extraContainerStyle, {
        height: "",
        width: "",
      });
      mainStyle.width = "";
    });
  });
  if (window.location.hash) {
    const sourceToC = document.querySelector(".ub_table-of-contents");
    if (sourceToC) {
      const type = sourceToC.dataset.scrolltype;
      const offset =
        type === "fixedamount" ? sourceToC.dataset.scrollamount : 0;
      const target =
        type === "namedelement" ? sourceToC.dataset.scrolltarget : "";
      setTimeout(() => ub_hashHeaderScroll(type, target, offset), 50);
    }
  }
});

window.onhashchange = function () {
  const sourceToC = document.querySelector(".ub_table-of-contents");
  if (sourceToC) {
    const type = sourceToC.dataset.scrolltype;
    const offset = type === "fixedamount" ? sourceToC.dataset.scrollamount : 0;
    const target =
      type === "namedelement" ? sourceToC.dataset.scrolltarget : "";
    ub_hashHeaderScroll(type, target, offset);
  }
};

Array.prototype.slice
  .call(document.querySelectorAll(".ub_table-of-contents-container li > a"))
  .forEach((link) => {
    link.addEventListener("click", (e) => {
      const hashlessLink = link.href.replace(link.hash, "");
      const targetPageNumber = /[?&]page=\d+/g.exec(hashlessLink);
      const currentPageNumber = /[?&]page=\d+/g.exec(window.location.search);
      if (
        window.location.href.includes(hashlessLink) &&
        (currentPageNumber === null ||
          (targetPageNumber && currentPageNumber[0] === targetPageNumber[0]))
      ) {
        const tocData = link.closest(".ub_table-of-contents").dataset;
        const type = tocData.scrolltype;
        const offset = type === "fixedamount" ? tocData.scrollamount : 0;
        const target = type === "namedelement" ? tocData.scrolltarget : "";
        e.preventDefault();
        history.pushState(null, "", link.hash);
        ub_hashHeaderScroll(type, target, offset);
      }
    });
  });

function stickyTOC(element) {
  function createStickyTOC() {
    const tocPosition = element.dataset.sticky_toc_position;
    const tocWidth = element.dataset.sticky_toc_width;
    const buttonIcon = element.dataset.sticky_button_icon;
    const buttonColor = element.dataset.sticky_button_color;

    const stickyTOCWrapper = document.createElement("div");
    stickyTOCWrapper.classList.add("ub_sticky-toc-wrapper");
    stickyTOCWrapper.style.width = tocWidth + "px";
    if (Number(tocPosition) > 50) {
      stickyTOCWrapper.classList.add("ub_sticky-toc-right");
      stickyTOCWrapper.style.right = 100 - Number(tocPosition) + "%";
    } else if (Number(tocPosition) < 50) {
      stickyTOCWrapper.style.left = tocPosition + "%";
      stickyTOCWrapper.classList.add("ub_sticky-toc-left");
    }

    const stickyTOCButton = document.createElement("button");
    stickyTOCButton.classList.add("ub_sticky-toc-button");
    stickyTOCButton.style.borderColor = buttonColor;
    stickyTOCButton.innerHTML = buttonIcon;

    stickyTOCWrapper.appendChild(stickyTOCButton);

    const stickyTOCElement = element.cloneNode(true);
    stickyTOCElement.classList.add("ub_sticky-toc");
    stickyTOCElement.classList.add("ub_sticky-toc-zoom-out");
    const closeStickyTOCElement = document.createElement("span");
    closeStickyTOCElement.classList.add("ub_close-sticky-button");
    closeStickyTOCElement.innerHTML = `
    <svg
    width="20px"
    height="20px"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    >
    <path d="m50 2.5c-26.199 0-47.5 21.301-47.5 47.5s21.301 47.5 47.5 47.5 47.5-21.301 47.5-47.5-21.301-47.5-47.5-47.5zm24.898 62.301l-10.199 10.199-14.801-14.801-14.801 14.801-10.199-10.199 14.801-14.801-14.801-14.801 10.199-10.199 14.801 14.801 14.801-14.801 10.199 10.199-14.801 14.801z" />
    </svg>
    `;
    if (Number(tocPosition) >= 100) {
      stickyTOCButton.style.transform = "translate(-100%,-50%)";
    }
    if (Number(tocPosition) > 50) {
      stickyTOCWrapper.style.right = 100 - Number(tocPosition) + "%";
    }
    if (Number(tocPosition) === 50) {
      stickyTOCWrapper.style.left = tocPosition + "%";
      stickyTOCWrapper.style.transform = "translate(-50%,-50%)";
    }
    stickyTOCElement.appendChild(closeStickyTOCElement);

    closeStickyTOCElement.addEventListener("click", () => {
      stickyTOCElement.style.display = "none";
      stickyTOCButton.style.display = "block";
      stickyTOCButton.classList.remove("ub_sticky-toc-zoom-in");
      stickyTOCButton.classList.add("ub_sticky-toc-zoom-out");
      stickyTOCElement.classList.remove("ub_sticky-toc-zoom-out");
      stickyTOCElement.classList.add("ub_sticky-toc-zoom-in");
    });
    stickyTOCButton.addEventListener("click", () => {
      stickyTOCElement.style.display = "grid";
      stickyTOCButton.style.display = "none";
      stickyTOCButton.classList.add("ub_sticky-toc-zoom-in");
      stickyTOCElement.classList.add("ub_sticky-toc-zoom-out");
    });
    stickyTOCWrapper.appendChild(stickyTOCElement);
    return stickyTOCWrapper;
  }
  const createdStickyTOC = createStickyTOC();
  function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      const isHideOnMobile = element.dataset.hide_sticky_on_mobile === "true";
      const hideTOCOnMobile = isHideOnMobile && document.body.clientWidth < 681;
      const isStickyOnDocument = document.querySelector(
        ".ub_sticky-toc-wrapper"
      );

      if (createdStickyTOC) {
        if (entry.isIntersecting) {
          if (isStickyOnDocument) {
            document.body.removeChild(createdStickyTOC);
          }
        } else {
          if (!hideTOCOnMobile) {
            document.body.appendChild(createdStickyTOC);
          }
        }
      }
    });
  }

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver(handleIntersection, options);

  observer.observe(element);
}

document.addEventListener("DOMContentLoaded", () => {
  const tableOfContents = document.querySelectorAll(".ub_table-of-contents");

  tableOfContents.forEach((element) => {
    const isSticky = element.dataset.is_sticky === "true";
    if (isSticky) {
      stickyTOC(element);
    }
  });
  // Link to divider block.
  const dividers = document.querySelectorAll(
    ".wp-block-ub-divider:not(.ub-divider-orientation-vertical)"
  );
  if (tableOfContents.length > 0 && dividers.length > 0) {
    dividers.forEach((divider) => {
      let closestTOC = null;
      let minDistance = Infinity;

      tableOfContents.forEach((toc) => {
        const isLinkedToDivider =
          toc.getAttribute("data-linktodivider") === "true" ? true : false;
        const isSticky =
          toc.getAttribute("data-is_sticky") === "true" ? true : false;

        if (!isLinkedToDivider || isSticky) {
          return;
        }
        const dividerTop = divider.getBoundingClientRect().top;
        const tocTop = toc.getBoundingClientRect().top;
        const distance = Math.abs(dividerTop - tocTop);
        if (distance < minDistance) {
          minDistance = distance;
          closestTOC = toc;
        }
      });

      if (closestTOC) {
        const linkToTOC = document.createElement("a");
        linkToTOC.href = `#${closestTOC.getAttribute("id")}`;
        linkToTOC.classList.add("ub-linked-to-toc");
        linkToTOC.innerText = "Table Of Contents";
        divider.appendChild(linkToTOC);
      }
    });
  }
});
