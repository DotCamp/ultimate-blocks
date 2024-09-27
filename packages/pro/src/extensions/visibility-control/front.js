window.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll("[data-is-schedule-enabled]");
  wrappers.forEach((wrapper) => {
    const isScheduleEnable =
      wrapper.getAttribute("data-is-schedule-enabled") === "true";
    if (!isScheduleEnable) return;
    const hideWhenTimeScheduleApplied =
      wrapper.getAttribute("data-hide-when-schedule-applied") === "true";
    const currentTime = wrapper.getAttribute("data-current-time");
    const hideBlockFromTime = wrapper.getAttribute("data-hide-block-from-time");
    const hideBlockToTime = wrapper.getAttribute("data-hide-block-to-time");
    const currentTimeInMs = new Date(currentTime).getTime();
    const hideBlockFromTimeInMs = new Date(hideBlockFromTime).getTime();
    const hideBlockToTimeInMs = new Date(hideBlockToTime).getTime();
    const isBlockInSchedule =
      currentTimeInMs >= hideBlockFromTimeInMs &&
      currentTimeInMs <= hideBlockToTimeInMs;
    if (hideWhenTimeScheduleApplied && isBlockInSchedule) {
      wrapper.remove();
    }

    if (!hideWhenTimeScheduleApplied && !isBlockInSchedule) {
      wrapper.remove();
    }
  });
});
