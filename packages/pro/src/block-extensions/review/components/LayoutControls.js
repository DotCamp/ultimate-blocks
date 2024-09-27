import React from 'react';
import { __ } from '@wordpress/i18n';
import withInspectorContext from './hoc/withInspectorContext';
import withProMainStore from '@Stores/proStore/hoc/withProMainStore.js';
import { PanelBody } from '@wordpress/components';
import {
	BlackWhiteButtonGroup,
	BlackWhiteButton,
} from '@Library/ub-common/Components';

/**
 * Layout related inspector controls
 *
 * @param {Object}   props                    component properties
 * @param {Object}   props.attributes         block attributes, will be supplied via HOC
 * @param {Object}   props.layoutTypes        available pros/cons layout types, will be supplied via HOC
 * @param {Function} props.getTranslation     function to access translations, will be supplied via HOC
 * @param {Function} props.setSingleAttribute function to set a single attribute value, will be supplied via HOC
 *
 * @function Object() { [native code] }
 */
function LayoutControls({
	attributes,
	layoutTypes,
	getTranslation,
	setSingleAttribute,
}) {
	const { prosConsLayout } = attributes;

	/**
	 * Is button active based on its related layout id.
	 *
	 * @param {string} layoutId layout id
	 * @return {boolean} active status
	 */
	const isButtonActive = (layoutId) => {
		return layoutId === prosConsLayout;
	};

	return (
		<PanelBody title={__('Layouts', 'ultimate-blocks-pro')}>
			<BlackWhiteButtonGroup>
				{Object.values(layoutTypes).map((lType) => {
					return (
						<BlackWhiteButton
							key={lType}
							isActive={isButtonActive(lType)}
							onClick={() =>
								setSingleAttribute('prosConsLayout', lType)
							}
						>
							{getTranslation(lType)}
						</BlackWhiteButton>
					);
				})}
			</BlackWhiteButtonGroup>
		</PanelBody>
	);
}

const proMainStoreSelectMapping = ({ getTranslation }) => {
	return {
		getTranslation,
	};
};

/**
 * @module LayoutControls
 */
export default withProMainStore(proMainStoreSelectMapping)(
	withInspectorContext(LayoutControls)
);
