import { __ } from '@wordpress/i18n';

/**
 * Icon search input component.
 *
 * @param {Object}   props          component properties
 * @param {Function} props.onChange on change callback
 * @param {string}   props.value    input value
 * @function Object() { [native code] }
 */
function IconSearchInput({ onChange, value }) {
	return (
		<div className={'ultimate-blocks-icon-search-wrapper'}>
			<input
				className={'ultimate-blocks-icon-search-input'}
				type={'text'}
				value={value}
				placeholder={__('Search…', 'ub-common')}
				onInput={({ target }) => onChange(target.value)}
			/>
		</div>
	);
}

/**
 * @module IconSearchInput
 */
export default IconSearchInput;
