// eslint-disable-next-line no-unused-vars
import React from 'react';
import withContext from './hoc/withContext';
import { createPortal } from 'react-dom';

/**
 * Portal consumer for overlay controls portal.
 *
 * @param {Object}              props                   component properties
 * @param {Node}                props.overlayControlRef overlay control ref element
 * @param {JSX.Element | Array} props.children          component children
 * @function Object() { [native code] }
 */
function OverlayControlsPortalConsumer({ overlayControlRef, children }) {
	return overlayControlRef ? createPortal(children, overlayControlRef) : '';
}

const contextSelector = ['overlayControlRef'];

/**
 * @module OverlayControlPortalTarget
 */
export default withContext(OverlayControlsPortalConsumer, contextSelector);
