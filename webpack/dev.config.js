const ExtractTextPlugin = require("extract-text-webpack-plugin");
const config = require("../webpack.config.js");

config.watch = true;
config.devtool = "source-map";
config.plugins.push(
	new ExtractTextPlugin({ filename: "./css/instant-images.css" })
);

module.exports = config;
