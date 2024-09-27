import { useState, useEffect, useRef } from 'react';
import { PanelRow } from '@wordpress/components';
import { v4 as uuidv4 } from 'uuid';
import IconControl from '@Containers/IconControl/components/IconControl.jsx';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import IconObject from '@Inc/js/IconObject';
import FrequentIconManager from '@Containers/IconControl/inc/FrequentIconManager';

/**
 * Icon control inspector panel row.
 *
 * @param {Object}        props                         component properties
 * @param {string}        props.label                   control label
 * @param {string | null} [props.id=null]               control id
 * @param {Function}      [props.onIconSelect=() => {}] icon selected callback, icon name as argument, null for icon clear
 * @param {string | null} [props.selectedIcon=null]     selected icon name, null for empty selection
 * @param {string}        props.frequentSettingName     frequent icon Settings api property name
 * @function Object() { [native code] }
 */
function IconControlContainer({
	label,
	id = null,
	onIconSelect = () => {},
	selectedIcon = null,
	frequentSettingName = 'ub_icon_choices',
}) {
	const [finalId, setFinalId] = useState(id);
	const [iconList, setIconList] = useState([]);
	const [filteredIconList, setFilteredIconList] = useState([]);
	const [filterQuery, setFilterQuery] = useState('');
	const [currentIcon, setCurrentIcon] = useState(selectedIcon);
	const [generatedFrequentList, setGeneratedFrequentList] = useState([]);
	const [frequentIconManager, setFrequentIconManager] = useState(null);

	const toggleButtonRef = useRef(null);
	const firstQueryChange = useRef(true);

	/**
	 * Get frequent icon list from REST api.
	 *
	 * @async
	 */
	const getFrequentIconList = async () => {
		let currentManager = frequentIconManager;

		// initialize manager if none found
		if (!currentManager) {
			currentManager = new FrequentIconManager(frequentSettingName);
			setFrequentIconManager(currentManager);
		}

		let freqIconObjectList = await currentManager.getList();

		freqIconObjectList = freqIconObjectList.sort((objA, objB) => {
			const { count: countA } = objA;
			const { count: countB } = objB;

			if (countA > countB) {
				return -1;
			} else if (countA < countB) {
				return 1;
			}

			return 0;
		});

		// filter out empty objects
		const freqIconObjects = freqIconObjectList
			.map((fObj) => {
				if (fObj.name && fObj.name !== '') {
					return getIconObjectFromIconName(fObj.name);
				}
				return null;
			})
			.filter((obj) => obj !== null);

		setGeneratedFrequentList(freqIconObjects);
	};

	// whether current icon is updated first time or not
	const currentIconFirstTime = useRef(true);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		getFrequentIconList();
	}, [iconList]);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		onIconSelect(currentIcon);

		if (!currentIconFirstTime.current) {
			frequentIconManager.addFrequentIcon(currentIcon).then(() => {
				getFrequentIconList();
			});
		}

		currentIconFirstTime.current = false;
	}, [currentIcon]);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		if (finalId === null) {
			setFinalId(uuidv4());
		}

		let allAvailableIcons;
		const context = global || self;

		// use cached icons if available
		if (context.ubIcons) {
			allAvailableIcons = context.ubIcons;
		} else {
			const mergedIcons = { ...fas, ...fab };

			// property filter icon keys for further usage
			const filteredIconIds = Object.keys(mergedIcons).filter((key) =>
				Object.prototype.hasOwnProperty.call(mergedIcons, key)
			);

			const allIconNames = filteredIconIds.map((iconId) => {
				return mergedIcons[iconId].iconName;
			});

			// get rid of duplicates and reform all available icons
			const uniqueIconNames = Array.from(new Set(allIconNames));
			const uniqueIconIds = uniqueIconNames.map((iconName) => {
				let targetIconId = null;

				// eslint-disable-next-line array-callback-return
				filteredIconIds.map((iconId) => {
					try {
						if (mergedIcons[iconId].iconName === iconName) {
							targetIconId = iconId;
							throw new Error('match found, stop iteration');
						}
					} catch (e) {
						// do nothing
					}
				});

				return targetIconId;
			});
			allAvailableIcons = uniqueIconIds.map((currentKey) => {
				return new IconObject(currentKey, mergedIcons[currentKey]);
			});

			// cache icons for further use between different icon controls and to improve performance
			context.ubIcons = allAvailableIcons;
		}

		setIconList([...allAvailableIcons]);
		setFilteredIconList([...allAvailableIcons]);
	}, []);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		if (!firstQueryChange.current) {
			filterIconList(filterQuery);
		}

		firstQueryChange.current = false;
	}, [filterQuery]);

	/**
	 * Filter available icons based on query string.
	 *
	 * @param {string} queryString query string
	 */
	const filterIconList = (queryString) => {
		const minimumLength = 3;
		let finalQuery = queryString.trim().toLowerCase();

		if (finalQuery.length < minimumLength) {
			finalQuery = '';
		}

		const tempFilteredList = iconList.filter((currentIconObject) => {
			const iconName = currentIconObject.getName();
			return iconName.includes(finalQuery);
		});

		setFilteredIconList(tempFilteredList);
	};

	/**
	 * Toggle visibility status of dropdown container.
	 */
	const toggleDropDown = () => {
		/**
		 * @member HTMLElement
		 */
		const { current: toggleButton } = toggleButtonRef;

		if (toggleButton) {
			toggleButton.click();
		}
	};

	/**
	 * Get icon object from icon name.
	 *
	 * @param {string} iconName icon name
	 *
	 * @return {IconObject |null} icon object, null if none found
	 */
	const getIconObjectFromIconName = (iconName) => {
		if (iconName) {
			const [match] = iconList.filter(
				(iObj) => iObj.getName() === iconName
			);

			if (match) {
				return match;
			}
		}

		return null;
	};

	return (
		<PanelRow className={'ultimate-blocks-icon-control-panel-row'}>
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
			<label
				data-testid={'icon-control-container-label'}
				onClick={toggleDropDown}
				htmlFor={finalId}
			>
				{label}
			</label>
			<IconControl
				id={finalId}
				ref={toggleButtonRef}
				onFilterChange={setFilterQuery}
				iconList={filteredIconList}
				onIconSelect={setCurrentIcon}
				onIconClear={() => setCurrentIcon(null)}
				currentIconObject={getIconObjectFromIconName(currentIcon)}
				frequentList={generatedFrequentList}
			/>
		</PanelRow>
	);
}

/**
 * @module IconControl
 */
export default IconControlContainer;
