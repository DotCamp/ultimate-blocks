/**
 * Generate frequent icon object
 *
 * @param {string}        name                 icon name
 * @param {number}        count                number of usages
 * @param {string | null} [selectionTime=null] last selected time in seconds, if null is supplied, current time will be used
 */
export const generateFrequentIconObject = (
	name,
	count,
	selectionTime = null
) => {
	const finalSelectionTime =
		selectionTime !== null ? selectionTime : Math.ceil(Date.now() / 1000);

	return { name, count, selectionTime: [finalSelectionTime] };
};

/**
 * Manager for handling frequent icon operations.
 *
 * @param {string} settingName server setting name for frequent icons
 * @function Object() { [native code] }
 */
function FrequentIconManager(settingName) {
	this.sessionCacheName = settingName;

	// WordPress REST api frontend implementation
	const { models } = wp.api;

	/**
	 * Add count keys to missing icon objects for backward compatibility.
	 *
	 * @param {Array<Object>} list icon list
	 */
	const addCountKeys = (list) => {
		return list.map((obj) => {
			if (obj.count === undefined) {
				obj.count = 0;
			}

			return obj;
		});
	};

	/**
	 * Get cached list.
	 *
	 * @return {Array<Object> | null} frequent icon list, null if no cache found
	 */
	const getListFromCache = () => {
		const listRaw = sessionStorage.getItem(this.sessionCacheName);

		if (listRaw) {
			try {
				return JSON.parse(listRaw);
			} catch (e) {
				// empty cache on error
				sessionStorage.setItem(this.sessionCacheName, null);
			}
		}

		return null;
	};

	/**
	 * Get related setting from REST api.
	 *
	 * @async
	 *
	 * @return {Promise<Array>} Promise object
	 */
	const getSettingFromRest = async () => {
		const settingsModels = new models.Settings();

		const freqListRaw = await settingsModels.fetch();

		if (freqListRaw && freqListRaw[this.sessionCacheName]) {
			try {
				return JSON.parse(freqListRaw[this.sessionCacheName]);
			} catch (e) {
				// do nothing
			}
		}

		return [];
	};

	/**
	 * Add list to browser session storage.
	 *
	 * @param {string} stringifiedValue value
	 */
	const addToSessionStorage = (stringifiedValue) => {
		sessionStorage.setItem(this.sessionCacheName, stringifiedValue);
	};

	/**
	 * Get frequent icon list.
	 *
	 * @return {Promise<Array>} Promise
	 */
	this.getList = async () => {
		return new Promise(async (res) => {
			let freqList = [];

			const cachedValues = getListFromCache();

			if (cachedValues !== null) {
				freqList = addCountKeys(cachedValues);
			} else {
				const restValues = await getSettingFromRest();

				if (restValues) {
					freqList = addCountKeys(restValues);

					//cache rest values for fast future access
					addToSessionStorage(JSON.stringify(freqList));
				}
			}

			res(freqList);
		});
	};

	/**
	 * Get frequent icon list as icon names
	 *
	 * @async
	 *
	 * @return {Promise<Array<string>>} Promise
	 */
	this.getListAsIconNames = async () => {
		const freqList = await this.getList();

		return freqList.map(({ name }) => name);
	};

	/**
	 * Add icon to frequent list.
	 *
	 * @param {string} iconName icon name
	 *
	 * @return {Array<Object>} updated frequent icon list
	 */
	this.addFrequentIcon = async (iconName) => {
		const cachedList = getListFromCache() || [];

		if (iconName && iconName !== '') {
			const [matchedIcon] = cachedList.filter(
				(freqObj) => freqObj.name === iconName
			);

			if (matchedIcon) {
				matchedIcon.count = matchedIcon.count
					? Number.parseInt(matchedIcon.count, 10) + 1
					: 0;
			} else {
				cachedList.push(generateFrequentIconObject(iconName, 1));
			}

			const readyToSaveCache = JSON.stringify(cachedList);

			// cache updated list to browser storage
			addToSessionStorage(readyToSaveCache);

			const restSetting = new models.Settings();
			await restSetting.save({
				[this.sessionCacheName]: readyToSaveCache,
			});
		}

		return cachedList;
	};
}

/**
 * @module FrequentIconManager
 */
export default FrequentIconManager;
