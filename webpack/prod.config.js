var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var config = require('../webpack.config.js');

config.watch = false;
config.entry = {	
   'instant-images.min': './src/js/index.js',
   'instant-images-styles.min': './src/scss/style.scss',
   'instant-images-block.min': './src/js/block/index.js',
};

config.plugins.push(
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: '"production"'
		}
	}),
);

config.plugins.push(
	new ExtractTextPlugin({ filename: './css/instant-images.min.css' })
);

module.exports = config;
