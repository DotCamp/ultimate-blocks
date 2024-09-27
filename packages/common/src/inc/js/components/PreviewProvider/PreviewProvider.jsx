import React from 'react';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Preview provider component for saved styles preview generation.
 *
 * @param {Object} props          component properties
 * @param {string} props.clientId block client id
 * @class
 */
function PreviewProvider({ clientId }) {
	function generateId() {
		return `ub-preview-provider_${clientId}`;
	}

	return (
		<div className={'ub-preview-provider'} id={generateId()}>
			<InnerBlocks />
		</div>
	);
}

/**
 * @module PreviewProvider
 */
export default PreviewProvider;
