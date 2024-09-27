/**
 * Sub element for content toggle panel.
 *
 * @param {HTMLElement} targetElement
 * @function Object() { [native code] }
 */
function ContentTogglePanelSubElement(targetElement) {
	let cachedInnerHTML = null;

	/**
	 * Initialize sub element component
	 */
	const init = () => {
		if (targetElement) {
			// cache default HTML value
			cachedInnerHTML = targetElement.innerHTML;
		}
	};

	/**
	 * Search given phrase and highlight it on supplied HTML content.
	 *
	 * @param {string} searchPhrase phrase to be searched
	 * @param {string} flags        search flags
	 * @typedef {number} ReplaceCount replaced match count
	 * @typedef {string | null} ReplacedContent replaced content
	 * @typedef {Array<ReplaceCount, ReplacedContent>} HighlightTuple highlight tuple
	 * @return {HighlightTuple} highlight tuple
	 */
	const searchAndHighlight = (searchPhrase, flags) => {
		let matchAmount = 0;
		const highlightedContent = cachedInnerHTML.replace(
			/>([^<].*?([aZ])*)</gim,
			(match) => {
				if (match) {
					const regexp = new RegExp(`${searchPhrase}`, flags);
					return match.replace(regexp, (match) => {
						matchAmount++;
						return `<span class="ub-content-toggle-search-match">${match}</span>`;
					});
				}
			}
		);
		return [matchAmount, matchAmount ? highlightedContent : null];
	};

	/**
	 * Highlight matched phrase in sub element text content.
	 *
	 * @param {string} searchPhrase phrase to be searched
	 * @param {string} flags        search flags
	 * @return {number} number of matches highlighted
	 */
	this.highlightPhrase = (searchPhrase, flags) => {
		const [replaceCount, highlightedContent] = searchAndHighlight(
			searchPhrase,
			flags
		);

		assignInnerHTML(highlightedContent);

		return replaceCount;
	};

	/**
	 * Update HTML content of sub element.
	 * This function will revert HTML content to its default if null is supplied for new HTML.
	 *
	 * @param {string|null} updatedHTML new HTML content, revert to original if null is supplied
	 */
	const assignInnerHTML = (updatedHTML) => {
		targetElement.innerHTML = updatedHTML ? updatedHTML : cachedInnerHTML;
	};

	/**
	 * Reset highlight on sub element.
	 */
	this.resetHighlight = () => {
		if (targetElement && cachedInnerHTML) {
			targetElement.innerHTML = cachedInnerHTML;
		}
	};

	// initialize module
	init();
}

/**
 * @module ContentTogglePanelSubElement
 */
export default ContentTogglePanelSubElement;
