var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;

var IS_PRODUCTION = process.env.NODE_ENV === 'production';

var config = {
	devtool: 'eval',

	entry: [
		'webpack-hot-middleware/client?reload=true',
		path.join(__dirname, 'client/index.js')
	],

	output: {
		path: path.join(__dirname, 'static'),
		filename: 'app.js',
		publicPath: '/static/'
	},

	plugins: [
		new webpack.DefinePlugin({
			DEBUG: !IS_PRODUCTION
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin('css/default.css')
	],

	resolve: {
		modulesDirectories: ['node_modules', 'client'],
		extensions: ['', '.js', '.jsx']
	},

	module: {
		loaders: [
			{
				test: JS_REGEX,
				exclude: /node_modules/,
				include: path.join(__dirname, 'client'),
				loader: 'babel'
			},
			{
				test: /\.sass$/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!sass-loader?indentedSyntax')
			},
			{
				test: /\.(eot|woff|ttf|svg|png|jpg)$/,
				loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
			}
		],

		noParse: /\.min\.js/
	}

};

if (!IS_PRODUCTION) {
	config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (IS_PRODUCTION) {
	config.devtool = 'source-map';
	config.plugins.push(
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin()
	);
}

module.exports = config;
