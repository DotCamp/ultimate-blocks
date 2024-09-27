import { forwardRef } from 'react';
import { Dropdown } from '@wordpress/components';
import IconSearchInput from '@Containers/IconControl/components/IconSearchInput.jsx';
import IconListing from '@Containers/IconControl/components/IconListing.jsx';
import Debouncer from '@Inc/js/Debouncer';
import IconObject from '@Inc/js/IconObject';
import IconRender from '@Containers/IconControl/components/IconRender.jsx';
import FrequentIconListing from '@Containers/IconControl/components/FrequentIconListing.jsx';

/**
 * Control component for icon select operations.
 *
 * @param {Object}            props                          component properties
 * @param {string}            props.id                       control id
 * @param {Function}          props.onFilterChange           filter query changed callback
 * @param {Array<IconObject>} props.iconList                 icon list
 * @param {Function}          props.onIconSelect             icon select callback
 * @param {Function}          props.onIconClear              icon clear callback
 * @param {IconObject | null} [props.currentIconObject=null] currently selected icon properties, null for empty selection
 * @param {Object}            ref                            ref object
 * @param {Array<IconObject>} [props.frequentList=[]]        frequent icon list
 * @function Object() { [native code] }
 */
function IconControl(
	{
		id,
		onFilterChange,
		iconList,
		onIconSelect,
		onIconClear,
		currentIconObject = null,
		frequentList = [],
	},
	ref
) {
	return (
		<div id={id} className={'ultimate-blocks-icon-control-wrapper'}>
			<Dropdown
				className={'ultimate-blocks-icon-control-dropdown'}
				renderToggle={({ onToggle }) => (
					// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus
					<div
						id={id}
						role={'button'}
						onClick={() => {
							onFilterChange('');
							onToggle();
						}}
						className={'ultimate-blocks-icon-control-preview-main'}
						ref={ref}
					>
						{currentIconObject && (
							<IconRender
								iconObject={currentIconObject}
								size={'2xl'}
							/>
						)}
					</div>
				)}
				renderContent={() => (
					<div className={'ultimate-blocks-icon-list-wrap'}>
						<IconSearchInput
							onChange={(val) =>
								Debouncer(
									() => onFilterChange(val),
									200,
									'icon-search-input'
								)
							}
						/>
						<FrequentIconListing
							frequentList={frequentList}
							onSelect={onIconSelect}
						/>
						<IconListing
							iconList={iconList}
							onIconSelect={onIconSelect}
							onIconClear={onIconClear}
						/>
					</div>
				)}
			/>
		</div>
	);
}

/**
 * @module IconControl
 */
export default forwardRef(IconControl);
