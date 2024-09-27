const path = require('path');
const ft = require('fancy-terminal');
const ParcelBundler = require('./ParcelBundler');

const bundler = ParcelBundler();

(async () => {
	await bundler.watch((err, event) => {
		if (err) {
			throw err;
		}

		const { type, buildTime, changedAssets } = event;
		if (type === 'buildSuccess') {
			// eslint-disable-next-line array-callback-return
			changedAssets.forEach((asset) => {
				const fileName = path.parse(asset.filePath).base;
				// eslint-disable-next-line no-console
				console.log(
					`✨ Built ${ft.green(fileName)} in ${buildTime}ms!`
				);
			});
		} else if (event.type === 'buildFailure') {
			// eslint-disable-next-line no-console
			console.log(event.diagnostics);
		}
	});
})();
