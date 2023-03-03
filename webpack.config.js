const defaults = require("@wordpress/scripts/config/webpack.config");
//const ESLintPlugin = require( 'eslint-webpack-plugin' );
const StylelintPlugin = require("stylelint-webpack-plugin");

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
	plugins: [
		...defaults.plugins,
		/**
		 * Report JS warnings and errors to the command line.
		 *
		 * @see https://www.npmjs.com/package/eslint-webpack-plugin
		 */
		//new ESLintPlugin(),

		/**
		 * Report css warnings and errors to the command line.
		 *
		 * @see https://www.npmjs.com/package/stylelint-webpack-plugin
		 */
		new StylelintPlugin(),
	],
};
