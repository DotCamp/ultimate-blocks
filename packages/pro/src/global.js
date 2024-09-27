import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

export const allIcons = Object.assign(fas, fab);

export const removeIcon = (
  <svg
    width="20px"
    height="20px"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m50 2.5c-26.199 0-47.5 21.301-47.5 47.5s21.301 47.5 47.5 47.5 47.5-21.301 47.5-47.5-21.301-47.5-47.5-47.5zm24.898 62.301l-10.199 10.199-14.801-14.801-14.801 14.801-10.199-10.199 14.801-14.801-14.801-14.801 10.199-10.199 14.801 14.801 14.801-14.801 10.199 10.199-14.801 14.801z" />
  </svg>
);

export const dashesToCamelcase = (str) =>
  str
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");

/**
 * Generate icon element.
 *
 * @param {string |Array } selectedIcon selected icon, array for icon element, string for icon name
 * @param {number}         size         size
 * @param {string}         [unit=px]    size unit
 * @return {JSX.Element} icon element
 */
export const generateIcon = (selectedIcon, size, unit = "px") => {
  if (typeof selectedIcon === "string") {
    selectedIcon = allIcons[`fa${dashesToCamelcase(selectedIcon)}`];
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={`${size}${unit === "em" ? "em" : ""}`}
      width={`${size}${unit === "em" ? "em" : ""}`}
      viewBox={`0, 0, ${selectedIcon.icon[0]}, ${selectedIcon.icon[1]}`}
    >
      <path fill={"currentColor"} d={selectedIcon.icon[4]} />
    </svg>
  );
};

export const mergeRichTextArray = (input) =>
  input
    .map((item) => (typeof item === "string" ? item : richTextToHTML(item)))
    .join("");

export const getDescendantBlocks = (rootBlock) => {
  const descendants = [];
  rootBlock.innerBlocks.forEach((innerBlock) => {
    descendants.push(innerBlock);
    if (innerBlock.innerBlocks.length > 0) {
      descendants.push(...getDescendantBlocks(innerBlock));
    }
  });
  return descendants;
};

export const splitArrayIntoChunks = (inputArray, chunkSize) =>
  //from Andrei R, https://stackoverflow.com/a/37826698
  inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

export const splitArray = (sourceArray, condition) => {
  const passArray = [];
  const failArray = [];

  sourceArray.forEach((item) => {
    if (condition(item)) {
      passArray.push(item);
    } else {
      failArray.push(item);
    }
  });

  return [passArray, failArray];
};
