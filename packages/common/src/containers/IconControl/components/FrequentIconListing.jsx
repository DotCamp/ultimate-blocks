import { useEffect, useState } from 'react';
import IconCard from '@Containers/IconControl/components/IconCard.jsx';
import IconObject from '@Inc/js/IconObject';

/**
 * Listing for frequently used icons.
 *
 * @param {Object}            props                   component properties
 * @param {Array<IconObject>} [props.frequentList=[]] frequent icon name list
 * @param {number}            props.listSize          number of frequents to show
 * @param {Function}          props.onSelect          frequent icon selected callback
 * @function Object() { [native code] }
 */
function FrequentIconListing({ frequentList = [], listSize = 4, onSelect }) {
	const [listToUse, setListToUse] = useState([]);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		const slicedList = frequentList.slice(0, listSize);
		const emptySpaces = listSize - slicedList.length;

		for (let i = 0; i < emptySpaces; i++) {
			slicedList.push(null);
		}

		setListToUse(slicedList);
	}, [frequentList]);

	return (
		<div className={'ultimate-blocks-frequent-icon-listing'}>
			{listToUse.map((iconObj, index) => {
				return (
					<IconCard
						key={index}
						targetIcon={
							iconObj
								? iconObj
								: new IconObject('empty', { iconName: 'empty' })
						}
						isEmpty={iconObj === null}
						onClick={onSelect}
					/>
				);
			})}
		</div>
	);
}

/**
 * @module FrequentIconListing
 */
export default FrequentIconListing;
