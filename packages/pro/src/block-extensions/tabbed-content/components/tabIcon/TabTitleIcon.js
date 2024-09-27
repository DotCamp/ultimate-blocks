import { UbIconComponent } from '@Library/ub-common/Components/index';

/**
 * Tab title icon component.
 *
 * @param {Object}  props                component properties
 * @param {string}  props.iconName       target icon name
 * @param {number}  props.size           icon size
 * @param {boolean} props.enabledStatus  enabled status
 * @param {boolean} props.iconIsSelected icon is selected on editor
 * @function Object() { [native code] }
 */
function TabTitleIcon({ iconName, size, enabledStatus, iconIsSelected }) {
	return (
		enabledStatus && (
			<div
				data-ub-icon-selected={iconIsSelected}
				className={'ub-pro-tab-title-icon'}
			>
				<UbIconComponent
					isActive={iconIsSelected}
					size={size}
					iconName={iconName}
				/>
			</div>
		)
	);
}

/**
 * @module TabTitleIcon
 */
export default TabTitleIcon;
