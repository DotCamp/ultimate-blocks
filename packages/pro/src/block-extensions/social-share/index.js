import BlockExtensionBase from '@Base/BlockExtensionBase.js';
import NewSocialShareMain from './block.js';

/**
 * Social share block extension.
 */
class SocialShareBlockExtension extends BlockExtensionBase {
	blockName() {
		return 'ub/social-share';
	}

	blockComponent() {
		return NewSocialShareMain;
	}
}

/**
 * @module SocialShareBlockExtension
 */
export default SocialShareBlockExtension;
