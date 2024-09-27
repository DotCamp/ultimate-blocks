import withInspectorContext from './hoc/withInspectorContext';
import PortalGenerator from '@Base/js/inc/PortalGenerator.js';

/**
 * Color control portal.
 * Will be exporting Provider and Consumer components.
 *
 * @function Object() { [native code] }
 */
function ColorControlPortal() {
	// context data mapping
	const contextMapping = ({
		colorControlsPortalRef,
		setColorControlsPortalRef,
	}) => {
		return {
			portalRef: colorControlsPortalRef,
			setPortalRef: setColorControlsPortalRef,
			providerClassName: 'review-color-control-portal-provider',
		};
	};

	return PortalGenerator((Component) =>
		withInspectorContext(Component, contextMapping)
	);
}

/**
 * @module ColorControlPortal
 */
export default ColorControlPortal();
