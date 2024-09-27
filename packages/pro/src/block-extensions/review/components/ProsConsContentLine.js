// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from 'react';
import { RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import withContext from './hoc/withContext';
import Tween from '@Base/js/components/Tween.js';
import IconComponent from './IconComponent';

/**
 * Content line.
 *
 * @param {Object}        props                     component properties
 * @param {string}        props.text                content text
 * @param {string}        props.id                  content id
 * @param {Function}      props.lineChangedCallback line changed/updated callback
 * @param {Function}      props.keyDownCallback     key down callback function
 * @param {string}        props.activeLineId        active line id, will be supplied via HOC
 * @param {Function}      props.setActiveLineId     set active line id, will be supplied via HOC
 * @param {string | null} props.lineToRemove        id of line about to be removed, will be supplied via HOC
 * @param {Function}      props.deleteTargetContent delete target line content, will be supplied via HOC
 * @param {string}        props.lineIconName        line icon name
 * @param {number}        props.lineIconSize        line icon size
 * @param {string}        props.lineIconColor       line icon color
 */
function ProsConsContentLine({
	text,
	id,
	lineChangedCallback,
	keyDownCallback,
	activeLineId,
	setActiveLineId,
	lineToRemove,
	deleteTargetContent,
	lineIconName,
	lineIconSize,
	lineIconColor,
}) {
	const wrapperRef = useRef(null);
	const iconRef = useRef(null);

	/**
	 * Active status of this content line.
	 *
	 * @return {boolean} active status
	 */
	const isLineActive = () => {
		return id === activeLineId;
	};

	/**
	 * Start line remove process.
	 */
	const startLineRemoveProcess = () => {
		const { height } = wrapperRef.current.getBoundingClientRect();
		wrapperRef.current.style.height = `${height}px`;

		const { height: iconHeight } = iconRef.current.getBoundingClientRect();
		iconRef.current.style.height = `${iconHeight}px`;

		Tween(height, 0, 200, (currentHeight, isFinished) => {
			wrapperRef.current.style.height = `${currentHeight}px`;

			if (isFinished) {
				deleteTargetContent(id);
			}
		});

		Tween(iconHeight, 0, 200, (currentHeight) => {
			if (iconRef.current) {
				iconRef.current.style.height = `${currentHeight}px`;
			}
		});
	};

	// check line removal process
	useEffect(() => {
		if (lineToRemove === id) {
			startLineRemoveProcess();
		}
	}, [lineToRemove]);

	// handle active line id changes
	useEffect(() => {
		if (isLineActive()) {
			wrapperRef.current.childNodes[0].focus();
		}
	}, [activeLineId]);

	// handle empty text and fresh created line visuals
	useEffect(() => {
		if (text === '') {
			const { height } = wrapperRef.current.getBoundingClientRect();
			wrapperRef.current.style.height = '0px';

			const { height: iconHeight } =
				iconRef.current.getBoundingClientRect();
			iconRef.current.style.height = '0px';

			Tween(0, height, 200, (currentHeight, isFinished) => {
				wrapperRef.current.style.height = `${currentHeight}px`;

				if (isFinished) {
					wrapperRef.current.style.height = 'unset';
				}
			});

			Tween(0, iconHeight, 200, (currentHeight, isFinished) => {
				iconRef.current.style.height = `${currentHeight}px`;

				if (isFinished) {
					iconRef.current.style.height = 'unset';
				}
			});
		}
	}, [text]);

	return (
		<tr
			className={'content-row'}
			data-line-active={JSON.stringify(isLineActive())}
			id={id}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();

				setActiveLineId(id);
			}}
		>
			<td>
				<IconComponent
					ref={iconRef}
					name={lineIconName}
					size={lineIconSize}
					color={lineIconColor}
				/>
			</td>
			<td>
				{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
				<div
					ref={wrapperRef}
					data-line-active={JSON.stringify(isLineActive())}
					role={'listitem'}
					onKeyDown={(e) => keyDownCallback(e, id)}
					className={'content-line'}
					id={id}
				>
					<RichText
						className={'content-text'}
						placeholder={__(
							'Enter your text…',
							'ultimate-blocks-pro'
						)}
						value={text}
						onChange={(val) => lineChangedCallback(val, id)}
						disableLineBreaks={true}
					/>
				</div>
			</td>
		</tr>
	);
}

// context map
const contextMap = ({
	activeLineId,
	setActiveLineId,
	lineToRemove,
	deleteTargetContent,
}) => ({
	activeLineId,
	setActiveLineId,
	lineToRemove,
	deleteTargetContent,
});

/**
 * @module ProsConsContentLine
 */
export default withContext(ProsConsContentLine, contextMap);
