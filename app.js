var express = require('express'),
	routes = require('./lib/routes'),
	apis = require('./lib/apis'),
	hbs = require('./lib/hbs'),
	config = require('./config'),
	combo = require('combohandler'),
	http = require('http'),
	path = require('path'),
	app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.enable('strict routing');

app.locals({
	seedURL: config.isDevelopment ? '/combo/build/seed/seed-debug.js' : '/combo/build/seed/seed-min.js',
	cssURL: '/css/common.css'
});

// all environments
app.set('port', config.port);
app.set('views', config.dirs.views);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (config.isDevelopment) {
	app.use(express.errorHandler());
}

routes(app);
apis(app);

// 获取js代码，利用combo工具合并js文件，减少http请求
app.get('/combo/' + config.version, [
	combo.combine({rootPath: path.join(config.dirs.pub, 'combo', 'build')}),
	combo.respond
]);
// 获取yui代码，利用combo工具合并js文件，减少http请求
app.get('/combo/yui/' + config.yui.version, [
	combo.combine({rootPath: path.join(__dirname, 'lib', 'yui', config.yui.version)}),
	combo.respond
]);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});