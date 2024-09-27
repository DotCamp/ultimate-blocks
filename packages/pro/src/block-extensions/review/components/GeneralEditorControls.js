import React from 'react';
import { __ } from '@wordpress/i18n';
import withInspectorContext from './hoc/withInspectorContext';
import { PanelBody } from '@wordpress/components';
import BooleanToggleControl from '@Base/js/components/editor/controls/BooleanToggleControl.js';
import AdvancedControl from './AdvancedControl';
import EnabledStatusRenderer from './EnabledStatusRenderer';
import LayoutRelatedRender from './LayoutRelatedRender';
import CardLayoutRelatedRender from './CardLayoutRelatedRender';
import ConditionalRenderer from './ConditionalRenderer';

/**
 * General editor controls for pros/cons block.
 *
 *
 * @param {Object}   props                    component properties
 * @param {Object}   props.attributes         block attributes, will be supplied via HOC
 * @param {Function} props.setSingleAttribute single attribute setter function, will be supplied via HOC
 * @param {Function} props.setAttributes      setAttributes function, will be supplied via HOC
 * @param {Object}   props.layoutTypes        layout types, will be supplied via HOC
 * @function Object() { [native code] }
 */
function GeneralEditorControls({
	attributes,
	setSingleAttribute,
	setAttributes,
	layoutTypes,
}) {
	const {
		syncIconFontSize,
		fontSize,
		syncTitleContentFontSize,
		prosConsAdvancedControls,
		prosConsEnabled,
		prosConsAdaptiveBorder,
	} = attributes;
	return (
		<PanelBody title={__('General', 'ultimate-blocks-pro')}>
			<BooleanToggleControl
				label={__('Enable Pros/Cons', 'ultimate-blocks-pro')}
				value={prosConsEnabled}
				attributeId={'prosConsEnabled'}
				setAttributes={setAttributes}
			/>
			<EnabledStatusRenderer>
				<BooleanToggleControl
					label={__('Advanced controls', 'ultimate-blocks-pro')}
					value={prosConsAdvancedControls}
					attributeId={'prosConsAdvancedControls'}
					setAttributes={setAttributes}
				/>
			</EnabledStatusRenderer>
			<AdvancedControl>
				<CardLayoutRelatedRender>
					<BooleanToggleControl
						label={__(
							'Sync text/icon sizes',
							'ultimate-blocks-pro'
						)}
						value={syncIconFontSize}
						attributeId={'syncIconFontSize'}
						help={__(
							'Use same sizes for both text and icons.',
							'ultimate-blocks-pro'
						)}
						setAttributes={setAttributes}
						extraChangeCallback={(val) => {
							if (!val) {
								setSingleAttribute('iconSize', fontSize);
							}
						}}
					/>
				</CardLayoutRelatedRender>
				<ConditionalRenderer
					attributeKey={'prosConsLayout'}
					targetValue={[layoutTypes.CARD, layoutTypes.BASIC]}
				>
					<BooleanToggleControl
						label={__(
							'Sync content/title sizes',
							'ultimate-blocks-pro'
						)}
						help={__(
							'Increase title size based on content font size.',
							'ultimate-blocks-pro'
						)}
						value={syncTitleContentFontSize}
						attributeId={'syncTitleContentFontSize'}
						setAttributes={setAttributes}
					/>
				</ConditionalRenderer>
				<CardLayoutRelatedRender>
					<BooleanToggleControl
						label={__('Adaptive border', 'ultimate-blocks-pro')}
						value={prosConsAdaptiveBorder}
						attributeId={'prosConsAdaptiveBorder'}
						help={__(
							'Add a border that adapt its color according to background.',
							'ultimate-blocks-pro'
						)}
						setAttributes={setAttributes}
					/>
				</CardLayoutRelatedRender>
			</AdvancedControl>
		</PanelBody>
	);
}

/**
 * @module GeneralEditorControls
 */
export default withInspectorContext(GeneralEditorControls);
