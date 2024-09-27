import React from 'react';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BooleanToggleControl from '@Base/js/components/editor/controls/BooleanToggleControl.js';
import IndexDataRegistry from '../../inc/js/IndexDataRegistry';

/**
 * Inspector controls related to call to action functionality.
 *
 * @param {Object}   props                component properties
 * @param {Array}    props.cTAList        call-to-action link list
 * @param {Function} props.setAttributes  block attributes update function
 * @param {number}   props.activeTabIndex active tab index
 * @function Object() { [native code] }
 */
function CallToActionTabControls({ cTAList, setAttributes, activeTabIndex }) {
	/**
	 * Enabled status of current tab.
	 *
	 * @return {boolean} status
	 */
	const enabledStatus = () => {
		// since data registry for call-to-action attribute will be adding string urls for enabled tabs, checking for data type will be suitable to determine the status of current tab
		return typeof cTAList[activeTabIndex] === 'string';
	};

	/**
	 * Update call-to-action list attribute for block.
	 *
	 * @param {Array} updatedData updated data
	 */
	const updateCTAList = (updatedData) => {
		setAttributes({ tabCallToAction: updatedData });
	};

	/**
	 * Set call-to-action status of current tab.
	 *
	 * @param {boolean} val status value
	 */
	const setCTAStatus = (val) => {
		const updatedData = IndexDataRegistry.addToIndexData(
			val ? '' : null,
			activeTabIndex,
			cTAList,
			null
		);

		updateCTAList(updatedData);
	};

	/**
	 * Call-to-action link for current tab.
	 *
	 * @return {string | null} link value
	 */
	const cTALink = () => {
		return cTAList[activeTabIndex];
	};

	/**
	 * Update link value of current tab.
	 *
	 * @param {string} val link
	 */
	const updateCTALink = (val) => {
		const updatedData = IndexDataRegistry.addToIndexData(
			val,
			activeTabIndex,
			cTAList,
			null
		);

		updateCTAList(updatedData);
	};

	return (
		<PanelBody
			title={__('Call to Action', 'ultimate-blocks-pro')}
			initialOpen={false}
		>
			<BooleanToggleControl
				value={enabledStatus()}
				label={__(
					'Convert current tab into call to action',
					'ultimate-blocks-pro'
				)}
				attributeId={'callToActionStatus'}
				help={__(
					'Call to action tab will direct your users to assigned url instead of showing a tab content.'
				)}
				setAttributes={() => {}}
				extraChangeCallback={setCTAStatus}
			/>
			{enabledStatus() && (
				<TextControl
					value={cTALink()}
					label={__('Link', 'ultimate-blocks-pro')}
					onChange={updateCTALink}
				/>
			)}
		</PanelBody>
	);
}

/**
 * @module CallToActionTabControls
 */
export default CallToActionTabControls;
