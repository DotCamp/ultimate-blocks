import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OverlayControlsPortalConsumer from '../../OverlayControlsPortalConsumer';
import OverlayControlPosition, {
	OVERLAY_POSITIONS,
} from '../../OverlayControlPosition';
import OverlayButton, { OVERLAY_BUTTON_TYPES } from '../../OverlayButton';
import withGraphData from './withGraphData';

/**
 * Graph layout related overlay controls
 *
 * @param {Object}   props            component properties
 * @param {Function} props.addNewData add new empty data piece
 * @param {Function} props.removeData remove data piece
 * @function Object() { [native code] }
 */
function GraphOverlayControls({ addNewData, removeData }) {
	return (
		<OverlayControlsPortalConsumer>
			<OverlayControlPosition position={OVERLAY_POSITIONS.BOTTOM_CENTER}>
				<OverlayButton clickHandler={addNewData}>
					<FontAwesomeIcon icon="fa-solid fa-plus fa-2xs" />
				</OverlayButton>
			</OverlayControlPosition>
			<OverlayControlPosition position={OVERLAY_POSITIONS.RIGHT_CENTER}>
				<OverlayButton
					clickHandler={removeData}
					type={OVERLAY_BUTTON_TYPES.NEGATIVE}
				>
					<FontAwesomeIcon icon="fa-solid fa-xmark" />
				</OverlayButton>
			</OverlayControlPosition>
		</OverlayControlsPortalConsumer>
	);
}

/**
 * @module GraphOverlayControls
 */
export default withGraphData(GraphOverlayControls);
