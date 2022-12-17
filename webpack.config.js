const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
const dir = "dist";

module.exports = {
	entry: {
		"instant-images": "./src/js/index.js",
		"instant-images-media": "./src/js/media-router.js",
		"instant-images-styles": "./src/scss/style.scss",
		"instant-images-block": "./src/js/block/index.js"
	},
	output: {
		path: path.join(__dirname, dir),
		filename: "js/[name].js"
	},
	watch: true,
	module: {
		rules: [
			{
				test: /.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				query: {
					presets: ["es2015", "react"]
				}
			},
			{
				test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
				loader: "file-loader",
				options: {
					name: "img/[name].[ext]",
					publicPath: "../"
				}
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						{
							loader: "css-loader",
							options: {
								sourceMap: true
							}
						},
						{
							loader: "postcss-loader",
							options: {
								sourceMap: true
							}
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: true,
								outputStyle: "expanded"
							}
						}
					]
				}),
				exclude: /node_modules/
			}
		]
	},

	plugins: []
};
