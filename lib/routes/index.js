module.exports = function (app) {
	function routePage(path, name, callback) {
		app.get(path, function (req, res) {
			// 权限控制，所有页面进去之前确保已登录，否则必须先进入 login 页面
			if(path !== '/login' && app.locals.user === undefined) {
				res.redirect('/login');
			}
			//退出登陆
			if(path === '/logout') {
				if(app.locals.loginTimer) {
					clearTimeout(app.locals.loginTimer);
				}
				delete app.locals.user;
				res.redirect('/login');
			}
			res.render(name);
		});
		callback && callback();
	};

	routePage('/', 'index');
	routePage('/login', 'login');
	routePage('/logout', 'logout');
};