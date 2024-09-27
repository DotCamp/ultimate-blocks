import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  Fragment,
} from "react";
import ProsConsColumn, { COLUMN_TYPES, createContent } from "./ProsConsColumn";
import { __ } from "@wordpress/i18n";
import ProsConsEditor from "./ProsConsEditor";
import withProMainStore from "@Stores/proStore/hoc/withProMainStore.js";
import GraphLayout from "./graph/GraphLayout";
import OverlayControlsPortalProvider from "./OverlayControlsPortalProvider";
import BaseOverlayControls from "./BaseOverlayControls";

/**
 * Context data for pros/cons component.
 *
 * @type {Object}
 */
export const ProsConsContext = createContext({
  activeLineId: null,
});

/**
 * Pros/Cons review component.
 *
 * @param {Object}   props               component properties
 * @param {Object}   props.attributes    component attributes
 * @param {Function} props.setAttributes attribute update function
 * @param {boolean}  props.isBlockActive is block active
 * @param {Object}   props.layoutTypes   available layout types, will be supplied via HOC
 * @function Object() { [native code] }
 */
function ProsCons({
  attributes,
  setAttributes,
  isBlockActive,
  layoutTypes,
  rootBlock,
}) {
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [activeLineId, setActiveLineId] = useState(null);
  const [activeLineType, setActiveLineType] = useState(null);
  const [lineToRemove, setLineToRemove] = useState(null);
  const [wrapperStyles, setWrapperStyles] = useState({});
  const [overlayControlRef, setOverlayControlRef] = useState(null);

  const wrapperRef = useRef(null);

  const titleTranslations = {
    [COLUMN_TYPES.PROS]:
      attributes?.prosTitle ?? __("pros", "ultimate-blocks-pro"),
    [COLUMN_TYPES.CONS]:
      attributes?.consTitle ?? __("cons", "ultimate-blocks-pro"),
  };
  const titleAttributeKeys = {
    [COLUMN_TYPES.PROS]: "prosTitle",
    [COLUMN_TYPES.CONS]: "consTitle",
  };

  // remove line active effects on block deselect
  useEffect(() => {
    if (!rootBlock) {
      if (!isBlockActive) {
        setActiveLineId(null);
      }
    }
  }, [isBlockActive]);

  // set active line element to null based on value of active line id
  useEffect(() => {
    if (!rootBlock) {
      setActiveLineType(getLineType(activeLineId));
    }
  }, [activeLineId]);

  // deselect any content line on updates related to destructured object values
  const {
    prosContent,
    consContent,
    prosGraphContent,
    consGraphContent,
    ...rest
  } = attributes;
  useEffect(() => {
    if (!rootBlock) {
      prepareWrapperStyles();
      setActiveLineId(null);
    }
  }, Object.values(rest));

  /**
   * Get which column target line belongs to.
   *
   * @param {string} lineId line id
   * @return {null|string} column type, null if no associated column find with supplied line id
   */
  const getLineType = (lineId) => {
    let columnType = null;
    if (lineId !== null) {
      const availableColumnTypes = Object.values(COLUMN_TYPES);

      for (let i = 0; i < availableColumnTypes.length; i++) {
        const currentType = availableColumnTypes[i];
        const columnContent = attributeValueMapResolver("content", currentType);

        const status = columnContent.some(({ id }) => {
          return id === lineId;
        });

        if (status) {
          i = availableColumnTypes.length;
          columnType = currentType;
        }
      }
    }

    return columnType;
  };

  /**
   * Get index of target line.
   *
   * @param {string} lineId line id
   */
  const getLineIndex = (lineId) => {
    let lineIndex = null;

    if (lineId) {
      const activeColumnType = getLineType(lineId);

      if (activeColumnType) {
        const columnContent = attributeValueMapResolver(
          "content",
          activeColumnType
        );

        // eslint-disable-next-line array-callback-return
        columnContent.map(({ id }, index) => {
          if (id === lineId) {
            lineIndex = index;
          }
        });
      }
    }

    return lineIndex;
  };

  /**
   * Callback for column select.
   *
   * @param {string} colType column type
   */
  const columnClickHandler = (colType) => {
    if (isColumnTypeValid(colType)) {
      setSelectedColumn(colType);
    } else {
      throw new Error(`invalid column type is supplied: ${colType}`);
    }
  };

  /**
   * Whether supplied column type is active one or not.
   *
   * @param {string} colType column type
   * @return {boolean} active status
   */
  const isColumnSelected = (colType) => {
    return isBlockActive && colType === selectedColumn;
  };

  /**
   * Column type validation
   *
   * @param {string | null} targetType target type to check, if null is supplied, will be considered a valid column type
   * @param {boolean}       throwError whether to throw error on invalid types
   * @return {boolean} validation status
   */
  const isColumnTypeValid = (targetType, throwError = true) => {
    const validationStatus =
      targetType === null || Object.values(COLUMN_TYPES).includes(targetType);

    if (!validationStatus && throwError) {
      throw new Error(`invalid column type is supplied: ${targetType}`);
    }

    return validationStatus;
  };

  /**
   * Capitalize value.
   *
   * @param {string} val value
   * @return {string} capitalized value
   */
  const capitalize = (val) => {
    return val[0].toUpperCase() + val.split("").slice(1).join("");
  };

  /**
   * Form a valid pros/cons column attribute key.
   *
   * @param {string}        attrKey    base attribute name
   * @param {string | null} columnType column type, if null is supplied, no column specific resolve will be applied
   * @return {string} attribute key
   */
  const attributeKeyResolver = (attrKey, columnType) => {
    if (columnType === null) {
      return attrKey;
    }

    return `${columnType}${capitalize(attrKey)}`;
  };

  /**
   * Resolve target attribute value based on column type.
   *
   * @param {string} attrKey    attribute name
   * @param {string} columnType column type
   * @return {any} attribute value
   */
  const attributeValueMapResolver = (attrKey, columnType = null) => {
    if (isColumnTypeValid(columnType)) {
      const rawValue = attributes[attributeKeyResolver(attrKey, columnType)];

      switch (attrKey) {
        case "content":
          return parseContents(rawValue);
        default:
          return rawValue;
      }
    }
  };

  /**
   * Function generator for attribute values related to column types
   *
   * @param {string} columnType column type
   * @return {Function} column attribute resolver
   */
  const columnAttributeValueMapResolverGenerator =
    (columnType) => (attrKey) => {
      return attributeValueMapResolver(attrKey, columnType);
    };

  /**
   * Parse contents into content objects.
   *
   * @param {Array[string]} contentArray content array
   * @return {Array[Object]} content object array
   */
  const parseContents = (contentArray) => {
    return contentArray.map(JSON.parse);
  };

  /**
   * Resolve target attribute update based on column type.
   *
   * @param {string}   key            attribute name
   * @param {string}   columnType     column type
   * @param {any}      newValue       new attribute value
   * @param {null|any} extraArguments extra arguments
   */
  const attributeUpdateMapResolver = (
    key,
    columnType,
    newValue,
    extraArguments = null
  ) => {
    let attributeObject = {};

    if (key === "addContent") {
      attributeObject = addContent(columnType, newValue, extraArguments);
    }
    if (key === "content") {
      attributeObject = createContentUpdateArray(columnType, newValue);
    }

    setAttributes(attributeObject);
  };

  /**
   * Update atttribute related to column type.
   *
   * @param {string} columnType column type
   * @param {string} attrKey    attribute name
   * @param {any}    value      attribute value
   */
  const columnAttributeUpdateResolver = (columnType, attrKey, value) => {
    const attributeObject = {
      [attributeKeyResolver(attrKey, columnType)]: value,
    };

    setAttributes(attributeObject);
  };

  /**
   * Create an array suitable for attribute update.
   *
   * @param {string}        columnType   column type
   * @param {Array[Object]} contentArray content array
   * @return {Array[Object]} attribute update array
   */
  const createContentUpdateArray = (columnType, contentArray) => {
    return {
      [attributeKeyResolver("content", columnType)]: contentArray.map((cObj) =>
        JSON.stringify(cObj)
      ),
    };
  };

  /**
   * Update column contents.
   *
   * @param {string}        columnType    column type
   * @param {Object}        contentObject content data object
   * @param {null | number} contentIndex  content index to add
   */
  const addContent = (columnType, contentObject, contentIndex = null) => {
    let typeContents = attributeValueMapResolver("content", columnType);

    if (!Array.isArray(typeContents)) {
      typeContents = [];
    }

    let editIndex = -1;
    const isEditing = typeContents.some(({ id }, currentIndex) => {
      const status = id === contentObject.id;

      if (status) {
        editIndex = currentIndex;
      }

      return status;
    });

    if (!isEditing) {
      if (contentIndex === null) {
        typeContents.push(contentObject);
      } else {
        typeContents.splice(contentIndex, 0, contentObject);
      }
    } else {
      typeContents[editIndex].text = contentObject.text;
    }

    return createContentUpdateArray(columnType, typeContents);
  };

  /**
   * Delete content.
   *
   * @param {string} contentId content line id
   */
  const deleteTargetContent = (contentId) => {
    const columnType = getLineType(contentId);

    if (columnType !== null) {
      const targetContentArray = attributeValueMapResolver(
        "content",
        columnType
      );

      if (targetContentArray.length > 0) {
        let deleteIndex = -1;

        // eslint-disable-next-line array-callback-return
        targetContentArray.map(({ id }, currentIndex) => {
          if (id === contentId) {
            deleteIndex = currentIndex;
          }
        });

        if (deleteIndex >= 0) {
          targetContentArray.splice(deleteIndex, 1);
        }

        attributeUpdateMapResolver("content", columnType, targetContentArray);
      }
    }

    // reset removal line id
    setLineToRemove(null);
  };

  /**
   * Handle any click event within component.
   */
  const handleAnyClick = () => {
    setActiveLineId(null);
  };

  /**
   * Insert an empty line after current active line.
   */
  const insertEmptyLineAfter = () => {
    const emptyContent = createContent();
    attributeUpdateMapResolver(
      "addContent",
      activeLineType,
      emptyContent,
      getLineIndex(activeLineId) + 1
    );

    setActiveLineId(emptyContent.id);
  };

  /**
   * Wrapper styles.
   */
  const prepareWrapperStyles = () => {
    const fontSize = attributeValueMapResolver("fontSize");
    setWrapperStyles({
      fontSize: `${fontSize}px`,
    });
  };

  /**
   * Context data.
   *
   * @type {Object}
   */
  const contextData = {
    activeLineId,
    selectedColumn,
    relativeWrapper: wrapperRef.current,
    setActiveLineId,
    insertEmptyLineAfter,
    deleteTargetContent,
    lineToRemove,
    setLineToRemove,
    attributeValueMapResolver,
    columnAttributeValueMapResolverGenerator,
    columnAttributeUpdateResolver,
    titleTranslations,
    overlayControlRef,
    setOverlayControlRef,
    titleAttributeKeys,
  };

  /**
   * Status of adaptive border.
   *
   * @return {boolean} status
   */
  const adaptiveBorderStatus = () => {
    const advancedControlsStatus = attributeValueMapResolver(
      "prosConsAdvancedControls"
    );
    const adaptiveBorderControlValue = attributeValueMapResolver(
      "prosConsAdaptiveBorder"
    );

    return advancedControlsStatus && adaptiveBorderControlValue;
  };

  /**
   * Render main block content.
   *
   * @return {JSX.Element} block content
   */
  const renderBlockContent = () => {
    const { prosConsPositionData } = attributes;
    const currentLayout = attributeValueMapResolver("prosConsLayout");

    switch (currentLayout) {
      case layoutTypes.GRAPH:
        return <GraphLayout />;
      case layoutTypes.BASIC:
      case layoutTypes.CARD:
        return (
          <Fragment>
            <BaseOverlayControls />
            {Object.keys(prosConsPositionData)
              .filter((key) => {
                return Object.prototype.hasOwnProperty.call(
                  prosConsPositionData,
                  key
                );
              })
              .map((position) => {
                const columnType = prosConsPositionData[position];
                /**
                 * Wrapper function for attributeValueMapResolver
                 *
                 * @param {string} attrKey attribute key
                 * @return {any} value
                 */
                const attributeValFetch = (attrKey) => {
                  return attributeValueMapResolver(attrKey, columnType);
                };

                /**
                 * Wrapper function for attributeUpdateMapResolver
                 *
                 * @param {string} attrKey   attribute key
                 * @param {any}    newValue  new value
                 * @param {any}    extraArgs extra arguments
                 */
                const attributeValUpdate = (
                  attrKey,
                  newValue,
                  extraArgs = null
                ) => {
                  return attributeUpdateMapResolver(
                    attrKey,
                    columnType,
                    newValue,
                    extraArgs
                  );
                };

                return (
                  <ProsConsColumn
                    key={position}
                    colPosition={position}
                    columnType={prosConsPositionData[position]}
                    titleBg={attributeValFetch("titleBg")}
                    contentBg={attributeValFetch("contentBg")}
                    lineIconName={attributeValFetch("icon")}
                    lineIconSize={attributeValueMapResolver("iconSize")}
                    titleFontSize={attributeValueMapResolver("titleFontSize")}
                    lineIconColor={attributeValFetch("titleBg")}
                    title={titleTranslations[columnType]}
                    updateTitleFallback={(newValue) => {
                      setAttributes({
                        [titleAttributeKeys[columnType]]: newValue,
                      });
                    }}
                    selected={isColumnSelected(columnType)}
                    clickCallback={columnClickHandler}
                    content={attributeValFetch("content")}
                    contentUpdateCallback={(contentObj, index) => {
                      setActiveLineId(contentObj.id);
                      attributeValUpdate("addContent", contentObj, index);
                    }}
                    adaptiveBorder={adaptiveBorderStatus()}
                  />
                );
              })}
          </Fragment>
        );
    }
  };

  return (
    <ProsConsContext.Provider value={contextData}>
      <ProsConsEditor
        attributes={attributes}
        setAttributes={setAttributes}
        rootBlock={rootBlock}
      />
      {attributes.prosConsEnabled && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
          onClick={handleAnyClick}
          className={"ub-pros-cons-wrapper"}
          ref={wrapperRef}
          style={wrapperStyles}
          data-layout-type={attributes.prosConsLayout}
        >
          {renderBlockContent()}
          <OverlayControlsPortalProvider rootBlock={rootBlock} />
        </div>
      )}
    </ProsConsContext.Provider>
  );
}

// pro main store selection mapping
const proMainStoreSelectMapping = ({ getExtensionExtraData }) => {
  return {
    layoutTypes: getExtensionExtraData("ub/review", "prosConsLayoutTypes"),
  };
};

/**
 * @module ProsCons
 */
export default withProMainStore(proMainStoreSelectMapping)(ProsCons);
