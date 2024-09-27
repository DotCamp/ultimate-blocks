import { unregisterBlockType } from '@wordpress/blocks';
import UbProStore from '@Stores/proStore';

const ProBlockStatus = {
	/**
	 * Get status data for pro blocks.
	 *
	 * @return {Array} block status data
	 */
	getStatusOptions() {
		return UbProStore.select('getBlockStatusData')();
	},
	/**
	 * Set block active statuses.
	 */
	setStatusFromOptions() {
		this.getStatusOptions()
			.filter(({ active }) => !active)
			// eslint-disable-next-line array-callback-return
			.map(({ name }) => {
				unregisterBlockType(name);
			});
	},
};

/**
 * @module ProBlockStatus
 */
export default ProBlockStatus;
