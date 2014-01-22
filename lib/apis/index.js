var fs = require('fs'),
	path = require('path'),
	exists  = fs.existsSync || path.existsSync,
	
	dirPath = path.join('models', 'apis'),

	apis = {
		'/api/user': {post: 'user.json'}
	};

function parser(file) {
	return function (req, res, next) {
		var data;

		if(exists(file)) {
			data = fs.readFileSync(file, 'utf8');

			try {
				data = JSON.parse(data)
			} catch(e) {
				console.log('Failed to parse: ' + file);
			}
		}

		res.json(data);
	};
}

module.exports = function (app) {
	app.post('/api/user', function (req, res, next) {
		console.log(res.locals);
		app.locals.user = req.body.name;
		next();
	});

	for(var x in apis) {
		var item = apis[x];

		for(var y in item) {
			app[y](x, parser(path.join(dirPath, item[y])));
		}
	}
}