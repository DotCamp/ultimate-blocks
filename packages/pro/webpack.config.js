const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = {
	...defaultConfig,
	entry: {
		index: path.resolve(process.cwd(), 'src', 'index.js'),
		settingsMenu: path.resolve(
			process.cwd(),
			'src',
			'containers',
			'SettingsMenu.js'
		),
		style: path.resolve(process.cwd(), 'src', 'style.scss'),
		editor: path.resolve(process.cwd(), 'src', 'editor.scss'),
		menuStyle: path.resolve(
			process.cwd(),
			'src',
			'styles',
			'settingsMenu.sass'
		),
	},
	optimization: {
		...defaultConfig.optimization,
		splitChunks: {
			cacheGroups: {
				editor: {
					name: 'admin',
					test: /editor\.(sc|sa|c)ss$/,
					chunks: 'all',
					enforce: true,
				},
				style: {
					name: 'frontend',
					test: /style\.(sc|sa|c)ss$/,
					chunks: 'all',
					enforce: true,
				},
				menuStyle: {
					name: 'settings-menu',
					test: /settingsMenu\.(sc|sa|c)ss$/,
					chunks: 'all',
					enforce: true,
				},
				default: false,
			},
		},
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...defaultConfig.resolve.alias,
			'@Library': path.resolve(__dirname, 'inc/libraries'),
			'@Components': path.resolve(__dirname, 'src/components'),
			'@Managers': path.resolve(__dirname, 'src/managers'),
			'@Base': path.resolve(__dirname, 'src/base'),
			'@Stores': path.resolve(__dirname, 'src/stores'),
			'@Blocks': path.resolve(__dirname, 'src/blocks'),
		},
	},
	plugins: [
		...defaultConfig.plugins.filter(
			(p) =>
				!(
					p instanceof CleanWebpackPlugin ||
					p instanceof MiniCssExtractPlugin
				)
		),
		new MiniCssExtractPlugin({
			filename: '[name]/css/ultimate-blocks-pro-[name].css',
		}),
		new IgnoreEmitPlugin([
			'0.js',
			'2.js',
			'editor.js',
			'style.js',
			'editor.asset.php',
			'style.asset.php',
			'ultimate-blocks-pro-admin.asset.php',
		]),
		new DefinePlugin({
			UB_PRO_ENV: JSON.stringify(defaultConfig.mode),
		}),
	],
	output: {
		filename: (chunkData) => {
			switch (chunkData.chunk.name) {
				case 'index':
					return 'admin/js/ultimate-blocks-pro-admin.js';
				case 'settingsMenu':
					return 'settings-menu/js/ultimate-blocks-pro-settings-menu.js';
				default:
					return '[name].js';
			}
		},
		path: path.resolve(process.cwd(), 'inc'),
	},
};
