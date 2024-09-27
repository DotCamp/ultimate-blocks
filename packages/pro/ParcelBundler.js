const { Parcel } = require('@parcel/core');
const process = require('process');
const path = require('path');
const extraBundleTargetPaths = require('./extraBundleTargets.json');

const entries = extraBundleTargetPaths.entries.map((targetPath) => {
	return path.resolve(__dirname, targetPath);
});

const distDir = path.resolve(__dirname, extraBundleTargetPaths.distDir);

/**
 * Get parcel bundler for plugin extra asset bundling operations.
 *
 * @return {Parcel} parcel bundler instance
 * @function Object() { [native code] }
 */
function ParcelBundler() {
	const currentEnv = process.env.NODE_ENV ?? 'development';

	return new Parcel({
		entries,
		config: '@parcel/config-default',
		// mode: currentEnv ?? 'development',
		shouldDisableCache: true,
		defaultTargetOptions: {
			distDir,
			shouldOptimize: true,
		},
	});
}

/**
 * @module ParcelBundler
 */
module.exports = ParcelBundler;
