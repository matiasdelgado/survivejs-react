module.exports = function (config) {
	config.set({
		frameworks: ['mocha'],
		reporters: ['spec', 'coverage'],
		files: [
			'node_modules/phantomjs-polyfill/bind-polyfill.js',
			'tests/**/*_test.jsx'
		],
		preprocessors: {
			'./tests/**/*_test.jsx': ['webpack']
		},
		browsers: ['PhantomJS'],
		singleRun: true,
		coverageReporter: {
			dir: 'build/coverage',
			type: 'html'
		},
		webpack: require('./webpack.config'),
		// webpackMiddleware: {
		// 	noInfo: true
		// }
	});
}
