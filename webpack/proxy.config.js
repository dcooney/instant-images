const { merge } = require("webpack-merge");
const common = require("../webpack.config.js");
const { DefinePlugin } = require("webpack");

/**
 * Webpack config (Proxy mode).
 * This mode is used during proxy development.
 *
 * @see https://webpack.js.org/guides/production/
 */
module.exports = merge(common, {
	plugins: [
		new DefinePlugin({
			PROXY_URL: JSON.stringify("http://localhost:3000/api/"),
		}),
	],
});
