import React from "react";
import { __ } from "@wordpress/i18n";
import { v4 as uuidv4 } from "uuid";
import ProsConsContentLine from "./ProsConsContentLine";
import withContext from "./hoc/withContext";
import { RichText } from "@wordpress/block-editor";

/**
 * Create content object.
 *
 * @param {string}        [contentText=''] text
 * @param {string | null} [contentId=null] id
 * @return {Object} content object
 */
export const createContent = (contentText = "", contentId = null) => {
  return {
    id: contentId ?? uuidv4(),
    text: contentText,
  };
};

/**
 * Pros/Cons component column.
 *
 * @param {Object}   props                       component properties
 * @param {string}   props.columnType            type of column
 * @param {string}   props.title                 column title
 * @param {string}   props.titleBg               title background color
 * @param {string}   props.contentBg             content background color
 * @param {string}   props.colPosition           position of column relative to container
 * @param {boolean}  props.selected              column selected status
 * @param {Function} props.clickCallback         column click callback function
 * @param {Array}    props.content               column content
 * @param {Function} props.contentUpdateCallback content update callback
 * @param {Function} props.addEmptyLine          add an empty line, will be provided via HOC
 * @param {Function} props.setLineToRemove       mark a line as to be removed, will be provided via HOC
 * @param {string}   props.lineIconName          column specific icon name
 * @param {number}   props.lineIconSize          icon size
 * @param {string}   props.titleFontSize         title font size
 * @param {string}   props.lineIconColor         icon color
 * @param {boolean}  props.adaptiveBorder        adaptive border status
 */
function ProsConsColumn({
  columnType,
  title,
  titleBg,
  contentBg,
  colPosition,
  selected = false,
  clickCallback,
  content = [],
  contentUpdateCallback,
  addEmptyLine,
  setLineToRemove,
  lineIconName,
  lineIconSize,
  titleFontSize,
  lineIconColor,
  adaptiveBorder,
  updateTitleFallback,
}) {
  /**
   * Title style.
   *
   * @return {Object} style object
   */
  const titleStyle = () => {
    return {
      backgroundColor: titleBg,
      fontSize: `${titleFontSize}px`,
    };
  };

  /**
   * Content style.
   *
   * @return {Object} style object
   */
  const contentStyle = () => {
    return {
      backgroundColor: contentBg,
    };
  };

  /**
   * Handle various key events for content.
   *
   * @param {Object}  eventObject         event object
   * @param {string}  eventObject.code    current key code
   * @param {boolean} eventObject.ctrlKey ctrl key pressed status
   * @param {string}  contentId           current active content line id
   */
  const handleKeyEvents = ({ code, ctrlKey }, contentId) => {
    // create new line
    if (code === "Enter") {
      addEmptyLine();
    } else if (ctrlKey && code === "Backspace") {
      // delete line
      setLineToRemove(contentId);
    } else if (code === "Backspace") {
      // delete line if empty after backspace
      const { text } = getContentById(contentId);
      if (text === "") {
        setLineToRemove(contentId);
      }
    }
  };

  /**
   * Get content object by id.
   *
   * @param {string} contentId content id
   * @return {null | object} content object or null if no matching content found with given i
   */
  const getContentById = (contentId) => {
    let foundContentObj = null;

    // eslint-disable-next-line array-callback-return
    content.map((cObj) => {
      if (cObj.id === contentId) {
        foundContentObj = cObj;
      }
    });

    return foundContentObj;
  };

  /**
   * Generate wrapper styles.
   *
   * @return {Object} wrapper styles
   */
  const wrapperStyles = () => {
    const styleObj = {};
    if (adaptiveBorder) {
      styleObj.border = `1px solid ${titleBg}`;
    }

    return styleObj;
  };

  /**
   * Render content.
   *
   * @return {JSX.Element} content
   */
  const renderContent = () => {
    if (content.length > 0) {
      return (
        <table className={"content-table"}>
          {content.map((contentObj) => {
            return (
              <ProsConsContentLine
                lineChangedCallback={(text, id) => {
                  const sanitizedText = text.replaceAll("<br>", "");
                  contentUpdateCallback(createContent(sanitizedText, id));
                }}
                key={contentObj.id}
                {...contentObj}
                keyDownCallback={handleKeyEvents}
                lineIconSize={lineIconSize}
                lineIconName={lineIconName}
                lineIconColor={lineIconColor}
              />
            );
          })}
        </table>
      );
    }
    addEmptyLine();
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      data-pos={colPosition}
      data-column-type={columnType}
      className={"ub-pros-cons-column"}
      data-selected={JSON.stringify(selected)}
      onMouseDown={() => clickCallback(columnType)}
      style={wrapperStyles()}
    >
      <div style={titleStyle()} className={"column-title"}>
        <RichText
          tagName="span"
          value={title}
          onChange={updateTitleFallback}
          placeholder={
            columnType === "pros"
              ? __("Pros", "ultimate-blocks-pro")
              : __("Cons", "ultimate-blocks-pro")
          }
        />
      </div>
      <div style={contentStyle()} className={"column-content"}>
        {renderContent()}
      </div>
    </div>
  );
}

/**
 * Column types
 *
 * @type {Object}
 */
export const COLUMN_TYPES = {
  PROS: "pros",
  CONS: "cons",
};

// context map
const contextMap = ({ insertEmptyLineAfter, setLineToRemove }) => {
  return {
    addEmptyLine: insertEmptyLineAfter,
    setLineToRemove,
  };
};

/**
 * @module ProsConsColumn
 */
export default withContext(ProsConsColumn, contextMap);
