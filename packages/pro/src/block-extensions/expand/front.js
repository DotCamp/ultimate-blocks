document.addEventListener("DOMContentLoaded", () => {
  // Get all expand toggle buttons that were already initialized by the free version
  document.querySelectorAll(".ub-expand-toggle-button").forEach((instance) => {
    const addProFeatures = () => {
      const blockRoot = instance.closest(".ub-expand");

      const fadeElement = blockRoot?.querySelector(".ub-expand-partial > div");
      if (fadeElement) {
        fadeElement.classList.toggle("ub-fade");
      }
    };

    // Enhance click handler
    const originalClickHandler = instance.onclick;
    instance.addEventListener("click", (e) => {
      if (originalClickHandler) {
        originalClickHandler.call(instance, e);
      }
      addProFeatures();
    });

    // Enhance keydown handler
    instance.addEventListener("keydown", (e) => {
      if ([" ", "Enter"].includes(e.key)) {
        addProFeatures();
      }
    });
  });
});
