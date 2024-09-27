import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { IconControl, IconSizePicker } from '@Library/ub-common/Components';
import IndexDataRegistry from '../../inc/js/IndexDataRegistry';

/**
 * Tab icon related inspector controls.
 *
 * @param {Object}        props                component properties
 * @param {boolean}       props.tabsIconStatus status of tab icon functionality
 * @param {Function}      props.setAttributes  component attributes setter
 * @param {Array<string>} props.tabIcons       tab icons name array
 * @param {number}        props.activeTabIndex active tab index
 * @param {number}        props.tabIconSize    tab icon size
 * @function Object() { [native code] }
 */
function TabIconControls({
	activeTabIndex,
	tabsIconStatus,
	tabIcons,
	tabIconSize,
	setAttributes,
}) {
	/**
	 * Set icon value for active tab.
	 *
	 * @param {string | null} val icon name
	 */
	const setTabIcon = (val) => {
		const tabIconsToUse = IndexDataRegistry.addToIndexData(
			val,
			activeTabIndex,
			tabIcons
		);

		setAttributes({
			tabIcons: tabIconsToUse,
		});
	};

	/**
	 * Get icon for the active tab.
	 *
	 * @return {string}  icon name
	 */
	const getTabIcon = () => {
		return tabIcons[activeTabIndex];
	};

	return (
		tabsIconStatus && (
			<PanelBody title={__('Tab Icon', 'ultimate-blocks-pro')}>
				<IconControl
					key={activeTabIndex}
					selectedIcon={getTabIcon()}
					label={__('Icon', 'ultimate-blocks-pro')}
					onIconSelect={setTabIcon}
				/>
				<IconSizePicker
					size={tabIconSize}
					sizeChangeCallback={(val) =>
						setAttributes({ tabIconSize: val })
					}
				/>
			</PanelBody>
		)
	);
}

/**
 * @module TabIconControls
 */
export default TabIconControls;
