Y.User = Y.Base.create('user', Y.Model, [Sync], {
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