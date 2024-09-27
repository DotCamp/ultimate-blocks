import { __, _nx } from '@wordpress/i18n';
import ContentTogglePanel from './ContentTogglePanel';
import ToolboxItem from './ToolboxItem';
import { Debouncer } from '../../../../../inc/libraries/ub-common/Inc';

/**
 * Client side search component.
 *
 * @param {HTMLElement} searchNode    component HTML node
 * @param {HTMLElement} blockNode     parent block HTML node
 * @param {number}      minInputLimit minimum number of characters to trigger search operation within block
 * @function Object() { [native code] }
 */
function SearchComponent(searchNode, blockNode, minInputLimit = 3) {
	/**
	 * Current active search phrase.
	 *
	 * @type {string}
	 */
	let currentSearchPhrase = '';

	/**
	 * Component input element.
	 *
	 * @type {HTMLElement | null}
	 */
	let searchInput = null;

	/**
	 * Component message area
	 *
	 * @type {HTMLElement|null}
	 */
	let messageArea = null;

	/**
	 * Component options
	 *
	 * @type {null | Object}
	 */
	let options = null;

	/**
	 * Available content toggle panel instances
	 *
	 * @type {Array<ContentTogglePanel>}
	 */
	const contentTogglePanelInstances = [];

	/**
	 * Available toolbox items for search component.
	 *
	 * @type {Object<string,ToolboxItem>}
	 */
	const toolboxItems = {};

	/**
	 * Available toolbox items for input filtering.
	 *
	 * @type {Object<string,ToolboxItem>}
	 */
	const filterToolboxItems = {};

	/**
	 * Search filter options.
	 *
	 * @type {{matchCase: boolean}}
	 */
	const filterOptions = new Proxy(
		{
			matchCase: false,
		},
		{
			set() {
				searchOperation(currentSearchPhrase);
				return Reflect.set(...arguments);
			},
		}
	);

	/**
	 * Get target option value.
	 *
	 * @throws Error on no option value is found with the supplied key
	 * @param {string} optionKey target option key
	 */
	const getOption = (optionKey) => {
		const targetVal = options[optionKey];
		if (targetVal === undefined) {
			throw new Error(
				`no option is found with the given key of [${optionKey}]`
			);
		}

		return targetVal;
	};

	/**
	 * Display message on search component.
	 *
	 * @param {string} message message
	 */
	const setMessage = (message) => {
		if (messageArea) {
			messageArea.innerHTML = message;
			messageArea.dataset.visibility = JSON.stringify(true);
		}
	};

	/**
	 * Reset content and hide message area.
	 */
	const resetMessageArea = () => {
		if (messageArea) {
			// keep it actually not empty to maintain message area height
			messageArea.innerHTML = '.';
			messageArea.dataset.visibility = JSON.stringify(false);
		}
	};

	/**
	 * Prepare search flags.
	 *
	 * @return {string} search flags
	 */
	const prepareSearchFlags = () => {
		let defaultFlags = 'gm';

		if (!filterOptions.matchCase) {
			defaultFlags += 'i';
		}

		return defaultFlags;
	};

	/**
	 * Search block component for matching phrases and highlight them.
	 *
	 * @param {string} searchPhrase phrase
	 */
	const searchAndHighlight = (searchPhrase) => {
		if (searchPhrase !== '' && searchPhrase.length >= minInputLimit) {
			const highlightCount = contentTogglePanelInstances
				.map((ctpInstance) =>
					ctpInstance.highlightMatch(
						searchPhrase,
						prepareSearchFlags()
					)
				)
				.reduce((carry, current) => {
					carry += current;
					return carry;
				}, 0);

			if (highlightCount === 0) {
				setMessage(__('no match found…', 'ultimate-blocks-pro'));
			} else {
				setMessage(
					`<span class="message-count">${highlightCount}</span> ${_nx(
						'match found',
						'matches found',
						highlightCount,
						'sentence is starting with number of matches',
						'ultimate-blocks-pro'
					)}`
				);
			}
		} else if (searchPhrase === '' || searchPhrase.length < minInputLimit) {
			contentTogglePanelInstances.map((cptInstance) =>
				cptInstance.resetHighlight()
			);

			resetMessageArea();
		}
	};

	/**
	 * Set busy status of input.
	 *
	 * @param {boolean} status busy status
	 */
	const setBusyStatus = (status) => {
		toolboxItems.busy.setVisibility(status);
	};

	/**
	 * Search operation logic.
	 *
	 * @param {string} rawPhrase target phrase to be searched for
	 */
	const searchOperation = (rawPhrase) => {
		const processedPhrase = rawPhrase.trim();

		getToolboxItem('clear').setVisibility(rawPhrase.length > 0);

		setBusyStatus(true);

		// immediately reset highlighting if an empty search phrase is supplied
		if (processedPhrase !== '' && processedPhrase.length >= minInputLimit) {
			Debouncer(
				() => {
					searchAndHighlight(processedPhrase);
					setBusyStatus(false);
				},
				500,
				'searchInputDebounce'
			);
		} else {
			// reset highlighting and end any waiting debounce operation from previous highlight operations
			Debouncer(
				() => {
					searchAndHighlight(processedPhrase);
					setBusyStatus(false);
				},
				10,
				'searchInputDebounce'
			);
		}
	};

	/**
	 * Bind operations related to search input.
	 */
	const bindSearchInputOperations = () => {
		if (searchInput) {
			searchInput.addEventListener('input', (e) => {
				currentSearchPhrase = e.target.value;
				searchOperation(e.target.value);
			});
		}
	};

	/**
	 * Prepare toolbox items.
	 */
	const prepareToolboxItems = () => {
		Array.from(
			searchNode.querySelectorAll(
				'.ub-content-toggle-search-toolbox .toolbox-item'
			)
		).map(
			// eslint-disable-next-line array-callback-return
			(toolboxItemElement) => {
				const itemInstance = new ToolboxItem(
					toolboxItemElement,
					handleToolboxItemActions
				);
				filterToolboxItems[itemInstance.type] = itemInstance;
			}
		);

		Array.from(
			searchNode.querySelectorAll(
				'.ub-content-toggle-search-input-toolbox .toolbox-item'
			)
		).map(
			// eslint-disable-next-line array-callback-return
			(toolboxItemElement) => {
				const itemInstance = new ToolboxItem(
					toolboxItemElement,
					handleToolboxItemActions
				);
				toolboxItems[itemInstance.type] = itemInstance;
			}
		);
	};

	/**
	 * Handle toolbox item action events.
	 *
	 * @param {string} itemType item type
	 */
	const handleToolboxItemActions = (itemType) => {
		switch (itemType) {
			case 'clear':
				searchInput.value = '';
				searchInput.dispatchEvent(new Event('input'));
				searchInput.focus();
				break;
			case 'idle':
				searchInput.focus();
				break;
			default:
				if (Object.keys(filterOptions).includes(itemType)) {
					searchInput.focus();
					filterOptions[itemType] = !filterOptions[itemType];
					getToolboxItem(itemType, true)?.setEnabled(
						filterOptions[itemType]
					);
				}
				break;
		}
	};

	/**
	 * Toolbox item.
	 *
	 * @param {string}  type     item type
	 * @param {boolean} isFilter whether target toolbox item is associated with search filter operations
	 * @return {ToolboxItem} toolbox item instance
	 */
	const getToolboxItem = (type, isFilter = false) => {
		const targetArray = isFilter ? filterToolboxItems : toolboxItems;
		return targetArray[type];
	};

	/**
	 * Bind focus/blur events to search input.
	 */
	const bindSearchFocusOperations = () => {
		const focusLogic = (status) => {
			if (Object.values(filterToolboxItems).length > 1) {
				getToolboxItem('idle', true).setVisibility(!status);

				Object.values(filterToolboxItems)
					.filter((item) => item.type !== 'idle')
					.map((tIInstance) => tIInstance.setVisibility(status));
			}
		};

		searchInput.addEventListener('focus', () => focusLogic(true));
	};

	/**
	 * Add styles based on editor block controls
	 */
	const addCustomStyles = () => {
		const style = document.createElement('style');
		const matchColor = getOption('searchMatchedColor');

		const styleObject = {
			'.ub-content-toggle-search-match': {
				'background-color': matchColor,
			},
		};

		const blockId = blockNode.getAttribute('id');

		style.textContent = Object.keys(styleObject).map((key) => {
			if (Object.prototype.hasOwnProperty.call(styleObject, key)) {
				const objectRules = styleObject[key];

				const styleRules = Object.keys(objectRules)
					.filter((key) =>
						Object.prototype.hasOwnProperty.call(objectRules, key)
					)
					.map(
						(styleAttr) =>
							`${styleAttr}: ${objectRules[styleAttr]};`
					)
					.join('');

				return `#${blockId} ${key}{${styleRules}}`;
			}

			return '';
		});

		document.head.appendChild(style);
	};

	/**
	 * Processes to fire up at startup.
	 */
	const startupProcess = () => {
		options = JSON.parse(atob(searchNode.dataset.search));

		// prepare component variables
		searchInput = searchNode.querySelector('input.search-input');

		if (getOption('searchShowSummary')) {
			messageArea = searchNode.querySelector('.search-message');
		}

		// find and create individual panel element instances
		const contentTogglePanelElements = Array.from(
			blockNode.querySelectorAll('.wp-block-ub-content-toggle-accordion')
		);
		contentTogglePanelInstances.push(
			...contentTogglePanelElements.map(
				(el) => new ContentTogglePanel(el)
			)
		);

		// start search input related operations
		bindSearchInputOperations();
		bindSearchFocusOperations();

		addCustomStyles();

		prepareToolboxItems();
	};

	/**
	 * Initialize client.
	 */
	this.init = () => {
		startupProcess();
	};
}

/**
 * @module SearchComponent
 */
export default SearchComponent;
