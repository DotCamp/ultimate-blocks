/**
 * Content toggle panel client component
 *
 * @param {HTMLElement} panelElement panel element
 * @function Object() { [native code] }
 */
import ContentTogglePanelSubElement from './ContentTogglePanelSubElement';

function ContentTogglePanel(panelElement) {
	/**
	 * Panel sub elements.
	 *
	 * @type {Array<ContentTogglePanelSubElement>}
	 */
	const subElements = [];

	/**
	 * Find panel sub elements.
	 *
	 * @return {Array<HTMLElement>} HTML elements of sub element
	 */
	const findSubElements = () => {
		const title = panelElement.querySelector(
			'.wp-block-ub-content-toggle-accordion-title-wrap'
		);

		const content = panelElement.querySelector(
			'.wp-block-ub-content-toggle-accordion-content-wrap'
		);

		return [title, content];
	};

	/**
	 * Startup related operations.
	 */
	const startupOperations = () => {
		subElements.push(
			...findSubElements().map((subElementHTMLElement) => {
				return new ContentTogglePanelSubElement(subElementHTMLElement);
			})
		);
	};

	/**
	 * Highlight matched text within panel.
	 *
	 * @param {string} phrase phrase to be matched
	 * @param {string} flags  search flags
	 * @return {number} total numbers of matches highlighted in panel
	 */
	this.highlightMatch = (phrase, flags) => {
		const totalHighlighted = subElements
			.map((sEInstance) => sEInstance.highlightPhrase(phrase, flags))
			.reduce((carry, current) => {
				carry += current;
				return carry;
			}, 0);

		const highlightStatus = totalHighlighted > 0;
		setPanelVisibility(highlightStatus);

		return totalHighlighted;
	};

	/**
	 * Set visibility status of panel element.
	 *
	 * @param {boolean} status visibility status
	 */
	const setPanelVisibility = (status) => {
		panelElement.dataset.visibility = status;
	};

	/**
	 * Reset highlights on panel.
	 */
	this.resetHighlight = () => {
		subElements.map((sEInstance) => sEInstance.resetHighlight());
		setPanelVisibility(true);
	};

	// initialize module
	startupOperations();
}

/**
 * @module ContentTogglePanel
 */
export default ContentTogglePanel;
