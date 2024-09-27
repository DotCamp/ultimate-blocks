import { __ } from '@wordpress/i18n';
import { v4 } from 'uuid';
import IconCard from '@Containers/IconControl/components/IconCard.jsx';
import IconObject from '@Inc/js/IconObject';
import { Fragment, useRef, useState, useEffect } from 'react';
import UbIntersectionObserver from '@Inc/js/components/UbIntersectionObserver.jsx';

/**
 * Icon listing component.
 *
 * @param {Object}            props                      component properties
 * @param {Array<IconObject>} props.iconList             icon list
 * @param {Function}          props.onIconSelect         icon select callback
 * @param {Function}          props.onIconClear          selection clear callback
 * @param {number}            [props.maxVisibleCards=30] maximum number of icon cards to show per pagination
 * @function Object() { [native code] }
 */
function IconListing({
	iconList,
	onIconSelect,
	onIconClear,
	maxVisibleCards = 30,
}) {
	const listingWrapperRef = useRef(null);

	const [currentPage, setCurrentPage] = useState(0);
	// eslint-disable-next-line no-unused-vars
	const [maxPage, setMaxPage] = useState(0);
	const [intersectionOperation, setIntersectionOperation] = useState(null);
	const [paginatedList, setPaginatedList] = useState([]);

	/**
	 * Paginate icon list.
	 */
	const paginateIconList = () => {
		const visibleCardNumber = currentPage * maxVisibleCards;
		const splicedIconList = iconList.slice(0, visibleCardNumber);
		setPaginatedList(splicedIconList);
	};

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		const calculatedMaxPage = Math.ceil(iconList.length / maxVisibleCards);
		setMaxPage(calculatedMaxPage);

		setIntersectionOperation(v4());
		setCurrentPage(1);
		paginateIconList();
	}, [iconList]);

	/**
	 * useEffect hook.
	 */
	useEffect(() => {
		if (intersectionOperation !== null) {
			setCurrentPage(currentPage + 1);
			paginateIconList();
		}
	}, [intersectionOperation]);

	/**
	 * Render icon list
	 *
	 * @return {JSX.Element} icon list
	 */
	const renderIconList = () => {
		const cardComponents = paginatedList.map((iObj) => {
			return (
				<IconCard
					onClick={onIconSelect}
					key={iObj.getName()}
					targetIcon={iObj}
				/>
			);
		});

		return (
			<Fragment>
				<IconCard
					key={'clear_selection'}
					isEmpty={true}
					targetIcon={
						new IconObject('set_select_empty_icon', {
							iconName: 'clear selection',
						})
					}
					onClick={onIconClear}
				/>
				{cardComponents}
			</Fragment>
		);
	};

	const renderNoIconMessage = () => {
		return (
			<div className={'no-icon-listing'}>
				<i>{__('no icon found', 'ultimate-blocks')}</i>
			</div>
		);
	};

	return (
		<div ref={listingWrapperRef} className={'ultimate-blocks-icon-listing'}>
			{iconList.length > 0 ? renderIconList() : renderNoIconMessage()}
			<UbIntersectionObserver
				targetViewpoint={listingWrapperRef}
				threshold={0.5}
				visibleCallback={() => {
					setIntersectionOperation(v4());
				}}
			/>
		</div>
	);
}

/**
 * @module IconListing
 */
export default IconListing;
