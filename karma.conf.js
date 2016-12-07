module.exports = function karmaConfir(config) {
	config.set({
		frameworks: ['mocha'],
		reporters: ['spec', 'coverage'],
		files: [
			'node_modules/phantomjs-polyfill/bind-polyfill.js',
			'tests/**/*_test.js'
		],
		preprocessors: {
			'tests/**/*_test.*': ['webpack', 'sourcemap']
		},
		browsers: ['PhantomJS'],
		singleRun: true,
		coverageReporter: {
			dir: 'build/coverage',
			type: 'html'
		},
		webpack: require('./webpack.config'),
		webpackMiddleware: {
			noInfo: true
		}
	})
}