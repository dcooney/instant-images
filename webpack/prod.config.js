const { merge } = require("webpack-merge");
const common = require("../webpack.config.js");
const { DefinePlugin } = require("webpack");

/**
 * Webpack config (Prod mode).
 * This mode is used during production and plugin development.
 *
 * @see https://webpack.js.org/guides/production/
 */
module.exports = merge(common, {
	plugins: [
		new DefinePlugin({
			PROXY_URL: JSON.stringify("https://proxy.getinstantimages.com/api/"),
		}),
	],
});
