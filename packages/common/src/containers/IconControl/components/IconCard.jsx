import { Popover } from '@wordpress/components';
import IconObject from '@Inc/js/IconObject';
import { Fragment, useRef, useState } from 'react';
import IconRender from '@Containers/IconControl/components/IconRender.jsx';

/**
 * Icon card component for icon previews.
 *
 * @param {Object}     props            component properties
 * @param {IconObject} props.targetIcon
 * @param {boolean}    props.isEmpty    whether icon card is empty or not
 * @param {Function}   props.onClick    card click event callback
 * @function Object() { [native code] }
 */
function IconCard({ targetIcon, isEmpty = false, onClick }) {
	const wrapperAnchor = useRef(null);
	const [hoverStatus, setHoverStatus] = useState(false);

	const elementSetHoverStatus = (status) => (e) => {
		e.preventDefault();
		e.stopPropagation();
		setHoverStatus(status);
	};

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
		<div
			ref={wrapperAnchor}
			className={'ultimate-blocks-icon-card'}
			onMouseEnter={elementSetHoverStatus(true)}
			onMouseLeave={elementSetHoverStatus(false)}
			data-is-empty={isEmpty}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick(targetIcon.getName());
			}}
			data-icon={targetIcon.getName()}
		>
			{!isEmpty && (
				<Fragment>
					<IconRender iconObject={targetIcon} />
					{hoverStatus && (
						<Popover anchor={wrapperAnchor.current}>
							<div
								className={
									'ultimate-blocks-icon-card-popover-wrap'
								}
							>
								{targetIcon.getName()}
							</div>
						</Popover>
					)}
				</Fragment>
			)}
		</div>
	);
}

/**
 * @module IconCard
 */
export default IconCard;
