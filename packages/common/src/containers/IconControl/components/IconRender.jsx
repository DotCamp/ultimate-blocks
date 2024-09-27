import IconObject from '@Inc/js/IconObject';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Icon render component
 *
 * @param {Object}     props            component properties
 * @param {IconObject} props.iconObject icon object
 * @param {string}     props.size       size
 * @function Object() { [native code] }
 */
function IconRender({ iconObject, size = 'lg' }) {
	return (
		<div className={'ultimate-blocks-icon-render'}>
			<FontAwesomeIcon icon={iconObject.getAttributes()} size={size} />
		</div>
	);
}

/**
 * @module IconRender
 */
export default IconRender;
