import React from 'react';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import BooleanToggleControl from '@Base/js/components/editor/controls/BooleanToggleControl.js';
import withContentToggleContext from '../hoc/withContentToggleContext';
import ContentToggleColorControlPortal from '../ContentToggleColorControlPortal';
import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import AdvancedControlsManager from '@Base/js/components/editor/AdvancedControlsManager.js';
import SearchControl from './SearchControl';
import SearchAdvancedControl from './SearchAdvancedControl';
import SearchInputFilterControls from './SearchInputFilterControls';
import InspectorControlsStylesTab from '@Components/Common/InspectorControlsStylesTab';

/**
 * Inspector controls related to search functionality of content toggle block.
 *
 * @param {Object}   props                        component properties
 * @param {boolean}  props.searchStatus           search functionality status, will be supplied via HOC
 * @param {boolean}  props.searchAdvancedControls advanced controls status, will be supplied via HOC
 * @param {Function} props.setAttributes          attributes setter function, will be supplied via HOC
 * @param {string}   props.searchMatchedColor     matched search result highlight color, will be supplied via HOC
 * @param {Function} props.setSingleAttribute     set single attribute value, will be supplied via HOC
 * @param {Object}   props.allAttributes          all available attributes
 * @param {Array}    props.searchInputFilters     enabled filters for search input, will be supplied via HOC
 * @param {boolean}  props.searchShowSummary      whether to show search summary messages, will be supplied via HOC
 */
function SearchInspectorControls({
	searchStatus,
	searchAdvancedControls,
	searchMatchedColor,
	setAttributes,
	setSingleAttribute,
	searchInputFilters,
	searchShowSummary,
	allAttributes,
}) {
	// list of advanced attributes
	const advancedAttributeKeys = [
		'searchMatchedColor',
		'searchInputFilters',
		'searchAutoCompleteSuggestions',
		'searchShowSummary',
	];

	return (
		<AdvancedControlsManager
			advancedAttributeKeyList={advancedAttributeKeys}
			setAttributes={setAttributes}
			targetAttributes={allAttributes}
			advancedControlAttributeId={'searchAdvancedControls'}
		>
			<InspectorControls>
				<PanelBody
					title={__('Search', 'ultimate-blocks-pro')}
					initialOpen={false}
				>
					<BooleanToggleControl
						setAttributes={setAttributes}
						value={searchStatus}
						attributeId={'searchStatus'}
						label={__(
							'Enable content search',
							'ultimate-blocks-pro'
						)}
					/>
					<SearchControl>
						<BooleanToggleControl
							setAttributes={setAttributes}
							value={searchAdvancedControls}
							attributeId={'searchAdvancedControls'}
							label={__(
								'Enable advanced controls',
								'ultimate-blocks-pro'
							)}
						/>
					</SearchControl>
					<SearchAdvancedControl>
						<BooleanToggleControl
							setAttributes={setAttributes}
							value={searchShowSummary}
							attributeId={'searchShowSummary'}
							label={__(
								'Show search summary',
								'ultimate-blocks-pro'
							)}
						/>
					</SearchAdvancedControl>
					<SearchAdvancedControl>
						<SearchInputFilterControls
							currentFilters={searchInputFilters}
							onFilterListChanged={(filterList) =>
								setSingleAttribute(
									'searchInputFilters',
									filterList
								)
							}
						/>
					</SearchAdvancedControl>
				</PanelBody>
			</InspectorControls>
			<InspectorControlsStylesTab>
				<ContentToggleColorControlPortal.Consumer>
					<SearchAdvancedControl>
						<PanelColorSettings
							title={'Search'}
							colorSettings={[
								{
									value: searchMatchedColor,
									label: __(
										'Highlight',
										'ultimate-blocks-pro'
									),
									onChange: (colorVal) =>
										setSingleAttribute(
											'searchMatchedColor',
											colorVal
										),
								},
							]}
						/>
					</SearchAdvancedControl>
				</ContentToggleColorControlPortal.Consumer>
			</InspectorControlsStylesTab>
		</AdvancedControlsManager>
	);
}

// context data mapping function
const contextMapping = ({ attributes, setAttributes, setSingleAttribute }) => {
	const {
		searchStatus,
		searchAdvancedControls,
		searchMatchedColor,
		searchInputFilters,
		searchShowSummary,
	} = attributes;
	return {
		searchStatus,
		searchAdvancedControls,
		searchMatchedColor,
		setAttributes,
		setSingleAttribute,
		searchInputFilters,
		searchShowSummary,
		allAttributes: attributes,
	};
};

/**
 * @module SearchInspectorControls
 */
export default withContentToggleContext(
	SearchInspectorControls,
	contextMapping
);
