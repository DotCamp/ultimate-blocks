import withContentToggleContext from './hoc/withContentToggleContext';
import PortalGenerator from '@Base/js/inc/PortalGenerator.js';

/**
 * Color control portal generator for content toggle block components.
 *
 * @function Object() { [native code] }
 */
function ContentToggleColorControlPortal() {
	// context mapping function
	const contextMapping = ({
		colorControlsPortalRef,
		setColorControlsPortalRef,
	}) => {
		return {
			portalRef: colorControlsPortalRef,
			setPortalRef: setColorControlsPortalRef,
		};
	};

	return PortalGenerator((Component) =>
		withContentToggleContext(Component, contextMapping)
	);
}

/**
 * @module ColorControlPortal
 */
export default ContentToggleColorControlPortal();
