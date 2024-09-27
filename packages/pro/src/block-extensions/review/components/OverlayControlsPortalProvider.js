// eslint-disable-next-line no-unused-vars
import React, { useCallback, useEffect, useRef, useState } from "react";
import withContext from "./hoc/withContext";
import OverlayControl from "./OverlayControl";

/**
 * Overlay controls.
 *
 * @param {Object}        props                      component properties
 * @param {string | null} props.activeLineId         active line id, will be supplied via HOC
 * @param {JSX.Element}   props.relativeWrapper      relative element, will be supplied via HOC
 * @param {Function}      props.setOverlayControlRef assign overlay control ref, will be supplied via HOC
 */
function OverlayControlsPortalProvider({
  activeLineId,
  relativeWrapper,
  setOverlayControlRef,
  rootBlock,
}) {
  const [activeLineElement, setActiveLineElement] = useState(null);

  const overlayControlRef = useCallback((el) => {
    setOverlayControlRef(el);
  }, []);

  /**
   * useEffect hook.
   */
  useEffect(() => {
    if (!rootBlock) {
      if (activeLineId !== null) {
        const targetElement = document.querySelector(`[id='${activeLineId}']`);

        if (targetElement) {
          setActiveLineElement(targetElement);
        } else {
          setActiveLineElement(null);
        }
      } else {
        setActiveLineElement(null);
      }
    }
  }, [activeLineId]);

  return (
    <OverlayControl
      relativeElement={relativeWrapper}
      targetElement={activeLineElement}
    >
      <span
        className={"overlay-control-reference-wrapper"}
        ref={overlayControlRef}
      ></span>
    </OverlayControl>
  );
}

// context map
const contextMap = ["activeLineId", "relativeWrapper", "setOverlayControlRef"];

/**
 * @module OverlayControls
 */
export default withContext(OverlayControlsPortalProvider, contextMap);
