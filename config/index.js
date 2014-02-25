var path = require('path'),
	env = process.env;

module.exports = Object.freeze({
	port: env.PORT || 3000,
	isDevelopment: env.NODE_ENV !== 'production',
	isProduction : env.NODE_ENV === 'production',

	version: require('../package.json').version,
	name: require('../package.json').name,

	extname: '.hbs',

	dirs: Object.freeze({
		layouts: path.resolve('views/layouts'),
		partials: path.resolve('views/partials'),
		views: path.resolve('views'),
		pub: path.resolve('public')
	}),

	yui: {
		version: '3.14.0'
	}
});