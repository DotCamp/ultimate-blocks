import React, { useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal provider.
 * This component is the entry point for portal.
 *
 * @param {Object}        props                          component properties
 * @param {Function}      props.setPortalRef             set portal ref function, will be supplied via HOC
 * @param {string | null} [props.providerClassName=null] provider wrapper class names, null for no class name
 * @function Object() { [native code] }
 */
const Provider = ({ setPortalRef, providerClassName = null }) => {
	const callbackRef = useCallback((el) => {
		setPortalRef({ current: el });
	}, []);

	return <div ref={callbackRef} className={providerClassName} />;
};

/**
 * Portal consumer.
 *
 * @param {Object}              props           component properties
 * @param {Object}              props.portalRef portal ref
 * @param {JSX.Element | Array} props.children  children that will be rendered inside portal provider
 * @function Object() { [native code] }
 */
const Consumer = ({ portalRef, children }) => {
	return portalRef?.current ? createPortal(children, portalRef.current) : '';
};

/**
 * Generator function for portals.
 *
 * @param {Function} hocFunction HOC function which will assign getters and setters for portal components, provide portalRef as getter and setPortalRef for setter. check individual Provider/Consumer components for any extra property values they can use
 * @return {{Consumer, Provider}} generated portal components
 * @function Object() { [native code] }
 */
function PortalGenerator(hocFunction) {
	return {
		Provider: hocFunction(Provider),
		Consumer: hocFunction(Consumer),
	};
}

/**
 * @module PortalGenerator
 */
export default PortalGenerator;
