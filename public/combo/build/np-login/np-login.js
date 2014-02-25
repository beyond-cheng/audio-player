YUI.add('np-login', function (Y, NAME) {

Y.LoginView = Y.Base.create('loginView', Y.View, [], {
	template: '<h2 class="login-title">登录' +
		'<span class="login-title-arrow">' +
			'<span class="login-title-arrow-inside"></span>' +
			'<span class="login-title-arrow-outside"></span>' +
		'</span>' +
	'</h2>' +
	'<div class="login-body">' +
		'<div class="login-field">' +
			'<label class="login-field-label" for="user-name">用户名</label>' +
			'<div class="login-field-element">' +
				'<input type="text" name="name" id="user-name" class="login-field-text" value="abc"/>' +
			'</div>' +
		'</div>' +
		'<div class="login-field">' +
			'<label class="login-field-label" for="user-password">密码</label>' +
			'<div class="login-field-element">' +
				'<input type="password" name="password" id="user-password" class="login-field-text" value="123"/>' +
			'</div>' +
		'</div>' +
		'<div class="login-field">' +
			'<div class="login-field-element">' +
				'<button id="user-save" class="button-normal">登陆</button>' +
			'</div>' +
		'</div>' +
	'</div>',

	events: {
		'#user-save': {
			click: 'saveUser'
		}
	},

	saveUser: function () {
		var model = this.get('model'),
			cont = this.get('container');

		model.save({
			attrs: {
				name: cont.one('#user-name').get('value'),
				password: cont.one('#user-password').get('value')
			}
		}, function (err, res) {
			if(!err) {
				location.href = '/';
			}
		});
	},

	render: function () {
		var cont = this.get('container');

		cont.setHTML(this.template);
		return this;
	}
});

}, '@VERSION@', {"requires": ["np-models", "view"]});
