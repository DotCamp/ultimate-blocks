import React from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import PreviewProvider from '@Inc/js/components/PreviewProvider/PreviewProvider.jsx';

/**
 * Register preview manager block.
 */
const registerPreviewManager = () => {
	registerBlockType('ub/preview-provider', {
		title: __('only for UB internal use', 'ultimate-blocks'),
		attributes: {},
		category: 'ultimateblocks',
		supports: {
			inserter: false,
			reusable: false,
		},
		edit: (props) => {
			return <PreviewProvider {...props} />;
		},
		save: () => {
			return null;
		},
	});
};

/**
 * @module registerPreviewManager
 */
export default registerPreviewManager;
