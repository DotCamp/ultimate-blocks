const ParcelBundler = require('./ParcelBundler');

const bundler = ParcelBundler();

try {
	bundler.run();
} catch (err) {
	// eslint-disable-next-line no-console
	console.log(err.diagnostics);
}
