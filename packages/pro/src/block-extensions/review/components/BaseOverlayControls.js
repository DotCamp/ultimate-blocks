import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import withContext from './hoc/withContext';
import OverlayControlPosition, {
	OVERLAY_POSITIONS,
} from './OverlayControlPosition';
import OverlayButton, { OVERLAY_BUTTON_TYPES } from './OverlayButton';
import OverlayControlsPortalConsumer from './OverlayControlsPortalConsumer';

/**
 * Overlay controls for pros/cons block.
 *
 * @param {Object}   props                      component properties
 * @param {Function} props.insertEmptyLineAfter insert empty line after current active line, will be supplied via HOC
 * @param {Function} props.setLineToRemove      set line to remove, will be supplied via HOC
 * @param {string}   props.activeLineId         active line id, will be supplied via HOC
 * @function Object() { [native code] }
 */
function BaseOverlayControls({
	insertEmptyLineAfter,
	setLineToRemove,
	activeLineId,
}) {
	return (
		<OverlayControlsPortalConsumer>
			<OverlayControlPosition position={OVERLAY_POSITIONS.BOTTOM_CENTER}>
				<OverlayButton clickHandler={insertEmptyLineAfter}>
					<FontAwesomeIcon icon="fa-solid fa-plus fa-2xs" />
				</OverlayButton>
			</OverlayControlPosition>
			<OverlayControlPosition position={OVERLAY_POSITIONS.RIGHT_CENTER}>
				<OverlayButton
					clickHandler={() => setLineToRemove(activeLineId)}
					type={OVERLAY_BUTTON_TYPES.NEGATIVE}
				>
					<FontAwesomeIcon icon="fa-solid fa-xmark" />
				</OverlayButton>
			</OverlayControlPosition>
		</OverlayControlsPortalConsumer>
	);
}

/**
 * @module OverlayControls
 */
export default withContext(BaseOverlayControls, [
	'insertEmptyLineAfter',
	'setLineToRemove',
	'activeLineId',
]);
