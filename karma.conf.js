module.exports = function (config) {
	config.set({
		frameworks: ['mocha'],
		reporters: ['spec', 'coverage'],
		files: [
			'node_modules/phantomjs-polyfill/bind-polyfill.js',
			'app/**/*.spec.jsx'
		],
		preprocessors: {
			'app/**/*.jsx': ['webpack']
		},
		browsers: ['PhantomJS'],
		singleRun: true,
		coverageReporter: {
			dir: 'build/coverage',
			type: 'html'
		},
		webpack: require('./webpack.config')
	});
}
