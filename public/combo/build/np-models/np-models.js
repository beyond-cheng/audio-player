YUI.add('np-models', function (Y, NAME) {

var JSON = Y.config.global.JSON,
	L = Y.Lang,
	NPModel = Y.namespace('NPModel');

function Sync () {
	this.publish('error', {defaultFn: this._defErrorFn});
}

Sync.prototype = {
	apis: {},
	httpMethods: {},

	buildURL: function (action) {
		return this.apis[action];
	},

	_defErrorFn: function (e) {
		var o = e.options || {},
			errorFn = o.errorFn || Y.message;

		if (o.attrs) {
			this.undo();
		}

		errorFn(e.error);
	},

	_onSyncIOSuccess: function (id, res, callback) {
		var data = {};

		if(!callback) {return;}

		try {
			data = JSON.parse(res.responseText);
		} catch(e) {
			data = {message: '返回数据格式错误！'};
		}

		if(data.message) {
			callback(data);
		} else {
			callback(null, data);
		}
	},

	_onSyncIOFailure: function (id, res, callback) {
		var data;

		if (!callback || !res.status) {return;}

		try {
			data = JSON.parse(res.responseText);
		} catch (e) {
			data = {message: res.responseText || res.statusText};
		}

		callback(data.message);
	},

	sync: function (action, options, callback) {
		var method = this.httpMethods[action],
			headers = {},
			data;

		options || (options = {});

		headers['Accept'] = 'application/json';

		if(method === 'get') {
			headers['If-Modified-Since'] = '0';
		} else {
			if (options.attrs) {
				this.setAttrs(options.attrs);
			}
			headers['Content-Type'] = 'application/json';
			data = JSON.stringify(options.attrs);
		}

		if(this._req && this._req.isInProgress()) {return;}
		
		this._req = Y.io(this.buildURL(action, options), {
			method: method,
			headers: headers,
			data: data,

			'arguments': callback,
			context: this,
			on: {
				success: this._onSyncIOSuccess,
				failure: this._onSyncIOFailure
			}
		});
	},

	parse: function (res) {
		return res ? res.data : null;
	}
};

NPModel.Sync = Sync;Y.User = Y.Base.create('user', Y.Model, [Sync], {
	apis: {
		create: '/api/user'
	},
	httpMethods: {
		create: 'post'
	}
	
}, {
	ATTRS: {
		name: {value: null},
		password: {value: null}
	}
});

Y.Audio = Y.Base.create('audio', Y.Model, [Sync], {

}, {
	ATTRS: {
		name: {value: null},
		author: {value: null},
		duration: {value: null},
		src: {value: null},
		lyric: {value: null},

		belong_album: {value: null}
	}
});

Y.Album = Y.Base.create('album', Y.Model, [Sync], {

}, {
	ATTRS: {
		name: {value: null},
		avatar: {value: null},
		audio_num: {value: null},
		audio_collection: {value: null}
	}
});

}, '@VERSION@', {"requires": ["model", "io-base", "json-stringify"]});
