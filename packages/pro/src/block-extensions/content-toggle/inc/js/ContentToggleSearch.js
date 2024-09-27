import ContentToggleSearchClient from './ContentToggleSearchClient';

document.addEventListener('DOMContentLoaded', () => {
	const searchClient = new ContentToggleSearchClient(
		'.ub-content-toggle-search',
		'.wp-block-ub-content-toggle'
	);

	searchClient.init();
});
