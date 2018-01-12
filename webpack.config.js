var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
	entry: [
		'./src/js/index.js', 
		'./src/scss/style.scss'
	], 
	output: {
		filename: './js/instant-images.js',
		path: path.join(__dirname, 'dist'),
		publicPath: './dist/'
	},
	watch: true,
	module: {
		loaders: [
		{
			test: /.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: ['es2015', 'react']
			}
		},
		{ 
   		test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/, 
   		loader: "file-loader",
   		options: {
            name: 'img/[name].[ext]',
            publicPath: '../'
         }
      },
		{
			test: /\.scss$/,
			use: ExtractTextPlugin.extract({
				fallback: "style-loader",
				use: [
               { loader: 'css-loader' },
               { loader: 'postcss-loader' },
               { loader: 'sass-loader', 
                  options: {
                     outputStyle: 'expanded'
                  },
               }
             ]
			}),
			exclude: /node_modules/,
		}
	]},
	
	plugins: [
		new ExtractTextPlugin({ filename: './css/instant-images.css' })
	]
	
};