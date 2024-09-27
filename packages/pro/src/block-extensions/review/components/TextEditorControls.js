import React, { useEffect } from 'react';
import { BaseControl, FontSizePicker, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import withInspectorContext from './hoc/withInspectorContext';
import ConditionalRenderer from './ConditionalRenderer';

/**
 * Editor controls related to text on block.
 *
 * @param {Object}   props                    component properties
 * @param {Object}   props.attributes         block attributes, will be supplied via HOC
 * @param {Function} props.setSingleAttribute single attribute setter function, will be supplied via HOC
 * @param {Object}   props.commonSizes        common size values for controls, will be supplied via HOC
 * @function Object() { [native code] }
 */
function TextEditorControls({ attributes, setSingleAttribute, commonSizes }) {
	const {
		fontSize,
		titleFontSize,
		syncIconFontSize,
		syncTitleContentFontSize,
		contentToTitleFontSizePercentage,
	} = attributes;
	const { small, medium, large } = commonSizes;

	// useEffect hook
	useEffect(() => {
		if (syncIconFontSize) {
			setSingleAttribute('iconSize', fontSize);
		}
	}, [syncIconFontSize, fontSize]);

	// useEffect hook
	useEffect(() => {
		if (syncTitleContentFontSize) {
			setSingleAttribute(
				'titleFontSize',
				fontSize * (contentToTitleFontSizePercentage / 100)
			);
		}
	}, [syncTitleContentFontSize, fontSize]);

	/**
	 * Convert content sizes to title ones.
	 *
	 * @param {Object} commonSizesObj        common sizes object with size slugs as key and their values
	 * @param {number} [ratioPercentage=100] percentage that will be applied to common size values
	 * @return {Object} title sizes object
	 */
	const convertToTitleSize = (commonSizesObj, ratioPercentage = 100) => {
		return Object.keys(commonSizesObj).reduce((carry, current) => {
			if (Object.prototype.hasOwnProperty.call(commonSizesObj, current)) {
				carry[current] =
					commonSizesObj[current] * (ratioPercentage / 100);
			}

			return carry;
		}, {});
	};

	const textSizes = [
		{
			name: __('Small', 'ultimate-blocks-pro'),
			slug: 'small',
			size: small,
		},
		{
			name: __('Medium', 'ultimate-blocks-pro'),
			slug: 'medium',
			size: medium,
		},
		{
			name: __('Large', 'ultimate-blocks-pro'),
			slug: 'large',
			size: large,
		},
	];

	const predefinedTitleSizes = convertToTitleSize(
		commonSizes,
		contentToTitleFontSizePercentage
	);

	const titleSizes = [
		{
			name: __('Small', 'ultimate-blocks-pro'),
			slug: 'small',
			size: predefinedTitleSizes.small,
		},
		{
			name: __('Medium', 'ultimate-blocks-pro'),
			slug: 'medium',
			size: predefinedTitleSizes.medium,
		},
		{
			name: __('Large', 'ultimate-blocks-pro'),
			slug: 'large',
			size: predefinedTitleSizes.large,
		},
	];

	return (
		<PanelBody title={__('Text', 'ultimate-blocks-pro')}>
			<BaseControl
				id={'content'}
				label={__('Content', 'ultimate-blocks-pro')}
			>
				<FontSizePicker
					fontSizes={textSizes}
					value={fontSize}
					fallbackFontSize={textSizes[1].size}
					label={__('Content text size', 'ultimate-blocks-pro')}
					onChange={(val) => {
						setSingleAttribute('fontSize', val);
					}}
				/>
			</BaseControl>
			<ConditionalRenderer
				attributeKey={'syncTitleContentFontSize'}
				targetValue={false}
			>
				<BaseControl
					id={'title'}
					label={__('Title', 'ultimate-blocks-pro')}
				>
					<FontSizePicker
						fontSizes={titleSizes}
						value={titleFontSize}
						fallbackFontSize={titleSizes[1].size}
						label={__('Title text size', 'ultimate-blocks-pro')}
						onChange={(val) => {
							setSingleAttribute('titleFontSize', val);
						}}
					/>
				</BaseControl>
			</ConditionalRenderer>
		</PanelBody>
	);
}

/**
 * @module TextEditorControls
 */
export default withInspectorContext(TextEditorControls);
