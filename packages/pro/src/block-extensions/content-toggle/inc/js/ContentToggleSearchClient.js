import SearchComponent from './SearchComponent';

/**
 * Client for content toggle search functionality.
 *
 * @param {string} searchNodeQuery    query to target search components on page
 * @param {string} contentToggleQuery query to target content toggle blocks on page
 * @function Object() { [native code] }
 */
function ContentToggleSearchClient(searchNodeQuery, contentToggleQuery) {
	/**
	 * Initialize client.
	 */
	this.init = () => {
		const contentToggleBlocks = Array.from(
			document.querySelectorAll(contentToggleQuery)
		);

		// eslint-disable-next-line array-callback-return
		contentToggleBlocks.map((blockNode) => {
			const searchComponentNode =
				blockNode.querySelector(searchNodeQuery);
			if (searchComponentNode) {
				const searchComponent = new SearchComponent(
					searchComponentNode,
					blockNode
				);
				searchComponent.init();
			}
		});
	};
}

/**
 * @module ContentToggleSearchClient
 */
export default ContentToggleSearchClient;
