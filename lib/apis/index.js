var fs = require('fs'),
	path = require('path'),
	exists  = fs.existsSync || path.existsSync,
	
	dirPath = path.join('models', 'apis'),

	apis = {
		'/api/user': {post: 'user.json'},
		'/api/albums': {get: 'albums.json'},
		'/api/albums/:id': {get: 'audios.json'}
	};

function parser(filename) {
	return function (req, res, next) {
		var data, file;

		if(req.params.id) {
			var arr = filename.split('.');
			
			file = path.join(dirPath, [arr[0] + '_' + req.params.id, arr[1]].join('.'));
		} else {
			file = path.join(dirPath, filename);
		}

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
		if(app.locals.loginTimer) {
			clearTimeout(app.locals.loginTimer);
		}
		//设置登陆过期时间
		app.locals.loginTimer = setTimeout(function () {
			delete app.locals.user;
		}, 60 * 10 * 1000);
		next();
	});

	for(var x in apis) {
		var item = apis[x];

		for(var y in item) {
			app[y](x, parser(item[y]));
		}
	}
}