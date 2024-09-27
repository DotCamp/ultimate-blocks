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

function ub_getSiblings(element, criteria) {
  const children = Array.prototype.slice
    .call(element.parentNode.children)
    .filter((child) => child !== element);
  return criteria ? children.filter(criteria) : children;
}

Array.prototype.slice
  .call(document.getElementsByClassName("ub-expand-toggle-button"))
  .forEach((instance) => {
    if (instance.getAttribute("aria-controls") === "") {
      const blockID = instance.parentElement.parentElement.id.slice(10);

      instance.setAttribute("aria-controls", `ub-expand-full-${blockID}`);
      if (instance.parentElement.classList.contains("ub-expand-full")) {
        instance.parentElement.setAttribute("id", `ub-expand-full-${blockID}`);
      }
    }

    const togglePanel = () => {
      const blockRoot = instance.closest(".ub-expand");

      const showButton = blockRoot.querySelector(
        ".ub-expand-partial>.ub-expand-toggle-button"
      );

      const fullPanel = blockRoot.querySelector(".ub-expand-full");
      if (instance.parentElement.classList.contains("ub-expand-partial")) {
        showButton.classList.add("ub-hide");
        fullPanel.classList.remove("ub-hide");
      } else {
        showButton.classList.remove("ub-hide");
        fullPanel.classList.add("ub-hide");
      }

      if (blockRoot.querySelector(".ub-expand-partial > div")) {
        blockRoot
          .querySelector(".ub-expand-partial > div")
          .classList.toggle("ub-fade");
      }
    };

    instance.addEventListener("click", togglePanel);

    instance.addEventListener("keydown", (e) => {
      if ([" ", "Enter"].indexOf(e.key) > -1) {
        e.preventDefault();
        togglePanel();
        Array.prototype.slice
          .call(instance.parentElement.parentElement.children)
          .filter((a) => a !== instance.parentElement)[0]
          .querySelector(
            `[aria-controls="${instance.getAttribute("aria-controls")}"]`
          )
          .focus();
      }
    });
  });
