import BlockExtensionBase from '@Base/BlockExtensionBase';
import NewReviewMain from './block';

/**
 * Editor review block extension.
 */
class ReviewBlockExtension extends BlockExtensionBase {
	blockName() {
		return 'ub/review';
	}

	blockComponent() {
		return NewReviewMain;
	}
}

/**
 * @module ReviewBlockExtension
 */
export default ReviewBlockExtension;
