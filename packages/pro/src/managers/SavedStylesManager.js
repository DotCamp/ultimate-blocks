import { select, dispatch } from '@wordpress/data';
import ManagerBase from '@Base/ManagerBase';
import FrontendDataManager from '@Managers/FrontendDataManager';
import SavedStylesStore from '@Stores/savedStyles';
import HookManager, { hookTypes } from '@Managers/HookManager';
import { addFilter } from '@wordpress/hooks';

/**
 * Saved styles manager for frontend.
 */
class SavedStylesManager extends ManagerBase {
	/**
	 * Store object
	 *
	 * @type {null | Object}
	 */
	#store = null;

	/**
	 * Store namespace.
	 *
	 * @type {string}
	 */
	storeNamespace = 'ub/saved-styles';

	/**
	 * Create persistent state object.
	 *
	 * @private
	 * @return {Object} persistent state
	 */
	#preparePersistentState() {
		const savedStylesData =
			FrontendDataManager.getDataProperty('savedStyles');

		if (!savedStylesData) {
			return {};
		}

		if (savedStylesData.saved.styles) {
			savedStylesData.saved.styles = JSON.parse(
				atob(savedStylesData.saved.styles)
			);
		} else {
			savedStylesData.saved.styles = {};
		}

		if (Array.isArray(savedStylesData.saved.styles)) {
			savedStylesData.saved.styles = {};
		}

		// eslint-disable-next-line array-callback-return
		Object.keys(savedStylesData.saved.styles).map((blockType) => {
			if (
				Object.prototype.hasOwnProperty.call(
					savedStylesData.saved.styles,
					blockType
				)
			) {
				if (Array.isArray(savedStylesData.saved.styles[blockType])) {
					savedStylesData.saved.styles[blockType] = {};
				}
			}
		});

		if (savedStylesData.saved.defaultStyles) {
			savedStylesData.saved.defaultStyles = JSON.parse(
				atob(savedStylesData.saved.defaultStyles)
			);
		} else {
			savedStylesData.saved.defaultStyles = {};
		}

		return { ...savedStylesData };
	}

	/**
	 * Saved styles manager initialization manager.
	 */
	_initLogic() {
		const persistentState = this.#preparePersistentState();
		this.#registerStore(persistentState);

		// @deprecated race condition is not persistent
		// window.onload = () => {
		// 	this.#cacheStartupBlockIds();
		// };

		let startupCache = false;
		addFilter(
			'editor.BlockEdit',
			'ubProStartupBlockIdCache',
			(BlockEdit) => {
				if (!startupCache) {
					startupCache = true;
					this.#cacheStartupBlockIds();
				}

				return BlockEdit;
			},
			1
		);

		HookManager.addFilter(
			hookTypes.filters.ADD_SUB_COMPONENT,
			'savedStylesManagerSubComponentAdd',
			(defaultProps) => {
				return { ...defaultProps, applyDefaultStyle: true };
			}
		);
	}

	/**
	 * Find blocks belonging to ultimate blocks and cache their ids.
	 */
	#cacheStartupBlockIds() {
		const blocksOnEditor = select('core/block-editor').getBlocks();

		const ubBlockIds = [];

		/**
		 * Push plugin block ids to cache.
		 *
		 * @param {Array} blocksArray block array
		 */
		const pushIdsToCache = (blocksArray) => {
			if (Array.isArray(blocksArray)) {
				blocksArray.reduce((carry, blockProps) => {
					if (blockProps.name.startsWith('ub/')) {
						carry.push(blockProps.clientId);

						// also check for any innerblock
						if (
							blockProps.innerBlocks &&
							Array.isArray(blockProps.innerBlocks) &&
							blockProps.innerBlocks.length > 0
						) {
							pushIdsToCache(blockProps.innerBlocks);
						}
					}

					return carry;
				}, ubBlockIds);
			}
		};

		pushIdsToCache(blocksOnEditor);

		// @deprecated
		// const ubBlockIds = blocksOnEditor.reduce((carry, blockProps) => {
		// 	if (blockProps.name.startsWith('ub/')) {
		// 		carry.push(blockProps.clientId);
		//
		// 		if (
		// 			blockProps.innerBlocks &&
		// 			Array.isArray(blockProps.innerBlocks) &&
		// 			blockProps.innerBlocks.length > 0
		// 		) {
		// 		}
		// 	}
		//
		// 	return carry;
		// }, []);

		// cache blocks ids to store
		dispatch(this.storeNamespace).setStartupBlockIds(ubBlockIds);
	}

	/**
	 * Register manager store to centralized data registry.
	 *
	 * @private
	 * @param {Object} storeState store state
	 */
	#registerStore(storeState) {
		this.#store = new SavedStylesStore(this.storeNamespace);
		this.#store.registerStore(storeState);
	}
}

/**
 * @module SavedStylesManager
 */
export default new SavedStylesManager();
