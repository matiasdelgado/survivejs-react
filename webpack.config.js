const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const stylelint = require('stylelint');
const glob = require('glob');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
	app: path.join(__dirname, 'app'),
	build: path.join(__dirname, 'build'),
	style: glob.sync('./app/**/*.css'),
	test: glob.sync('./app/**/*.spec.js')
}

process.env.BABEL_ENV = TARGET;

const common = {
	entry: {
		app: PATHS.app
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	output: {
		path: PATHS.build,
		filename: '[name].js'
	},
	module: {
		preLoaders: [
			{ test: /\.css$/, loaders: ['postcss'], include: PATHS.app }
		],
		loaders: [
			{ test: /\.jsx?$/, loaders: ['babel?cacheDirectory'], include: PATHS.app }
		]
	},
	postcss: function() {
		return [stylelint({
			rules: {
				'color-hex-case': 'lower'
			}
		})]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'node_modules/html-webpack-template/index.ejs',
			title: 'Kanban app',
			appMountId: 'app',
			inject: false
		})
	]
}

if (TARGET === 'start' || !TARGET) {
	module.exports = merge(common, {
		entry: {
			style: PATHS.style
		},
		devtool: 'eval-source-map',
		devServer: {
			historyApiFallback: true,
			hot: true,
			inline: true,
			progress: true,
			stats: 'errors-only',
			host: process.env.HOST,
			port: process.env.PORT
		},
		module: {
            preLoaders: [
                { test: /\.jsx?$/, loaders: ['eslint'], include: PATHS.app }
            ],
			loaders: [
				{ test: /\.css$/, loaders: ['style', 'css'], include: PATHS.app }
			]
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new NpmInstallPlugin({
				save: true
			})
		]
	});
}
if (TARGET === 'build' || TARGET === 'stats') {
	module.exports = merge(common, {
		entry: {
			vendor: Object.keys(pkg.dependencies).filter(function(v) {
				return v !== 'alt-utils';
			}),
			style: PATHS.style
		},
        output: {
            path: PATHS.build,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[chunkhash].js'
        },
		module: {
            preLoaders: [
                { test: /\.jsx?$/, loaders: ['eslint'], include: PATHS.app }
            ],
			loaders: [
				{ test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css'), include: PATHS.app }
            ]
		},
		plugins: [
			new CleanPlugin([PATHS.build], { verbose: false }),
			new webpack.optimize.CommonsChunkPlugin({
				names: ['vendor', 'manifest']
			}),
			new ExtractTextPlugin('[name].[chunkhash].css'),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': '"production"'
			}),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			})
		]
	});
}
if (TARGET === 'test' || TARGET === 'tdd') {
	module.exports = merge(common, {
        entry: null,
		devtool: 'inline-source-map',
		resolve: {
			alias: {
				'app': PATHS.app
			}
		},
		module: {
			preLoaders: [
				{ test: /\.jsx?$/, loaders: ['isparta-instrumenter'], include: PATHS.app }
			],
			loaders: [
				{ test: /\.jsx?$/, loaders: ['babel?cacheDirectory'], include: PATHS.app }
			]
		}
	});
}
