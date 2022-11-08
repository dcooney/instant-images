var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var config = require("../webpack.config.js");

config.watch = false;
config.entry = {
	"instant-images": "./src/js/index.js",
	"instant-images.min": "./src/js/index.js",
	"instant-images-media": "./src/js/media-router.js",
	"instant-images-media.min": "./src/js/media-router.js",
	"instant-images-styles": "./src/scss/style.scss",
	"instant-images-styles.min": "./src/scss/style.scss",
	"instant-images-block": "./src/js/block/index.js",
	"instant-images-block.min": "./src/js/block/index.js"
};

config.plugins.push(
	new webpack.DefinePlugin({
		"process.env": {
			NODE_ENV: '"production"',
			PROXY_URL: '"https://proxy.getinstantimages.com/api/"'
		}
	})
);

config.plugins.push(
	new ExtractTextPlugin({ filename: "./css/instant-images.min.css" })
);

module.exports = config;
