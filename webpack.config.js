const defaults = require("@wordpress/scripts/config/webpack.config");
const { DefinePlugin } = require("webpack");
/**
 * Webpack config (Development mode)
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-scripts/#provide-your-own-webpack-config
 */
module.exports = {
	...defaults,
	entry: {
		"instant-images": "./src/js/index.js",
		"media-modal": "./src/js/media-modal.js",
		"plugin-sidebar": "./src/js/plugin-sidebar.js",
	},
};
